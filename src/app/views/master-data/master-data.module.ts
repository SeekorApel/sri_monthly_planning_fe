import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgSelect2Module } from 'ng-select2';
import { JwPaginationModule } from 'jw-angular-pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ToastrModule } from 'ngx-toastr';
import { MasterDataRoutingModule } from './master-data-routing.module';
import { ViewPlantComponent } from './view-plant/view-plant.component';
import { ViewProductComponent } from './view-product/view-product.component';
import { ViewPatternComponent } from './view-pattern/view-pattern.component';
import { ViewMachineTassComponent } from './view-tassmachine/view-tassmachine.component';
import { ViewSettingComponent } from './view-setting/view-setting.component';
import { ViewQuadrantComponent } from './view-quadrant/view-quadrant.component';
import { ViewProductTypeComponent } from './view-product-type/view-product-type.component';
import { ViewSizeComponent } from './view-size/view-size.component';
import { ViewBuildingComponent } from './view-building/view-building.component';
import { ViewBDistanceComponent } from './view-bdistance/view-bdistance.component';
import { ViewQDistanceComponent } from './view-qdistance/view-qdistance.component';
import { ViewRoutingMachineComponent } from './view-routing-machine/view-routing-machine.component';
import { ViewDeliveryScheduleComponent } from './view-delivery-schedule/view-delivery-schedule.component';
import { ViewMachineCuringTypeComponent } from './view-machine-curing-type/view-machine-curing-type.component';
import { ViewMachineTassTypeComponent } from './view-machine-tass-type/view-machine-tass-type.component';
import { ViewCuringMachineComponent } from './view-curing-machine/view-curing-machine.component';
import { ViewMaxCapacityComponent } from './view-max-capacity/view-max-capacity.component';
import { ViewTassSizeComponent } from './view-tass-size/view-tass-size.component';
import { ViewItemCuringComponent } from './view-item-curing/view-item-curing.component';
import { ViewCtCuringComponent } from './view-ct-curing/view-ct-curing.component';
import { ViewCtKapaComponent } from './view-ct-kapa/view-ct-kapa.component';
import { ViewMachineExtrudingComponent } from './view-machine-extruding/view-machine-extruding.component';
import { ViewDDeliveryScheduleComponent } from './view-d-deliveryschedule/view-d-deliveryschedule.component';
import { ViewMachineAllowanceComponent } from './view-machine-allowance/view-machine-allowance.component';
import { ViewItemAssyComponent } from './view-item-assy/view-item-assy.component';


@NgModule({
  declarations: [
    ViewPlantComponent,
    ViewProductComponent,
    ViewPatternComponent,
    ViewMachineTassComponent,
    ViewSettingComponent,
    ViewQuadrantComponent,
    ViewProductTypeComponent,
    ViewSizeComponent,
    ViewBuildingComponent,
    ViewBDistanceComponent,
    ViewQDistanceComponent,
    ViewRoutingMachineComponent,
    ViewDeliveryScheduleComponent,
    ViewMachineCuringTypeComponent,
    ViewMachineTassTypeComponent,
    ViewCuringMachineComponent,
    ViewMaxCapacityComponent,
    ViewTassSizeComponent,
    ViewItemCuringComponent,
    ViewCtCuringComponent,
    ViewCtKapaComponent,
    ViewMachineExtrudingComponent,
    ViewDDeliveryScheduleComponent,
    ViewMachineAllowanceComponent,
    ViewItemAssyComponent
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
    ToastrModule.forRoot(),
  ],
})
export class MasterDataModule {}
