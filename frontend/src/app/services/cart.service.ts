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
  unitPrice: string;   // يبقى كنص
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

  // ====== عناصر السلة المفتوحة لعرضها في السلة الجانبية ======
  private _items = new BehaviorSubject<CartItem[]>([]);
  /** عناصر السلة المفتوحة (signal/observable) */
  items$ = this._items.asObservable();

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
      unitPrice: String(input.unitPrice),
      quantity: input.quantity,
      notes: input.notes ?? null,
    };
    return this.http.post<CartItem>(`${this.base}/${this.path}`, body)
      .pipe(tap(() => { this.syncCount(); this.syncItems(); }));
  }

  update(id: string, body: Partial<{ quantity: number; notes: string; status: 'open' | 'ordered' }>) {
    return this.http.put<CartItem>(`${this.base}/${this.path}/${id}`, body)
      .pipe(tap(() => { this.syncCount(); this.syncItems(); }));
  }

  remove(id: string) {
    return this.http.delete<{ ok: true }>(`${this.base}/${this.path}/${id}`)
      .pipe(tap(() => { this.syncCount(); this.syncItems(); }));
  }

  clear(filter: { sessionId: string }) {
    return this.http.post<{ ok: true }>(`${this.base}/${this.path}/clear`, filter)
      .pipe(tap(() => { this.syncCount(); this.syncItems(); }));
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

  /** يقرأ عناصر السلة المفتوحة ويحدّث قائمة العناصر (للميني كارت) */
  syncItems(): void {
    this.list({ sessionId: this.sessionId, status: 'open' })
      .subscribe({
        next: items => this._items.next(items || []),
        error: () => this._items.next([]),
      });
  }
}
