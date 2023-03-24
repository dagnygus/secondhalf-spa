import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleMemberChatCloudsComponent } from './single-member-chat-clouds.component';

describe('SingleMemberChatCloudsComponent', () => {
  let component: SingleMemberChatCloudsComponent;
  let fixture: ComponentFixture<SingleMemberChatCloudsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleMemberChatCloudsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleMemberChatCloudsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
