import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { HomeRoutingModule } from './home-routing.module';
import { LayoutScreenComponent } from './layout-screen/layout-screen.component';
import { SharedModule } from '../shared/shared.module';
@NgModule({
  declarations: [LayoutScreenComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    SharedModule,
],
})
export class HomeModule {}
