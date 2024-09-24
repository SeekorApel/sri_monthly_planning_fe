import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewPlantComponent } from './view-plant/view-plant.component';
import { ViewProductComponent } from './view-product/view-product.component';
import { ViewPatternComponent } from './view-pattern/view-pattern.component';
import { ViewTassMachine } from './view-tassmachine/view-tassmachine.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Master Data',
    },
    children: [
      {
        path: '',
        redirectTo: '',
      },
      {
        path: 'master-data/view-plant',
        component: ViewPlantComponent,
        data: {
          title: 'Master Plant',
        },
      },
      {
        path: 'master-data/view-product',
        component: ViewProductComponent,
        data: {
          title: 'Master Product',
        },
      },
      {
        path: 'master-data/view-pattern',
        component: ViewPatternComponent,
        data: {
          title: 'Master Pattern',
        },
      },
      {
        path: 'master-data/view-tassmachine',
        component: ViewTassMachine,
        data: {
          title: 'Master Tass Machine',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MasterDataRoutingModule {}
