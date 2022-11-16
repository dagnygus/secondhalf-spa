import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentPhotosComponent } from './current-photos.component';

describe('CurrentPhotosComponent', () => {
  let component: CurrentPhotosComponent;
  let fixture: ComponentFixture<CurrentPhotosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrentPhotosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentPhotosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
