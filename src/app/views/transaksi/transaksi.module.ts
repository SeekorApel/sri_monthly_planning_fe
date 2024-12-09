import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgSelect2Module } from 'ng-select2';
import { JwPaginationModule } from 'jw-angular-pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ToastrModule } from 'ngx-toastr';
import { TransaksiRoutingModule } from './transaksi-routing.module';
import { ViewMoPpcComponent } from './view/view-mo-ppc/view-mo-ppc.component';
import { AddMoPpcComponent } from './add/add-mo-ppc/add-mo-ppc.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ViewMonthlyPlanningComponent } from './view-monthly-planning/view-monthly-planning.component';
import { AddMonthlyPlanningComponent } from './add-monthly-planning/add-monthly-planning.component';
import { ViewMoMarketingComponent } from './view/view-mo-marketing/view-mo-marketing.component';
import { AddMoMarketingComponent } from './add/add-mo-marketing/add-mo-marketing.component';
import { EditMoPpcComponent } from './edit/edit-mo-ppc/edit-mo-ppc.component';
import { EditMoMarketingComponent } from './edit/edit-mo-marketing/edit-mo-marketing.component';
import { ViewDetailRevisiPpcComponent } from './detail-view-revisi/view-detail-revisi-ppc/view-detail-revisi-ppc.component';
import { ViewDetailRevisiMarketingComponent } from './detail-view-revisi/view-detail-revisi-marketing/view-detail-revisi-marketing.component';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AddMoFrontRearComponent } from './add-mo-front-rear/add-mo-front-rear.component';
import { AddArDefactRejectComponent } from './add-ar-defact-reject/add-ar-defact-reject.component';

@NgModule({
  declarations: [ViewMoPpcComponent, AddMoPpcComponent, ViewMonthlyPlanningComponent, AddMonthlyPlanningComponent, ViewMoMarketingComponent, AddMoMarketingComponent, EditMoPpcComponent, EditMoMarketingComponent, ViewDetailRevisiPpcComponent, ViewDetailRevisiMarketingComponent, AddMoFrontRearComponent, AddArDefactRejectComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxSpinnerModule, NgSelect2Module, JwPaginationModule, TransaksiRoutingModule, TabsModule, ModalModule.forRoot(), ToastrModule.forRoot(), MatSortModule, MatTableModule, MatPaginatorModule, MatTooltipModule],
})
export class TransaksiModule { }
