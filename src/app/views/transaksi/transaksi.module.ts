import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgSelect2Module } from 'ng-select2';
import { JwPaginationModule } from 'jw-angular-pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ToastrModule } from 'ngx-toastr';
import { TransaksiRoutingModule } from './transaksi-routing.module';
import { ViewMoPpcComponent } from './view-mo-ppc/view-mo-ppc.component';
import { AddMoPpcComponent } from './add-mo-ppc/add-mo-ppc.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ViewMonthlyPlanningComponent } from './view-monthly-planning/view-monthly-planning.component';
import { AddMonthlyPlanningComponent } from './add-monthly-planning/add-monthly-planning.component';
import { ViewMoMarketingComponent } from './view-mo-marketing/view-mo-marketing.component';
import { AddMoMarketingComponent } from './add-mo-marketing/add-mo-marketing.component';
import { EditMoPpcComponent } from './edit-mo-ppc/edit-mo-ppc.component';
import { DetailViewMoPpcComponent } from './detail-view-mo-ppc/detail-view-mo-ppc.component';



@NgModule({
  declarations: [
    ViewMoPpcComponent,
    AddMoPpcComponent,
    ViewMonthlyPlanningComponent,
    AddMonthlyPlanningComponent,
    ViewMoMarketingComponent,
    AddMoMarketingComponent,
    EditMoPpcComponent,
    DetailViewMoPpcComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    NgSelect2Module,
    JwPaginationModule,
    TransaksiRoutingModule,
    TabsModule,
    ModalModule.forRoot(),
    ToastrModule.forRoot()
  ]
})
export class TransaksiModule { }
