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



@NgModule({
  declarations: [
    ViewPlantComponent
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