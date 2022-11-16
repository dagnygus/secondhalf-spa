import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPhotosComponent } from './new-photos.component';

describe('NewPhotosComponent', () => {
  let component: NewPhotosComponent;
  let fixture: ComponentFixture<NewPhotosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewPhotosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPhotosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
