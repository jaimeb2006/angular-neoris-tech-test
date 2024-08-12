import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRegistrationRoutingModule } from './product-registration-routing.module';
import { ProductRegistrationComponent } from './product-registration.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ProductRegistrationComponent],
  imports: [
    CommonModule,
    ProductRegistrationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class ProductRegistrationModule {}
