import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Product, ProductsService } from '../../../services/products.service';

// Product في بعض الحالات الباك ممكن يرجع description=null، فنجعلها اختيارية هنا
type EditableProduct = Omit<Product, 'description'> & {
  description?: string | null;
};

@Component({
  selector: 'app-product-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-edit.html',
  styleUrls: ['./product-edit.scss'],
})
export class ProductEdit {
  private route = inject(ActivatedRoute);
  private api = inject(ProductsService);
  private router = inject(Router);

  id = '';
  product: EditableProduct | null = null;
  preview: string | null = null;
  fileError = '';
  loading = true;

  /** لو المستخدم حب يحذف الصورة بدون يرفع جديدة */
  private removeExistingImage = false;

  ngOnInit() {
    this.id = String(this.route.snapshot.paramMap.get('id'));
    this.api.getOne(this.id).subscribe({
      next: (p) => {
        this.product = {
          ...p,
          // اضمن أنواع سليمة
          imageUrl: p.imageUrl ?? null,
          rating: p.rating ?? null,
          // لو الباك ما يرجّع description نضبطها على ''
          description: (p as any).description ?? '',
        };
        this.preview = this.product.imageUrl || null;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        alert('Product not found');
        this.router.navigate(['/admin/products']);
      },
    });
  }

  onFileSelected(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    // فحص بسيط
    const max = 2 * 1024 * 1024;
    if (file.size > max) {
      this.fileError = 'Image exceeds 2MB';
      return;
    }
    this.fileError = '';

    // تم اختيار ملف جديد → ألغِ فلاغ الإزالة
    this.removeExistingImage = false;

    const reader = new FileReader();
    reader.onload = () => {
      this.preview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  clearPreview() {
    // حذف الصورة الحالية دون رفع جديدة
    this.preview = null;
    this.removeExistingImage = true;

    // تفريغ ملف الإدخال إن وجد
    const el = document.getElementById('image') as HTMLInputElement | null;
    if (el) el.value = '';
  }

  save() {
    if (!this.product || this.fileError) return;

    const fd = new FormData();
    fd.append('title', this.product.title);
    fd.append('price', String(this.product.price));
    if (this.product.rating != null)
      fd.append('rating', String(this.product.rating));
    // أرسل الوصف كسلسلة، وحوّل null إلى ''
    if (this.product.description != null)
      fd.append('description', String(this.product.description ?? ''));

    // إذا المستخدم اختار ملف
    const fileInput = document.getElementById(
      'image',
    ) as HTMLInputElement | null;
    const file = fileInput?.files?.[0];
    if (file) {
      fd.append('image', file);
    } else if (this.removeExistingImage) {
      // علّم الباك يحذف الصورة الحالية (لو مدعوم)
      fd.append('removeImage', 'true');
    }

    this.api.update(this.id, fd).subscribe({
      next: () => this.router.navigate(['/admin/products']),
      error: () => alert('Update failed'),
    });
  }
}
