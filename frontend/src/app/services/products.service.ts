// src/app/services/products.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Product {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  rating: number;
}

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private http = inject(HttpClient);
  private base = environment.api;

  list() { return this.http.get<Product[]>(`${this.base}/products`); }

  create(body: FormData): Observable<Product> {
    return this.http.post<Product>(`${this.base}/products`, body);
  }

  remove(id: string) { return this.http.delete(`${this.base}/products/${id}`); }
}
