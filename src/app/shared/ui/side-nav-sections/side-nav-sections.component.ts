import {
  Component,
  Input,
  ChangeDetectionStrategy,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-side-nav-sections',
  templateUrl: './side-nav-sections.component.html',
  styleUrls: ['./side-nav-sections.component.scss', '../../utils/styling/sidenav.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideNavSectionsComponent {
  @Input() isDark: boolean = false;
  @Input() dropdownData: any;
  @Input() navTitle: string = '';
  readonly isExpanded = signal(false);

}
