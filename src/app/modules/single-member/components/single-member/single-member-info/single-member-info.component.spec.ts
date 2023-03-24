import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleMemberInfoComponent } from './single-member-info.component';

describe('SingleMemberInfoComponent', () => {
  let component: SingleMemberInfoComponent;
  let fixture: ComponentFixture<SingleMemberInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleMemberInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleMemberInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
