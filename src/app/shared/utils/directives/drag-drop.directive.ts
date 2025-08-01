import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appDragDrop]',
})
export class DragDropDirective {
  @Output()
  fileDropped: EventEmitter<FileList> = new EventEmitter<FileList>();

  @Output()
  fileBytes: EventEmitter<any> = new EventEmitter<any>();

  reader: FileReader = new FileReader();

  constructor() {}

  @HostListener('dragover', ['$event'])

  // will implement this later, hopefully change styles to show dragover
  onDragOver(event: any) {
    event.preventDefault();
    event.stopPropagation();
  }

  @HostListener('dragleave', ['$event'])
  // Will implement these later, hopefully to change styles back to show dragleave
  onDragLeave(event: any) {
    event.preventDefault();
    event.stopPropagation();
  }

  @HostListener('drop', ['$event'])
  onDrop(event: any) {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer.files;

    if (files.length > 0) {
      this.fileDropped.emit(files);
    }
  }
}
