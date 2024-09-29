import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgSelect2Module } from 'ng-select2';
import { JwPaginationModule } from 'jw-angular-pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ToastrModule } from 'ngx-toastr';
import { TransaksiRoutingModule } from './transaksi-routing.module';
import { ViewMarketingOrderComponent } from './view-marketing-order/view-marketing-order.component';
import { AddMarketingOrderComponent } from './add-marketing-order/add-marketing-order.component';
import { TabsModule } from 'ngx-bootstrap/tabs';



@NgModule({
  declarations: [
    ViewMarketingOrderComponent,
    AddMarketingOrderComponent
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
