import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewPlantComponent } from './view-plant/view-plant.component';

const routes: Routes = [{

  path: '',
  data: {
    title: 'Master Data'
  },
  children: [
    {
      path: '',
      redirectTo: ''
    },
    {
      path: 'master-data/view-plant',
      component: ViewPlantComponent,
      data: {
        title: 'Master Plant'
      }
    }
  ]

}]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterDataRoutingModule { }
