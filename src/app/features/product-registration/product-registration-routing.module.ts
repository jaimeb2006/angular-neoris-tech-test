import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductRegistrationComponent } from './product-registration.component';

const routes: Routes = [
  {
    path: '',
    component: ProductRegistrationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductRegistrationRoutingModule {}
