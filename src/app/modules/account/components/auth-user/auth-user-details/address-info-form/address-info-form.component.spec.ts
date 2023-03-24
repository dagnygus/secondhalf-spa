import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressInfoFormComponent } from './address-info-form.component';

describe('AddressInfoFormComponent', () => {
  let component: AddressInfoFormComponent;
  let fixture: ComponentFixture<AddressInfoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddressInfoFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressInfoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
