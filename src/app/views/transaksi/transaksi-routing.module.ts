import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewMoPpcComponent } from './marketing-order/ppc/view-mo-ppc/view-mo-ppc.component';
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
      path: 'transaksi/view-mo-ppc',
      component: ViewMoPpcComponent,
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
