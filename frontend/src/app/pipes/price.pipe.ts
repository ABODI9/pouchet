import { Pipe, PipeTransform, inject } from '@angular/core';
import { CurrencyService } from '../services/currency.service';

@Pipe({ name: 'price', standalone: true, pure: false })
export class PricePipe implements PipeTransform {
  private cur = inject(CurrencyService);
  transform(v: number | string | null | undefined): string {
    const n = typeof v === 'string' ? parseFloat(v) : (v ?? 0);
    return this.cur.format(Number.isFinite(n) ? (n as number) : 0);
  }
}
