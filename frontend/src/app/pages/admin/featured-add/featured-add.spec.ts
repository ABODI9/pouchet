import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturedAdd } from './featured-add';

describe('FeaturedAdd', () => {
  let component: FeaturedAdd;
  let fixture: ComponentFixture<FeaturedAdd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturedAdd],
    }).compileComponents();

    fixture = TestBed.createComponent(FeaturedAdd);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
