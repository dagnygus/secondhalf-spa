import { RouterModule } from '@angular/router';
import { ProductsComponent } from './components/products/products.component';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';



@NgModule({
  declarations: [ ProductsComponent ],
  imports: [
    SharedModule,
    RouterModule.forChild([
      { path: '', component: ProductsComponent },
    ])
  ]
})
export class ProductsModule { }
