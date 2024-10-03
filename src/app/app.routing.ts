import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import { DefaultLayoutComponent } from './containers';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';
import { AuthGuard } from './services/auth.guard';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { ViewPlantComponent } from './views/master-data/view-plant/view-plant.component';
import { ViewMarketingOrderComponent } from './views/transaksi/view-marketing-order/view-marketing-order.component';
import { AddMarketingOrderComponent } from './views/transaksi/add-marketing-order/add-marketing-order.component';
import { ViewSettingComponent } from './views/master-data/view-setting/view-setting.component';
import { ViewQuadrantComponent } from './views/master-data/view-quadrant/view-quadrant.component';
import { ViewProductTypeComponent } from './views/master-data/view-product-type/view-product-type.component';
import { ViewSizeComponent } from './views/master-data/view-size/view-size.component';
import { ViewBuildingComponent } from './views/master-data/view-building/view-building.component';
import { ViewBDistanceComponent } from './views/master-data/view-bdistance/view-bdistance.component';
import { ViewQDistanceComponent } from './views/master-data/view-qdistance/view-qdistance.component';
import { ViewPatternComponent } from './views/master-data/view-pattern/view-pattern.component';
import { ViewProductComponent } from './views/master-data/view-product/view-product.component';
import { ViewMachineTassComponent } from './views/master-data/view-tassmachine/view-tassmachine.component';
import { ViewRoutingMachineComponent } from './views/master-data/view-routing-machine/view-routing-machine.component';
import { ViewDeliveryScheduleComponent } from './views/master-data/view-delivery-schedule/view-delivery-schedule.component';
import { ViewMachineCuringTypeComponent } from './views/master-data/view-machine-curing-type/view-machine-curing-type.component';
import { ViewMachineCuringTypeCavityComponent } from './views/master-data/view-machine-curing-type-cavity/view-machine-curing-type-cavity.component';
import { ViewMachineTassTypeComponent } from './views/master-data/view-machine-tass-type/view-machine-tass-type.component';
import { ViewMaxCapacityComponent } from './views/master-data/view-max-capacity/view-max-capacity.component';
import { ViewCuringMachineComponent } from './views/master-data/view-curing-machine/view-curing-machine.component';
import { ViewItemCuringComponent } from './views/master-data/view-item-curing/view-item-curing.component';
import { ViewTassSizeComponent } from './views/master-data/view-tass-size/view-tass-size.component';
import { ViewMonthlyPlanningComponent } from './views/transaksi/view-monthly-planning/view-monthly-planning.component';
import { AddMonthlyPlanningComponent } from './views/transaksi/add-monthly-planning/add-monthly-planning.component';
import { ViewCtKapaComponent } from './views/master-data/view-ct-kapa/view-ct-kapa.component';
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
    data: {
      title: 'Dashboard',
    },
  },
  {
    path: '404',
    component: P404Component,
    data: {
      title: 'Page 404',
    },
  },
  {
    path: '500',
    component: P500Component,
    data: {
      title: 'Page 500',
    },
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page',
    },
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: {
      title: 'Register Page',
    },
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    canActivate: [],
    data: {
      title: 'Home',
    },
    children: [
      {
        path: 'master-data/view-plant',
        component: ViewPlantComponent,
        data: {
          title: 'Master Data / View Plant',
        },
      },
      {
        path: 'master-data/view-plant',
        component: ViewPlantComponent,
        data: {
          title: 'Master Data / View Plant',
        },
      },
      {
        path: 'master-data/view-setting',
        component: ViewSettingComponent,
        data: {
          title: 'Master Data / View Setting',
        },
      },
      {
        path: 'master-data/view-quadrant',
        component: ViewQuadrantComponent,
        data: {
          title: 'Master Data / View Quadrant',
        },
      },
      {
        path: 'master-data/view-product-type',
        component: ViewProductTypeComponent,
        data: {
          title: 'Master Data / View Product Type',
        },
      },
      {
        path: 'master-data/view-size',
        component: ViewSizeComponent,
        data: {
          title: 'Master Data / View Size',
        },
      },
      {
        path: 'master-data/view-bdistance',
        component: ViewBDistanceComponent,
        data: {
          title: 'Master Data / View Building Distance',
        },
      },
      {
        path: 'master-data/view-qdistance',
        component: ViewQDistanceComponent,
        data: {
          title: 'Master Data / View Quadrant Distance',
        },
      },
      {
        path: 'master-data/view-building',
        component: ViewBuildingComponent,
        data: {
          title: 'Master Data / View Building',
        },
      },
      {
        path: 'master-data/view-pattern',
        component: ViewPatternComponent,
        data: {
          title: 'Master Data / View Pattern',
        },
      },
      {
        path: 'master-data/view-product',
        component: ViewProductComponent,
        data: {
          title: 'Master Data / View Product',
        },
      },
      {
        path: 'master-data/view-ct-kapa',
        component: ViewCtKapaComponent,
        data: {
          title: 'Master Data / View CT Kapa',
        },
      },
      {
        path: 'master-data/view-machine-curing-type',
        component: ViewMachineCuringTypeComponent,
        data: {
          title: 'Master Data / View Machine Curing Type',
        },
      },
      {
        path: 'master-data/view-machine-tass-type',
        component: ViewMachineTassTypeComponent,
        data: {
          title: 'Master Data / View Machine Tass Type',
        },
      },
      {
        path: 'master-data/view-machine-curing-type-cavity',
        component: ViewMachineCuringTypeCavityComponent,
        data: {
          title: 'Master Data / View Machine Curing Type Cavity',
        },
      },
      {
        path: 'master-data/view-tassMachine',
        component: ViewMachineTassComponent,
        data: {
          title: 'Master Data / View Machine',
        },
      },
      {
        path: 'master-data/view-curing-machine',
        component: ViewCuringMachineComponent,
        data: {
          title: 'Master Data / View Curing Machine',
        },
      },
      {
        path: 'master-data/view-max-capacity',
        component: ViewMaxCapacityComponent,
        data: {
          title: 'Master Data / View Max Capacity',
        },
      },
      {
        path: 'master-data/view-item-curing',
        component: ViewItemCuringComponent,
        data: {
          title: 'Master Data / View Item Curing',
        },
      },
      {
        path: 'master-data/view-tass-size',
        component: ViewTassSizeComponent,
        data: {
          title: 'Master Data / View Tass Size',
        },
      },
      {
        path: 'transaksi/view-header-mo',
        component: ViewMarketingOrderComponent,
        data: {
          title: 'Transaksi / View Marketing Order',
        },
      },
      {
        path: 'transaksi/add-header-mo',
        component: AddMarketingOrderComponent,
        data: {
          title: 'Transaksi / Add Marketing Order',
        },
      },
      {
        path: 'transaksi/view-marketing-order',
        component: ViewMarketingOrderComponent,
        data: {
          title: 'Transaksi / View Marketing Order',
        },
      },
      {
        path: 'transaksi/add-marketing-order',
        component: AddMarketingOrderComponent,
        data: {
          title: 'Transaksi / Add Marketing Order',
        },
      },
      {
        path: 'master-data/view-routing-machine',
        component: ViewRoutingMachineComponent,
        data: {
          title: 'Master Data / View Routing Machine',
        },
      },
      {
        path: 'master-data/view-delivery-schedule',
        component: ViewDeliveryScheduleComponent,
        data: {
          title: 'Master Data / View Delivery Schedule',
        },
      },
      {
        path: 'transaksi/view-monthly-planning',
        component: ViewMonthlyPlanningComponent,
        data: {
          title: 'Transaksi / View Monthly Planning',
        },
      },
      {
        path: 'transaksi/add-monthly-planning',
        component: AddMonthlyPlanningComponent,
        data: {
          title: 'Transaksi / Add Monthly Planning',
        },
      },
      {
        path: 'base',
        loadChildren: () =>
          import('./views/base/base.module').then((m) => m.BaseModule),
      },
      {
        path: 'buttons',
        loadChildren: () =>
          import('./views/buttons/buttons.module').then((m) => m.ButtonsModule),
      },
      {
        path: 'charts',
        loadChildren: () =>
          import('./views/chartjs/chartjs.module').then((m) => m.ChartJSModule),
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./views/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
      },
      {
        path: 'icons',
        loadChildren: () =>
          import('./views/icons/icons.module').then((m) => m.IconsModule),
      },
      {
        path: 'notifications',
        loadChildren: () =>
          import('./views/notifications/notifications.module').then(
            (m) => m.NotificationsModule
          ),
      },
      {
        path: 'theme',
        loadChildren: () =>
          import('./views/theme/theme.module').then((m) => m.ThemeModule),
      },
      {
        path: 'widgets',
        loadChildren: () =>
          import('./views/widgets/widgets.module').then((m) => m.WidgetsModule),
      },
      {
        path: 'master-data',
        loadChildren: () =>
          import('./views/master-data/master-data.module').then(
            (m) => m.MasterDataModule
          ),
      },
      {
        path: 'transaksi',
        loadChildren: () =>
          import('./views/transaksi/transaksi.module').then(
            (m) => m.TransaksiModule
          ),
      },
    ],
  },
  { path: '**', component: P404Component },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
