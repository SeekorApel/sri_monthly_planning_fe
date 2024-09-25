import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgSelect2Module } from 'ng-select2';
import { JwPaginationModule } from 'jw-angular-pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ToastrModule } from 'ngx-toastr';
import { MasterDataRoutingModule } from './master-data-routing.module'
import { ViewPlantComponent } from './view-plant/view-plant.component';
import { ViewProductComponent } from './view-product/view-product.component';
import { ViewPatternComponent } from './view-pattern/view-pattern.component';
import { ViewTassMachine } from './view-tassmachine/view-tassmachine.component';
import { ViewSettingComponent } from './view-setting/view-setting.component';
import { ViewQuadrantComponent } from './view-quadrant/view-quadrant.component';
import { ViewProductTypeComponent } from './view-product-type/view-product-type.component';
import { ViewSizeComponent } from './view-size/view-size.component';
import { ViewBuildingComponent } from './view-building/view-building.component';
import { ViewBDistanceComponent } from './view-bdistance/view-bdistance.component';
import { ViewQDistanceComponent } from './view-qdistance/view-qdistance.component';
import { ViewRoutingMachineComponent } from './view-routing-machine/view-routing-machine.component';
import { ViewDeliveryScheduleComponent } from './view-delivery-schedule/view-delivery-schedule.component';



@NgModule({
  declarations: [
    ViewPlantComponent,
    ViewProductComponent,
    ViewPatternComponent,
    ViewTassMachine,
    ViewSettingComponent,
    ViewQuadrantComponent,
    ViewProductTypeComponent,
    ViewSizeComponent,
    ViewBuildingComponent,
    ViewBDistanceComponent,
    ViewQDistanceComponent,
    ViewRoutingMachineComponent,
    ViewDeliveryScheduleComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    NgSelect2Module,
    JwPaginationModule,
    MasterDataRoutingModule,
    ModalModule.forRoot(),
    ToastrModule.forRoot()
  ]
})
export class MasterDataModule { }
