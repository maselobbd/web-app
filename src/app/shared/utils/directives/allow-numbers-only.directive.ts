import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appAllowNumbersOnly]',
})
export class AllowNumbersOnlyDirective {
  regexStr: RegExp;
  @Input() maxValue=250000;
  
  constructor(private element: ElementRef) {
     this.regexStr = new RegExp(`^(?:${this.maxValue}(?:\\.00?)?|(?:[0-9]{1,${this.maxValue.toString().length}})(?:\\.[0-9]{0,2})?)$`);
  }

  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent) {
    const currentValue: string = this.element.nativeElement.value;
    const newValue: string = currentValue.concat(event.key);

    if (!this.regexStr.test(newValue)) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  @HostListener('paste', ['$event'])
  blockPaste(event: ClipboardEvent) {
    this.validateFields(event);
  }

  validateFields(event: ClipboardEvent) {
    event.preventDefault();
    const pasteData = event.clipboardData?.getData('text/plain') || '';
    const inputElement = this.element.nativeElement;
    const start = inputElement.selectionStart;
    const end = inputElement.selectionEnd;
    const currentValue = inputElement.value;

    const newValue = currentValue.slice(0, start) + pasteData + currentValue.slice(end);

    if (this.regexStr.test(newValue)) {
      inputElement.setRangeText(parseFloat(pasteData), start, end, 'end');
      
    }
  }
}
