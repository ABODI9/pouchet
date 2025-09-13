import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturedEdit } from './featured-edit';

describe('FeaturedEdit', () => {
  let component: FeaturedEdit;
  let fixture: ComponentFixture<FeaturedEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturedEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeaturedEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
