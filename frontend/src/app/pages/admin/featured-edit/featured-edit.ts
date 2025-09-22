// frontend/src/app/pages/admin/featured-edit/featured-edit.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  FeaturedService,
  FeaturedItem,
} from '../../../services/featured.service';

@Component({
  selector: 'app-featured-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './featured-edit.html',
  styleUrls: ['./featured-edit.scss'], // 👈 مهم: يربط ملف الـCSS
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

  // قيود الرفع
  private readonly ALLOWED_MIME = new Set([
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/avif',
  ]);
  private readonly MAX_SIZE = 2 * 1024 * 1024; // 2MB

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
      },
    });
  }

  onFileSelected(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const f = input.files?.[0];
    if (!f) return;

    // فحص النوع والحجم
    const okType =
      this.ALLOWED_MIME.has(f.type) ||
      /\.(jpg|jpeg|png|webp|avif)$/i.test(f.name);
    if (!okType) {
      this.fileError = 'Only JPG / PNG / WEBP / AVIF are allowed';
      input.value = '';
      return;
    }
    if (f.size > this.MAX_SIZE) {
      this.fileError = 'Image exceeds 2MB';
      input.value = '';
      return;
    }

    this.fileError = '';
    const r = new FileReader();
    r.onload = () => (this.preview = r.result as string);
    r.readAsDataURL(f);
  }

  save() {
    const fd = new FormData();
    fd.append('order', String(this.model.order ?? 0));
    fd.append('active', String(!!this.model.active));

    const file = (document.getElementById('image') as HTMLInputElement | null)
      ?.files?.[0];
    if (file) fd.append('image', file);

    this.api.update(this.id, fd).subscribe({
      next: () => this.router.navigate(['/admin/featured']),
      error: () => alert('Update failed'),
    });
  }
}
