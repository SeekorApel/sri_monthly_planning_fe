import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeaderMoComponent } from './header-mo/header-mo.component';

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
      path: 'transaksi/header-mo',
      component: HeaderMoComponent,
      data: {
        title: 'Header Monthly Planning'
      }
    }
  ]

}]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransaksiRoutingModule { }
