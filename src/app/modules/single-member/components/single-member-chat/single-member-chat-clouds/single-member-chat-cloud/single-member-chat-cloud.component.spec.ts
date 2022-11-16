import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleMemberChatCloudComponent } from './single-member-chat-cloud.component';

describe('SingleMemberChatCloudComponent', () => {
  let component: SingleMemberChatCloudComponent;
  let fixture: ComponentFixture<SingleMemberChatCloudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleMemberChatCloudComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleMemberChatCloudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
