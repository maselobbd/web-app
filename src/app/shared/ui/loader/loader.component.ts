import { Component, Input } from '@angular/core';
import { LoaderService } from '../../data-access/services/loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss',
})
export class LoaderComponent {
  constructor(public loader: LoaderService) {}
}
