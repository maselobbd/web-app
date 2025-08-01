import { Component } from '@angular/core';
import { AuthService } from './authentication/data-access/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'ukukhula';

  constructor(
    public authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.authService.updateLoggedInStatus();
  }

  login() {
    this.authService.login();
  }

  logout() {
    this.authService.logout();
  }
}
