import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FinancialProductsService } from './services/financial-products.service';
import { NotificationService } from './services/notification.service';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [FinancialProductsService, NotificationService],
})
export class CoreModule {}
