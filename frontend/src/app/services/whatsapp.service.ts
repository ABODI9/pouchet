import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class WhatsappService {
  // بدّل الرقم لرقمك (بدون +)
  private phone = '905522808900';

  openMessage(text: string) {
    const q = encodeURIComponent(text);
    const url = `https://wa.me/${this.phone}?text=${q}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  productMessage(p: { id: number; name: string; price: number }) {
    return `مرحباً، أود شراء هذا المنتج:
- الاسم: ${p.name}
- السعر: ${p.price} $
- رابط المنتج: ${location.origin}/product/${p.id}`;
  }
}
