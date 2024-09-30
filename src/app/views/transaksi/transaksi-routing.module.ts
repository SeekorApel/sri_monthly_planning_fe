import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewMarketingOrderComponent } from './view-marketing-order/view-marketing-order.component';
import { AddMonthlyPlanningComponent } from './add-monthly-planning/add-monthly-planning.component';
import { ViewMonthlyPlanningComponent } from './view-monthly-planning/view-monthly-planning.component';

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
    },
    {
      path: 'transaksi/view-monthly-planning',
      component: ViewMonthlyPlanningComponent,
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
