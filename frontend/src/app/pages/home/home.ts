import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Slider } from '../../components/slider/slider';              // ← لا تغييره
// (لا نستخدم مكوّن Tabs هنا، لذلك لا نستورده لتجنّب التحذير)
import { ProductsService, Product as ApiProduct } from '../../services/products.service';
import { Card } from '../../components/product-card/card';
import { UiProduct } from '../../models/ui-product.model';

// نوع التبويبات الذي نستخدمه محليًا
type HomeTab = 'filter' | 'most' | 'fav';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule, RouterLink, Slider, Card],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class Home implements OnInit {
  // حالة التحميل/الخطأ
  loading = true;
  error = '';

  // التبويب الحالي
  activeTab: HomeTab = 'filter';

  // البيانات
  products: UiProduct[] = [];

  // عناصر هيكلية للتحميل
  skeletons = Array.from({ length: 8 });

  constructor(private productsApi: ProductsService) {}

  ngOnInit() {
    this.fetchProducts();
  }

  private fetchProducts() {
    this.loading = true;
    this.error = '';
    this.productsApi.list().subscribe({
      next: (api: ApiProduct[]) => {
        // نحرص أن تكون الأنواع رقمية كما تتطلب UiProduct
        this.products = api.map((p): UiProduct => ({
          id: Number(p.id),
          name: p.title,
          image: p.imageUrl ?? null,
          price: Number(p.price ?? 0),
          rating: Number(p.rating ?? 0),
        }));
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load products.';
        this.loading = false;
      }
    });
  }

  setTab(tab: HomeTab) {
    this.activeTab = tab;
  }

  // مصفوفة العرض حسب التبويب
  get viewProducts(): UiProduct[] {
    if (this.activeTab === 'filter') return this.products;
    if (this.activeTab === 'most')   return [...this.products].sort((a, b) => b.price - a.price);
    if (this.activeTab === 'fav')    return this.products.filter(p => (p.rating ?? 0) >= 4);
    return this.products;
  }

  // trackBy لتقليل إعادة التصيير
  trackById = (_: number, p: UiProduct) => p.id;
}
