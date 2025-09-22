import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface FeaturedItem {
  id: string;
  imageUrl: string;
  order: number;
  active: boolean;
  productId?: string;
  caption?: string;
  openInNewTab?: boolean;
}

@Injectable({ providedIn: 'root' })
export class FeaturedService {
  private http = inject(HttpClient);
  private base = environment.api.replace(/\/$/, '');
  private path = 'featured';

  private _updated = new Subject<void>();
  updated$ = this._updated.asObservable();

  list(): Observable<FeaturedItem[]> {
    return this.http.get<FeaturedItem[]>(`${this.base}/${this.path}`);
  }
  getOne(id: string): Observable<FeaturedItem> {
    return this.http.get<FeaturedItem>(`${this.base}/${this.path}/${id}`);
  }
  createMany(
    files: File[],
    opts?: {
      order?: number;
      active?: boolean;
      productId?: string | null;
      caption?: string;
      openInNewTab?: boolean;
    },
  ): Observable<FeaturedItem[]> {
    const fd = new FormData();
    for (const f of files) fd.append('images', f);
    if (opts?.order != null) fd.append('order', String(opts.order));
    if (opts?.active != null) fd.append('active', String(opts.active));
    if (opts?.productId != null) fd.append('productId', opts.productId);
    if (opts?.caption != null) fd.append('caption', opts.caption);
    if (opts?.openInNewTab != null)
      fd.append('openInNewTab', String(!!opts.openInNewTab));
    return this.http
      .post<FeaturedItem[]>(`${this.base}/${this.path}`, fd)
      .pipe(tap(() => this._updated.next()));
  }
  update(id: string, body: FormData): Observable<FeaturedItem> {
    return this.http
      .put<FeaturedItem>(`${this.base}/${this.path}/${id}`, body)
      .pipe(tap(() => this._updated.next()));
  }
  remove(id: string) {
    return this.http
      .delete(`${this.base}/${this.path}/${id}`)
      .pipe(tap(() => this._updated.next()));
  }
  reorder(items: { id: string; order: number }[]) {
    return this.http
      .put<FeaturedItem[]>(`${this.base}/${this.path}/reorder`, { items })
      .pipe(tap(() => this._updated.next()));
  }
}
