import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [NgIf],
  templateUrl: './slider.html',
  styleUrls: ['./slider.scss']
})
export class Slider {
  @Input() images: string[] = [];
  index = 0;

  prev() { if (this.images.length) this.index = (this.index - 1 + this.images.length) % this.images.length; }
  next() { if (this.images.length) this.index = (this.index + 1) % this.images.length; }
}
