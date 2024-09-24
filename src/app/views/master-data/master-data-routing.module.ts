import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewPlantComponent } from './view-plant/view-plant.component';
import { ViewSettingComponent } from './view-setting/view-setting.component';
import { ViewQuadrantComponent } from './view-quadrant/view-quadrant.component';
import { ViewProductTypeComponent } from './view-product-type/view-product-type.component';
import { ViewSizeComponent } from './view-size/view-size.component';
import { ViewBuildingComponent } from './view-building/view-building.component';
import { ViewBDistanceComponent } from './view-bdistance/view-bdistance.component';
import { ViewQDistanceComponent } from './view-qdistance/view-qdistance.component';

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
    },
    {
      path: 'master-data/view-product-type',
      component: ViewProductTypeComponent,
      data: {
        title: 'Master Product Type',
      }
    },
    {
      path: 'master-data/view-bdistance',
      component: ViewBDistanceComponent,
      data: {
        title: 'Master Building Distance'
      }
    },
    {
      path: 'master-data/view-qdistance',
      component: ViewQDistanceComponent,
      data: {
        title: 'Master Quadrant Distance'
      }
    },
    {
      path: 'master-data/view-size',
      component: ViewSizeComponent,
      data: {
        title: 'Master View'
      }
    },
    {
      path: 'master-data/view-building',
      component: ViewBuildingComponent,
      data: {
        title: 'Master Building'
      }
    }
  ]

}]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterDataRoutingModule { }
