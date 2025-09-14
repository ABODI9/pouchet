import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { catchError, map, shareReplay, startWith } from 'rxjs/operators';

import { Slider } from '../../components/slider/slider';
import { Card } from '../../components/product-card/card';
import { ProductsService, Product as ApiProduct } from '../../services/products.service';
import { UiProduct } from '../../models/ui-product.model';

type HomeTab = 'filter' | 'most' | 'fav';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule, RouterLink, Slider, Card],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  // ✅ استخدم inject بدلاً من حقن الكونسركتر لتفادي التحذير
  private productsApi = inject(ProductsService);

  // ✅ public عشان القالب يقرأها
  tab$ = new BehaviorSubject<HomeTab>('filter');
  setTab(tab: HomeTab) { this.tab$.next(tab); }

  skeletons = Array.from({ length: 8 });

  // نحمّل الـ API، ونحوّل الخطأ لقيمة قابلة للعرض بدل رميه
  private productsRaw$ = this.productsApi.list().pipe(
    startWith(null as unknown as ApiProduct[]),      // يشغل حالة التحميل
    catchError(() => of([] as ApiProduct[])),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  // تحويل API → UI (id كنصي)
  products$ = this.productsRaw$.pipe(
    map(list => Array.isArray(list) ? list : []),
    map(list => list.map<UiProduct>(p => ({
      id: String(p.id),
      name: p.title,
      image: p.imageUrl ?? null,
      price: Number(p.price ?? 0),
      rating: p.rating ?? null,
      description: (p as any).description ?? null,
    }))),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  // حالات الواجهة
  loading$ = this.productsRaw$.pipe(map(x => x === (null as any)));
  error$   = this.productsRaw$.pipe(
    map(x => (x === (null as any) ? '' : Array.isArray(x) ? '' : 'Failed to load products.'))
  );

  // اختيار العرض حسب التبويب
  viewProducts$ = combineLatest([this.products$, this.tab$]).pipe(
    map(([list, tab]) => {
      if (tab === 'most') return [...list].sort((a, b) => b.price - a.price);
      if (tab === 'fav')  return list.filter(p => (p.rating ?? 0) >= 4);
      return list;
    })
  );

  // trackBy يرجّع string
  trackById = (_: number, p: UiProduct) => p.id;
}
