import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadMultipleFilesDialogComponent } from './upload-multiple-files-dialog.component';

describe('UploadMultipleFilesDialogComponent', () => {
  let component: UploadMultipleFilesDialogComponent;
  let fixture: ComponentFixture<UploadMultipleFilesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UploadMultipleFilesDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UploadMultipleFilesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
