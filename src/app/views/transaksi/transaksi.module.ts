import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgSelect2Module } from 'ng-select2';
import { JwPaginationModule } from 'jw-angular-pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ToastrModule } from 'ngx-toastr';
import { TransaksiRoutingModule } from './transaksi-routing.module';
import { ViewMoPpcComponent } from './marketing-order/ppc/view-mo-ppc/view-mo-ppc.component';
import { AddMoPpcComponent } from './marketing-order/ppc/add-mo-ppc/add-mo-ppc.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ViewMonthlyPlanningComponent } from './view-monthly-planning/view-monthly-planning.component';
import { AddMonthlyPlanningComponent } from './add-monthly-planning/add-monthly-planning.component';
import { ViewMoMarketingComponent } from './marketing-order/marketing/view-mo-marketing/view-mo-marketing.component';
import { AddMoMarketingComponent } from './marketing-order/marketing/add-mo-marketing/add-mo-marketing.component';
import { EditMoPpcComponent } from './marketing-order/ppc/edit-mo-ppc/edit-mo-ppc.component';
import { EditMoMarketingComponent } from './marketing-order/marketing/edit-mo-marketing/edit-mo-marketing.component';
import { ViewDetailRevisiPpcComponent } from './marketing-order/ppc/view-detail-revisi-ppc/view-detail-revisi-ppc.component';
import { ViewDetailRevisiMarketingComponent } from './marketing-order/marketing/view-detail-revisi-marketing/view-detail-revisi-marketing.component';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AddMoFrontRearComponent } from './add-mo-front-rear/add-mo-front-rear.component';
import { AddArDefactRejectComponent } from './add-ar-defact-reject/add-ar-defact-reject.component';
import { ViewDetailMonthlyPlanningComponent } from './view-detail-monthly-planning/view-detail-monthly-planning.component';

@NgModule({
  declarations: [ViewMoPpcComponent, AddMoPpcComponent, ViewMonthlyPlanningComponent, AddMonthlyPlanningComponent, ViewMoMarketingComponent, AddMoMarketingComponent, EditMoPpcComponent, EditMoMarketingComponent, ViewDetailRevisiPpcComponent, ViewDetailRevisiMarketingComponent, AddMoFrontRearComponent, AddArDefactRejectComponent, ViewDetailMonthlyPlanningComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxSpinnerModule, NgSelect2Module, JwPaginationModule, TransaksiRoutingModule, TabsModule, ModalModule.forRoot(), ToastrModule.forRoot(), MatSortModule, MatTableModule, MatPaginatorModule, MatTooltipModule],
})
export class TransaksiModule { }
