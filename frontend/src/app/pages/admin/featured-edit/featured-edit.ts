import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FeaturedService, FeaturedItem } from '../../../services/featured.service';

@Component({
  selector: 'app-featured-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './featured-edit.html',
})
export class FeaturedEdit {
  private route = inject(ActivatedRoute);
  private api = inject(FeaturedService);
  private router = inject(Router);

  id = '';
  model: { order?: number; active?: boolean } = { order: 0, active: true };
  preview: string | null = null;
  fileError = '';
  loading = true;

  ngOnInit() {
    this.id = String(this.route.snapshot.paramMap.get('id'));
    this.api.getOne(this.id).subscribe({
      next: (it: FeaturedItem) => {
        this.model = { order: it.order ?? 0, active: it.active ?? true };
        this.preview = it.imageUrl || null;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        alert('Not found');
        this.router.navigate(['/admin/featured']);
      }
    });
  }

  onFileSelected(ev: Event) {
    const f = (ev.target as HTMLInputElement).files?.[0];
    if (!f) return;
    if (f.size > 2 * 1024 * 1024) { this.fileError = 'Image exceeds 2MB'; return; }
    this.fileError = '';
    const r = new FileReader();
    r.onload = () => this.preview = r.result as string;
    r.readAsDataURL(f);
  }

  save() {
    const fd = new FormData();
    fd.append('order', String(this.model.order ?? 0));
    fd.append('active', String(!!this.model.active));
    const file = (document.getElementById('image') as HTMLInputElement | null)?.files?.[0];
    if (file) fd.append('image', file);

    this.api.update(this.id, fd).subscribe({
      next: () => this.router.navigate(['/admin/featured']),
      error: () => alert('Update failed'),
    });
  }
}
