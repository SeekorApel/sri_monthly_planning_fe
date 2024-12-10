import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewPlantComponent } from './view-plant/view-plant.component';
import { ViewProductComponent } from './view-product/view-product.component';
import { ViewPatternComponent } from './view-pattern/view-pattern.component';
import { ViewMachineTassComponent } from './view-machine-tass/view-machine-tass.component';
import { ViewSettingComponent } from './view-setting/view-setting.component';
import { ViewQuadrantComponent } from './view-quadrant/view-quadrant.component';
import { ViewProductTypeComponent } from './view-product-type/view-product-type.component';
import { ViewSizeComponent } from './view-size/view-size.component';
import { ViewBuildingComponent } from './view-building/view-building.component';
import { ViewBDistanceComponent } from './view-bdistance/view-bdistance.component';
import { ViewQDistanceComponent } from './view-qdistance/view-qdistance.component';
import { ViewMachineCuringTypeComponent } from './view-machine-curing-type/view-machine-curing-type.component';
import { ViewMachineTassTypeComponent } from './view-machine-tass-type/view-machine-tass-type.component';
import { ViewCuringMachineComponent } from './view-curing-machine/view-curing-machine.component';
import { ViewMaxCapacityComponent } from './view-max-capacity/view-max-capacity.component';
import { ViewItemCuringComponent } from './view-item-curing/view-item-curing.component';
import { ViewTassSizeComponent } from './view-tass-size/view-tass-size.component';
import { ViewCtCuringComponent } from './view-ct-curing/view-ct-curing.component';
import { ViewMachineAllowenceComponent } from './view-machine-allowence/view-machine-allowence.component';
import { ViewCuringSizeComponent } from './view-curing-size/view-curing-size.component';
import { ViewPmStopMachineComponent } from './view-pm-stop-machine/view-pm-stop-machine.component';
import { ViewWorkDayComponent } from './view-work-day/view-work-day.component';

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
        component: ViewMachineTassComponent,
        data: {
          title: 'Master Tass Machine',
        },
      },
      {
        path: 'master-data/view-machine-curing-type',
        component: ViewMachineCuringTypeComponent,
        data: {
          title: 'View Machine Curing Type',
        },
      },
      {
        path: 'master-data/view-machine-tass-type',
        component: ViewMachineTassTypeComponent,
        data: {
          title: 'View Machine Tass Type',
        },
      },
      {
        path: 'master-data/view-plant',
        component: ViewPlantComponent,
        data: {
          title: 'Master Plant',
        },
      },
      {
        path: 'master-data/view-setting',
        component: ViewSettingComponent,
        data: {
          title: 'Master Setting',
        },
      },
      {
        path: 'master-data/view-quadrant',
        component: ViewQuadrantComponent,
        data: {
          title: 'Master Quadrant',
        },
      },
      {
        path: 'master-data/view-product-type',
        component: ViewProductTypeComponent,
        data: {
          title: 'Master Product Type',
        },
      },
      {
        path: 'master-data/view-bdistance',
        component: ViewBDistanceComponent,
        data: {
          title: 'Master Building Distance',
        },
      },
      {
        path: 'master-data/view-qdistance',
        component: ViewQDistanceComponent,
        data: {
          title: 'Master Quadrant Distance',
        },
      },
      {
        path: 'master-data/view-size',
        component: ViewSizeComponent,
        data: {
          title: 'Master View',
        },
      },
      {
        path: 'master-data/view-building',
        component: ViewBuildingComponent,
        data: {
          title: 'Master Building',
        },
      },
      {
        path: 'master-data/view-tass-size',
        component: ViewTassSizeComponent,
        data: {
          title: 'Master Tass Size',
        },
      },
      {
        path: 'master-data/view-max-capacity',
        component: ViewMaxCapacityComponent,
        data: {
          title: 'Master View Max Capacity',
        },
      },
      {
        path: 'master-dataview-curing-machine',
        component: ViewCuringMachineComponent,
        data: {
          title: 'Master Curing Machine',
        },
      },
      {
        path: 'master-data/view-item-curing',
        component: ViewItemCuringComponent,
        data: {
          title: 'Master View Item Curing',
        },
      },
      {
        path: 'master-data/view-ct-curing',
        component: ViewCtCuringComponent,
        data: {
          title: 'Master View CT Curing',
        },
      },
      {
        path: 'master-data/view-machine-allowence',
        component: ViewMachineAllowenceComponent,
        data: {
          title: 'Master View Machine Allowance',
        },
      },
      {
        path: 'master-data/view-curing-size',
        component: ViewCuringSizeComponent,
        data: {
          title: 'Master View Curing Size'
        }
      },
      {
        path: 'master-data/view-pm-stop-machine',
        component: ViewPmStopMachineComponent,
        data: {
          title: 'Master View PM Stop Machine'
        }
      },   
      {
        path: 'master-data/view-work-day',
        component: ViewWorkDayComponent,
        data: {
          title: 'Master View Work Day'
        }
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MasterDataRoutingModule {}
