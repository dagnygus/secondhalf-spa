import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntellectualPropertyComponent } from './intellectual-property.component';

describe('IntelectualPropertyComponent', () => {
  let component: IntellectualPropertyComponent;
  let fixture: ComponentFixture<IntellectualPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntellectualPropertyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IntellectualPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
