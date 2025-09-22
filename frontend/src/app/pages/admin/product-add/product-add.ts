import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../../services/products.service';

@Component({
  selector: 'app-product-add',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './product-add.html',
  styleUrls: ['./product-add.scss'],
})
export class ProductAdd {
  private productsService = inject(ProductsService);

  product = {
    title: '',
    description: '',
    price: 0,
    image: null as File | null,
  };
  fileError = '';
  preview: string | null = null;

  private maxSize = 2 * 2024 * 2024; // 4MB
  private allowed = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];

  onFileSelected(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const f = input.files?.[0] ?? null;
    this.fileError = '';
    this.preview = null;
    this.product.image = null;

    if (!f) return;
    if (!this.allowed.includes(f.type)) {
      this.fileError = 'Please upload an image (PNG/JPG/WEBP/GIF).';
      return;
    }
    if (f.size > this.maxSize) {
      this.fileError = 'Maximum image size is 2MB.';
      return;
    }

    this.product.image = f;
    this.preview = URL.createObjectURL(f);
  }

  addProduct() {
    if (
      !this.product.title ||
      !this.product.price ||
      !this.product.image ||
      this.fileError
    ) {
      alert('Please fill in all required fields.');
      return;
    }

    const fd = new FormData();
    fd.append('title', this.product.title);
    fd.append('description', this.product.description ?? '');
    fd.append('price', String(this.product.price));
    fd.append('image', this.product.image!, this.product.image!.name);

    this.productsService.create(fd).subscribe({
      next: () => {
        alert('Product added successfully!');
        this.product = { title: '', description: '', price: 0, image: null };
        this.preview = null;
        const el = document.getElementById('image') as HTMLInputElement | null;
        if (el) el.value = '';
      },
      error: (e) => {
        console.error(e);
        alert('Something went wrong while adding the product.');
      },
    });
  }
}
