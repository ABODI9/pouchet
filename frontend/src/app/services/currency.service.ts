import { Injectable, signal } from '@angular/core';

export type CurrencyCode = 'SAR' | 'TRY' | 'EUR';

// Base prices are USD; tweak rates as you like
const RATES: Record<CurrencyCode, number> = {
  SAR: 3.75,
  TRY: 41.0,
  EUR: 0.85,
};

@Injectable({ providedIn: 'root' })
export class CurrencyService {
  private key = 'currency';
  code = signal<CurrencyCode>(this.read());

  set(c: CurrencyCode) {
    this.code.set(c);
    localStorage.setItem(this.key, c);
  }

  convertFromUSD(amountUSD: number): number {
    const v = amountUSD * RATES[this.code()];
    return Math.round((v + Number.EPSILON) * 100) / 100;
  }

  format(amountUSD: number): string {
    const code = this.code();
    const n = this.convertFromUSD(amountUSD);
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: code }).format(n);
  }

  private read(): CurrencyCode {
    const raw = (localStorage.getItem(this.key) || 'SAR') as CurrencyCode;
    return (['SAR', 'TRY', 'EUR'] as const).includes(raw) ? raw : 'SAR';
  }
}
