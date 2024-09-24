import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewPlantComponent } from './view-plant/view-plant.component';
import { ViewSettingComponent } from './view-setting/view-setting.component';
import { ViewQuadrantComponent } from './view-quadrant/view-quadrant.component';


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
    },
    {
      path: 'master-data/view-setting',
      component: ViewSettingComponent,
      data: {
        title: 'Master Setting'
      }
    },
    {
      path: 'master-data/view-quadrant',
      component: ViewQuadrantComponent,
      data: {
        title: 'Master Quadrant'
      }
    }
  ]

}]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterDataRoutingModule { }
