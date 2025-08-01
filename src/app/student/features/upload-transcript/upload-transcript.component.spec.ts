import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadTranscriptComponent } from './upload-transcript.component';

describe('UploadTranscriptComponent', () => {
  let component: UploadTranscriptComponent;
  let fixture: ComponentFixture<UploadTranscriptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UploadTranscriptComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UploadTranscriptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
