// frontend/src/app/pages/admin/featured-add/featured-add.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FeaturedService } from '../../../services/featured.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-featured-add',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './featured-add.html',
  styleUrls: ['./featured-add.scss'],
})
export class FeaturedAddSimple {
  private api = inject(FeaturedService);
  private router = inject(Router);

  // ✅ لا نستخدم null هنا مطلقًا
  model: {
    order: number;
    active: boolean;
    productId: string;      // فارغة = ما نرسلها
    caption: string;        // فارغة = ما نرسلها
    openInNewTab: boolean;
  } = {
    order: Math.floor(Date.now() / 1000),
    active: true,
    productId: '',
    caption: '',
    openInNewTab: false,
  };

  files: File[] = [];
  previews: string[] = [];
  fileError = '';
  dragging = false;
  loading = false;

  onFilesSelected(ev: Event) {
    const input = ev.target as HTMLInputElement;
    this.consumeFiles(Array.from(input.files ?? []));
    input.value = '';
  }

  onDragOver(e: DragEvent) { e.preventDefault(); this.dragging = true; }
  onDragLeave(e: DragEvent) { e.preventDefault(); this.dragging = false; }
  onDrop(e: DragEvent) {
    e.preventDefault();
    this.dragging = false;
    this.consumeFiles(Array.from(e.dataTransfer?.files ?? []));
  }

  private consumeFiles(picked: File[]) {
    if (!picked.length) return;
    const ALLOWED_MIME = new Set(['image/jpeg','image/png','image/webp','image/avif']);
    const ALLOWED_EXT  = new Set(['.jpg','.jpeg','.png','.webp','.avif']);

    const valid: File[] = [], tooBig: string[] = [], badType: string[] = [];
    for (const f of picked) {
      const ext = (f.name.match(/\.[^.]+$/)?.[0] || '').toLowerCase();
      const okType = ALLOWED_MIME.has(f.type) || ALLOWED_EXT.has(ext);
      const okSize = f.size <= 2 * 1024 * 1024;
      if (!okType) badType.push(f.name);
      else if (!okSize) tooBig.push(f.name);
      else valid.push(f);
    }
    for (const f of valid) {
      this.files.push(f);
      const r = new FileReader();
      r.onload = () => this.previews.push(r.result as string);
      r.readAsDataURL(f);
    }

    const msgs: string[] = [];
    if (badType.length) msgs.push(`Skipped: only JPG/PNG/WebP/AVIF → ${badType.join(', ')}`);
    if (tooBig.length) msgs.push(`Skipped >2MB: ${tooBig.join(', ')}`);
    this.fileError = msgs.join(' • ');
  }

  removeAt(i: number) { this.files.splice(i, 1); this.previews.splice(i, 1); }

  save() {
    if (!this.files.length) { alert('Select at least one image'); return; }
    this.loading = true;

    // ✅ حوّل القيم الفارغة لما يناسب API
    const productId = this.model.productId.trim();
    const caption   = this.model.caption.trim();

    const opts = {
      order: this.model.order,
      active: this.model.active,
      productId: productId ? productId : null,   // API يقبل null هنا
      caption: caption || undefined,             // وأما هنا فلا نرسل شيئًا
      openInNewTab: this.model.openInNewTab || undefined,
    };

    this.api.createMany(this.files, opts)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: () => this.router.navigateByUrl('/admin/featured'),
        error: (e) => alert(e?.error?.message || 'Upload failed'),
      });
  }
}
