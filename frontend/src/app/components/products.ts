import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from './product-card/product-card';

@Injectable({
  providedIn: 'root'
})
export class Products {
  constructor(private http: HttpClient) {}
  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>('/api/products');
  }
}
