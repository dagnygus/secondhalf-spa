import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterLoadingIndicatorComponent } from './router-loading-indicator.component';

describe('RouterLoadingIndicatorComponent', () => {
  let component: RouterLoadingIndicatorComponent;
  let fixture: ComponentFixture<RouterLoadingIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RouterLoadingIndicatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RouterLoadingIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
