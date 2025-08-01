import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FileDownloadService } from '../../data-access/services/file-download-service.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { dataUrl } from '../../../shared/enums/dataURIs';
import { DecisionActions } from '../../enums/application-actions';
import { ButtonAction } from '../../../shared/enums/buttonAction';
@Component({
  selector: 'app-view-documents',
  templateUrl: './view-documents.component.html',
  styleUrl: './view-documents.component.scss',
})
export class ViewDocumentsComponent implements OnInit {
  pdfSource!: SafeUrl;
  buttonLabel = ButtonAction.ACTIONS;
  menuItems = [ButtonAction.DOWNLOAD]
  constructor(
    public dialogRef: MatDialogRef<ViewDocumentsComponent>,
    private fileDownloadService: FileDownloadService,
    private sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    if(data.menuItems)
    {
      this.menuItems = data.menuItems;
    }
  }

  ngOnInit(): void {
    if (!this.data) return;

    this.pdfSource = this.sanitizer.bypassSecurityTrustResourceUrl(
      dataUrl[this.data.fileExtention as keyof typeof dataUrl] +
        this.data.base64,
    );
  }

  download(): void {
    if (!this.pdfSource) return;

    this.fileDownloadService.downloadFile(this.data.documentUrl);
  }

  selected(event: number): void {
    switch (this.menuItems[event]) {
      case ButtonAction.DOWNLOAD:
        this.download();
        break;
      case ButtonAction.AMEND:
        this.dialogRef.close({
          action: DecisionActions.AMEND,
          file: this.data.documentUrl,
        });
        break;
      case ButtonAction.UPDATE:
        this.dialogRef.close({
          action: DecisionActions.UPDATE,
          file: this.data.documentUrl,
        });
        break;
      case ButtonAction.DELETE:
        this.dialogRef.close({
          action: DecisionActions.DELETE,
          file: this.data.documentUrl,
        });
        break;
    }
  }
}
