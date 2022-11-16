import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CameraPictureInputComponent } from './camera-picture-input.component';

describe('CameraPictureInputComponent', () => {
  let component: CameraPictureInputComponent;
  let fixture: ComponentFixture<CameraPictureInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CameraPictureInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CameraPictureInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
