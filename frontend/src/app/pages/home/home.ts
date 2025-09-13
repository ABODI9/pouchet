// src/app/pages/home/home.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SliderComponent } from '../../components/slider/slider'; // ✅ use SliderComponent
import { Tabs, HomeTab } from '../../components/tabs/tabs';
import { ProductCardComponent, Product as UiProduct }
  from '../../components/product-card/product-card';
import { ProductsService, Product as ApiProduct }
  from '../../services/products.service';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule, SliderComponent, Tabs, ProductCardComponent], // ✅
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class Home implements OnInit {
  sliderImages = [
    'https://picsum.photos/seed/1/600/300',
    'https://picsum.photos/seed/2/600/300',
    'https://picsum.photos/seed/3/600/300',
  ];

  activeTab: HomeTab = 'filter';
  products: UiProduct[] = [];

  constructor(private productsApi: ProductsService) {}

  ngOnInit() {
    this.productsApi.list().subscribe((api: ApiProduct[]) => {
      this.products = api.map(p => ({
        id: Number(p.id),
        name: p.title,
        image: p.imageUrl,
        price: p.price,
        rating: p.rating ?? 0
      }));
    });
  }

  filteredProducts(): UiProduct[] {
    if (this.activeTab === 'filter') return this.products;
    if (this.activeTab === 'most')   return this.products.slice().sort((a,b)=> b.price - a.price);
    if (this.activeTab === 'fav')    return this.products.filter(p => (p.rating ?? 0) >= 4);
    return this.products;
  }
}
