import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleMemberHeaderComponent } from './single-member-header.component';

describe('SingleMemberHeaderComponent', () => {
  let component: SingleMemberHeaderComponent;
  let fixture: ComponentFixture<SingleMemberHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleMemberHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleMemberHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
