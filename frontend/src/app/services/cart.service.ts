import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, tap, switchMap, take } from 'rxjs';
import { environment } from '../../environments/environment';

export interface CartItem {
  id: string;
  userId?: string | null;
  sessionId?: string | null;
  productId: string;
  productName: string;
  productImage?: string | null;
  unitPrice: string;
  quantity: number;
  notes?: string | null;
  status?: 'open' | 'ordered';
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private http = inject(HttpClient);
  private base = environment.api.replace(/\/$/, '');
  private path = 'cart';

  private _count = new BehaviorSubject<number>(0);
  count$ = this._count.asObservable();

  private _items = new BehaviorSubject<CartItem[]>([]);
  items$ = this._items.asObservable();

  get sessionId(): string {
    let sid = localStorage.getItem('sid');
    if (!sid) { sid = crypto.randomUUID(); localStorage.setItem('sid', sid); }
    return sid;
  }

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

  // ===== مزامنة عدّاد وعناصر السلة =====
  syncCount(): void {
    this.list({ sessionId: this.sessionId, status: 'open' })
      .pipe(map(items => items?.reduce((sum, it) => sum + (it.quantity ?? 0), 0) ?? 0))
      .subscribe({ next: c => this._count.next(c), error: () => this._count.next(0) });
  }

  syncItems(): void {
    this.list({ sessionId: this.sessionId, status: 'open' })
      .subscribe({ next: items => this._items.next(items || []), error: () => this._items.next([]) });
  }

  // ===== الجديد: إضافة أو زيادة الكمية بدل تكرار السطر =====
  addOrIncrement(input: {
    productId: string;
    productName: string;
    productImage?: string | null;
    unitPrice: string | number;
    quantity?: number; // افتراضي 1
    notes?: string;
  }) {
    const qtyToAdd = Math.max(1, Number(input.quantity ?? 1));
    return this.list({ sessionId: this.sessionId, status: 'open' }).pipe(
      take(1),
      switchMap(items => {
        const existing = (items || []).find(it => it.productId === input.productId);
        if (existing) {
          const newQty = (existing.quantity || 0) + qtyToAdd;
          return this.update(existing.id, { quantity: newQty });
        }
        return this.add({ ...input, quantity: qtyToAdd });
      })
    );
  }
}
