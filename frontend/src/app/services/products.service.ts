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

  list(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.base}/products`);
  }

  getOne(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.base}/products/${id}`);
  }

  create(body: FormData): Observable<Product> {
    return this.http.post<Product>(`${this.base}/products`, body);
  }

  update(id: string, body: FormData): Observable<Product> {
    return this.http.put<Product>(`${this.base}/products/${id}`, body);
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/products/${id}`);
  }
}
