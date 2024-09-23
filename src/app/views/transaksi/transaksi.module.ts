import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgSelect2Module } from 'ng-select2';
import { JwPaginationModule } from 'jw-angular-pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ToastrModule } from 'ngx-toastr';
import { TransaksiRoutingModule } from './transaksi-routing.module';
import { ViewHeaderMoComponent } from './view-header-mo/view-header-mo.component';
import { AddHeaderMoComponent } from './add-header-mo/add-header-mo.component'



@NgModule({
  declarations: [
    ViewHeaderMoComponent,
    AddHeaderMoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    NgSelect2Module,
    JwPaginationModule,
    TransaksiRoutingModule,
    ModalModule.forRoot(),
    ToastrModule.forRoot()
  ]
})
export class TransaksiModule { }
