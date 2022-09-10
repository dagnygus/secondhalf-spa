import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderSignInFormComponent } from './header-sign-in-form.component';

describe('HeaderSignInFormComponent', () => {
  let component: HeaderSignInFormComponent;
  let fixture: ComponentFixture<HeaderSignInFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderSignInFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderSignInFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
