import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafetyAndPolicyComponent } from './safety-and-policy.component';

describe('SafetyAndPolicyComponent', () => {
  let component: SafetyAndPolicyComponent;
  let fixture: ComponentFixture<SafetyAndPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SafetyAndPolicyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafetyAndPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
