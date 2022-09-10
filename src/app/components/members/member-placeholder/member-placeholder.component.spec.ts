import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberPlaceholderComponent } from './member-placeholder.component';

describe('MemberPlaceholderComponent', () => {
  let component: MemberPlaceholderComponent;
  let fixture: ComponentFixture<MemberPlaceholderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemberPlaceholderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberPlaceholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
