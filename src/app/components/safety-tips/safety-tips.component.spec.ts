import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafetyTipsComponent } from './safety-tips.component';

describe('SafetyTipsComponent', () => {
  let component: SafetyTipsComponent;
  let fixture: ComponentFixture<SafetyTipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SafetyTipsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafetyTipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
