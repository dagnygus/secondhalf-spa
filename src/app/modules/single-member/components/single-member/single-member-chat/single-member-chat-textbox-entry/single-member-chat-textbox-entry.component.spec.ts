import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleMemberChatTextboxEntryComponent } from './single-member-chat-textbox-entry.component';

describe('SingleMemberChatTextboxEntryComponent', () => {
  let component: SingleMemberChatTextboxEntryComponent;
  let fixture: ComponentFixture<SingleMemberChatTextboxEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleMemberChatTextboxEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleMemberChatTextboxEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
