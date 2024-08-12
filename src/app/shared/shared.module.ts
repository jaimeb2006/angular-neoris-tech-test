import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BancoLogoComponent } from './components/banco-logo/banco-logo.component';
import { NotificationPopUpComponent } from './components/notification-pop-up/notification-pop-up.component';
import { NotificationConfirmarComponent } from './components/notification-confirmar/notification-confirmar.component';

@NgModule({
  declarations: [
    BancoLogoComponent,
    NotificationPopUpComponent,
    NotificationConfirmarComponent,
  ],
  imports: [CommonModule],
  exports: [
    BancoLogoComponent,
    NotificationPopUpComponent,
    NotificationConfirmarComponent,
  ],
})
export class SharedModule {}
