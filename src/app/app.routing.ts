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
import { ViewHeaderMoComponent } from './views/transaksi/view-header-mo/view-header-mo.component';
import { AddHeaderMoComponent } from './views/transaksi/add-header-mo/add-header-mo.component';
import { ViewSettingComponent } from './views/master-data/view-setting/view-setting.component';
import { ViewQuadrantComponent } from './views/master-data/view-quadrant/view-quadrant.component';
import { ViewProductTypeComponent } from './views/master-data/view-product-type/view-product-type.component';
import { ViewSizeComponent } from './views/master-data/view-size/view-size.component';
import { ViewBuildingComponent } from './views/master-data/view-building/view-building.component';
import { ViewBDistanceComponent } from './views/master-data/view-bdistance/view-bdistance.component';
import { ViewQDistanceComponent } from './views/master-data/view-qdistance/view-qdistance.component';
import { ViewPatternComponent } from './views/master-data/view-pattern/view-pattern.component';
import { ViewProductComponent } from './views/master-data/view-product/view-product.component';
import { ViewTassMachine } from './views/master-data/view-tassmachine/view-tassmachine.component';
import { ViewMachineCuringTypeComponent } from './views/master-data/view-machine-curing-type/view-machine-curing-type.component';
import { ViewMachineCuringTypeCavityComponent } from './views/master-data/view-machine-curing-type-cavity/view-machine-curing-type-cavity.component';
import { ViewMachineTassTypeComponent } from './views/master-data/view-machine-tass-type/view-machine-tass-type.component';
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
        component: ViewTassMachine,
        data: {
          title: 'Master Data / View Machine',
        },
      },
      {
        path: 'transaksi/view-header-mo',
        component: ViewHeaderMoComponent,
        data: {
          title: 'Transaksi / View Marketing Order',
        },
      },
      {
        path: 'transaksi/add-header-mo',
        component: AddHeaderMoComponent,
        data: {
          title: 'Transaksi / Add Marketing Order',
        },
      },
      {
        path: 'transaksi/view-header-mo',
        component: ViewHeaderMoComponent,
        data: {
          title: 'Transaksi / View Marketing Order',
        },
      },
      {
        path: 'transaksi/add-header-mo',
        component: AddHeaderMoComponent,
        data: {
          title: 'Transaksi / Add Marketing Order',
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
