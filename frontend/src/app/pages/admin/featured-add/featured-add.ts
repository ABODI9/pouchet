import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FeaturedService } from '../../../services/featured.service';

@Component({
  selector: 'app-featured-add',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './featured-add.html',
  styleUrls: ['./featured-add.scss'],
})
export class FeaturedAddSimple {
  private api = inject(FeaturedService);
  private router = inject(Router);

  files: File[] = [];
  previews: string[] = [];
  fileError = '';
  loading = false;

  onFilesSelected(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const picked = Array.from(input.files ?? []);
    if (!picked.length) return;

    const valid: File[] = [];
    const tooBig: string[] = [];
    const badType: string[] = [];

    for (const f of picked) {
      const okType = /^image\//.test(f.type);
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
    if (badType.length) msgs.push(`Skipped non-images: ${badType.join(', ')}`);
    if (tooBig.length) msgs.push(`Skipped >2MB: ${tooBig.join(', ')}`);
    this.fileError = msgs.join(' • ');
    input.value = '';
  }

  removeAt(i: number) {
    this.files.splice(i, 1);
    this.previews.splice(i, 1);
  }

  save() {
    if (!this.files.length) { alert('Select at least one image'); return; }
    this.loading = true;

    const baseOrder = Date.now();
    this.api.createMany(this.files, { active: true, order: baseOrder }).subscribe({
      next: () => this.router.navigate(['/admin/featured']),   // ← يروح لقائمة البنرات
      error: (e) => { this.loading = false; alert(e?.error?.message || 'Upload failed'); },
    });
  }
}
