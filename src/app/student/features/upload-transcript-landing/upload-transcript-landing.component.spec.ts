import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadTranscriptLandingComponent } from './upload-transcript-landing.component';

describe('UploadTranscriptLandingComponent', () => {
  let component: UploadTranscriptLandingComponent;
  let fixture: ComponentFixture<UploadTranscriptLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UploadTranscriptLandingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UploadTranscriptLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
