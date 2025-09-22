import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

// مكوّناتك المستقلة
import { Header } from './components/header/header';
import { Slider } from './components/slider/slider';
import { Toasts } from './components/toast/toasts';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Header, Toasts],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App {}
