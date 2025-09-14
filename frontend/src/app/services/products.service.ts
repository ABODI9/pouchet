// src/app/services/products.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Product {
  id: string | number;             // يدعم النص والرقم
  title: string;
  price: number;
  imageUrl?: string | null;        // اختياري
  rating?: number | null;          // اختياري
  description?: string | null;     // ⬅️ مضاف للوصف
}

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private http = inject(HttpClient);
  private base = environment.api.replace(/\/$/, ''); // شيل / آخرية إن وجدت

  list(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.base}/products`);
  }

  getOne(id: string | number): Observable<Product> {
    return this.http.get<Product>(`${this.base}/products/${id}`);
  }

  create(body: FormData): Observable<Product> {
    return this.http.post<Product>(`${this.base}/products`, body);
  }

  update(id: string | number, body: FormData): Observable<Product> {
    return this.http.put<Product>(`${this.base}/products/${id}`, body);
  }

  remove(id: string | number): Observable<void> {
    return this.http.delete<void>(`${this.base}/products/${id}`);
  }
}
