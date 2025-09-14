import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface CartItem {
  id: string;
  userId?: string | null;
  sessionId?: string | null;
  productId: string;
  productName: string;
  productImage?: string | null;
  unitPrice: string;     // نُخزنها كنص (الخادم يتوقع نص)
  quantity: number;
  notes?: string | null;
  status?: 'open' | 'ordered';
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private http = inject(HttpClient);
  private base = environment.api.replace(/\/$/, '');
  private path = 'cart';

  // ====== عداد العناصر في الأيقونة ======
  private _count = new BehaviorSubject<number>(0);
  /** Observable بعدد المنتجات في السلة لعرضه كبادج في الهيدر */
  count$ = this._count.asObservable();

  /** نولّد/نقرأ sessionId محليًا */
  get sessionId(): string {
    let sid = localStorage.getItem('sid');
    if (!sid) { sid = crypto.randomUUID(); localStorage.setItem('sid', sid); }
    return sid;
  }

  // ====== عمليات REST الأساسية ======
  list(params: { sessionId: string; status?: 'open' | 'ordered' }) {
    return this.http.get<CartItem[]>(`${this.base}/${this.path}`, { params });
  }

  add(input: {
    productId: string;
    productName: string;
    productImage?: string | null;
    unitPrice: string | number;
    quantity: number;
    notes?: string;
  }) {
    const body = {
      sessionId: this.sessionId,
      productId: input.productId,
      productName: input.productName,
      productImage: input.productImage ?? null,
      unitPrice: String(input.unitPrice),  // 👈 نحول لنص
      quantity: input.quantity,
      notes: input.notes ?? null,
    };
    return this.http.post<CartItem>(`${this.base}/${this.path}`, body)
      .pipe(tap(() => this.syncCount()));
  }

  update(id: string, body: Partial<{ quantity: number; notes: string; status: 'open' | 'ordered' }>) {
    return this.http.put<CartItem>(`${this.base}/${this.path}/${id}`, body)
      .pipe(tap(() => this.syncCount()));
  }

  remove(id: string) {
    return this.http.delete<{ ok: true }>(`${this.base}/${this.path}/${id}`)
      .pipe(tap(() => this.syncCount()));
  }

  clear(filter: { sessionId: string }) {
    // لو عندك endpoint مختلف عدّله هنا
    return this.http.post<{ ok: true }>(`${this.base}/${this.path}/clear`, filter)
      .pipe(tap(() => this.syncCount()));
  }

  // ====== مزامنة عداد السلة مع الخادم ======
  /** يقرأ عناصر السلة المفتوحة ويحدّث البادج */
  syncCount(): void {
    this.list({ sessionId: this.sessionId, status: 'open' })
      .pipe(map(items => items?.reduce((sum, it) => sum + (it.quantity ?? 0), 0) ?? 0))
      .subscribe({
        next: c => this._count.next(c),
        error: () => this._count.next(0),
      });
  }
}
