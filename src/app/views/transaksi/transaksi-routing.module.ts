import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewMarketingOrderComponent } from './view-marketing-order/view-marketing-order.component';

const routes: Routes = [{

  path: '',
  data: {
    title: 'Transaksi'
  },
  children: [
    {
      path: '',
      redirectTo: ''
    },
    {
      path: 'transaksi/view-marketing-order',
      component: ViewMarketingOrderComponent,
      data: {
        title: 'View Marketing Order'
      }
    }
  ]

}]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransaksiRoutingModule { }
