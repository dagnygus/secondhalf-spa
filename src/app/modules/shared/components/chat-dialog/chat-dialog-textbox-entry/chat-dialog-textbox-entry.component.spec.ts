import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatDialogTextboxEntryComponent } from './chat-dialog-textbox-entry.component';

describe('ChatDialogTextboxEntryComponent', () => {
  let component: ChatDialogTextboxEntryComponent;
  let fixture: ComponentFixture<ChatDialogTextboxEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatDialogTextboxEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatDialogTextboxEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
