import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleMemberChatComponent } from './single-member-chat.component';

describe('SingleMemberChatComponent', () => {
  let component: SingleMemberChatComponent;
  let fixture: ComponentFixture<SingleMemberChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleMemberChatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleMemberChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
