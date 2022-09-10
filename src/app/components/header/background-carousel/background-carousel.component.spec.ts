import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackgroundCarouselComponent } from './background-carousel.component';

describe('BackgroundCarouselComponent', () => {
  let component: BackgroundCarouselComponent;
  let fixture: ComponentFixture<BackgroundCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BackgroundCarouselComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BackgroundCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
