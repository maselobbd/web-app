import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-split-button',
  templateUrl: './split-button.component.html',
  styleUrl: './split-button.component.scss',
})
export class SplitButtonComponent {

  @Input({required:true}) menuItems:string[] = []
  @Input({required:true}) buttonLabel:string = '';
  @Output() selected = new EventEmitter<number>()

  selection(index:number)
  {
    this.selected.emit(index)
  }
}
