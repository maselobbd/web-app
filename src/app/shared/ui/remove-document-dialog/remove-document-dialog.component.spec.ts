import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveDocumentDialogComponent } from './remove-document-dialog.component';

describe('RemoveDocumentDialogComponent', () => {
  let component: RemoveDocumentDialogComponent;
  let fixture: ComponentFixture<RemoveDocumentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RemoveDocumentDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RemoveDocumentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
