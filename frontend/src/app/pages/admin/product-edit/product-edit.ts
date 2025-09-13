import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Product, ProductsService } from '../../../services/products.service';

// Extend your Product to allow optional description for the form
type EditableProduct = Product & { description?: string };

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

  /** If user clicks Remove (without uploading a new file), send a flag to clear server image */
  private removeExistingImage = false;

  ngOnInit() {
    this.id = String(this.route.snapshot.paramMap.get('id'));
    this.api.getOne(this.id).subscribe({
      next: (p) => {
        // Ensure we have fields used in the form
        this.product = { ...p };
        this.preview = p.imageUrl || null;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        alert('Product not found');
        this.router.navigate(['/admin/products']);
      }
    });
  }

  onFileSelected(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    // Basic validations
    const max = 2 * 1024 * 1024;
    if (file.size > max) { this.fileError = 'Image exceeds 2MB'; return; }
    this.fileError = '';

    // New file picked -> do not remove existing by flag
    this.removeExistingImage = false;

    const reader = new FileReader();
    reader.onload = () => { this.preview = reader.result as string; };
    reader.readAsDataURL(file);
  }

  clearPreview() {
    // User wants to remove current image without uploading a new one
    this.preview = null;
    this.removeExistingImage = true;
    // Also clear any chosen file in the input (if present)
    const el = document.getElementById('image') as HTMLInputElement | null;
    if (el) el.value = '';
  }

  save() {
    if (!this.product) return;
    if (this.fileError) return;

    const fd = new FormData();
    fd.append('title', this.product.title);
    fd.append('price', String(this.product.price));

    if (this.product.rating !== undefined && this.product.rating !== null) {
      fd.append('rating', String(this.product.rating));
    }
    if (this.product.description) {
      fd.append('description', this.product.description);
    }

    // Attach file if chosen
    const fileInput = document.getElementById('image') as HTMLInputElement | null;
    const file = fileInput?.files?.[0];
    if (file) {
      fd.append('image', file);
    } else if (this.removeExistingImage) {
      // Tell backend to clear existing image if supported
      fd.append('removeImage', 'true');
    }
    // Otherwise: no new file, no remove flag -> keep existing imageUrl on server

    this.api.update(this.id, fd).subscribe({
      next: () => this.router.navigate(['/admin/products']),
      error: () => alert('Update failed'),
    });
  }
}
