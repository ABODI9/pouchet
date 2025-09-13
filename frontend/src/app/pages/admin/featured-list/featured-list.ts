import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FeaturedService, FeaturedItem } from '../../../services/featured.service';

@Component({
  selector: 'app-featured-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './featured-list.html',
  styleUrls: ['./featured-list.scss'],
})
export class FeaturedList {
  private api = inject(FeaturedService);
  items: FeaturedItem[] = [];
  loading = true;
  error = '';

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.api.list().subscribe({
      next: (res) => {
        this.items = [...(res ?? [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        this.loading = false;
      },
      error: () => { this.error = 'Failed to load banners'; this.loading = false; }
    });
  }

  move(row: FeaturedItem, dir: 'up' | 'down') {
    const i = this.items.findIndex(x => x.id === row.id);
    const j = dir === 'up' ? i - 1 : i + 1;
    if (j < 0 || j >= this.items.length) return;

    const a = this.items[i], b = this.items[j];
    if (a.order == null) a.order = 0;
    if (b.order == null) b.order = 0;

    [a.order, b.order] = [b.order, a.order];
    this.items = [...this.items].sort((x, y) => (x.order ?? 0) - (y.order ?? 0));
    // TODO: API لإعادة الترتيب إن رغبت
  }

  toggle(row: FeaturedItem) {
    const fd = new FormData();
    if (row.productId != null && row.productId !== '') fd.append('productId', String(row.productId));
    fd.append('order', String(row.order ?? 0));
    fd.append('active', String(!row.active));
    if (typeof row.caption === 'string' && row.caption.trim() !== '') fd.append('caption', row.caption.trim());
    if (row.openInNewTab != null) fd.append('openInNewTab', String(!!row.openInNewTab));

    this.api.update(row.id, fd).subscribe({
      next: (s) => row.active = s.active,
      error: () => alert('Toggle failed'),
    });
  }

  confirmDelete(row: FeaturedItem) {
    if (!confirm('Delete this banner?')) return;
    this.api.remove(row.id).subscribe({
      next: () => this.items = this.items.filter(x => x.id !== row.id),
      error: () => alert('Delete failed'),
    });
  }

  trackById = (_: number, x: FeaturedItem) => x.id;
}
