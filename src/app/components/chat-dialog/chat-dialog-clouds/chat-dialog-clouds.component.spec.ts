import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatDialogCloudsComponent } from './chat-dialog-clouds.component';

describe('ChatDialogCloudsComponent', () => {
  let component: ChatDialogCloudsComponent;
  let fixture: ComponentFixture<ChatDialogCloudsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatDialogCloudsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatDialogCloudsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
