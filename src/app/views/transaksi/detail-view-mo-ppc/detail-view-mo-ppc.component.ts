import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DetailMarketingOrder } from 'src/app/models/DetailMarketingOrder';

@Component({
  selector: 'app-detail-view-mo-ppc',
  templateUrl: './detail-view-mo-ppc.component.html',
  styleUrls: ['./detail-view-mo-ppc.component.scss']
})
export class DetailViewMoPpcComponent implements OnInit {

  //Variable Declaration
  idMo: String;
  formHeaderMo: FormGroup;
  isReadOnly: boolean = true;
  isDisabled: boolean = true;
  marketingOrderTable: DetailMarketingOrder[];
  monthNames: string[] = ['', '', ''];

  constructor(private router: Router, private activeRoute: ActivatedRoute, private fb: FormBuilder) {
    this.formHeaderMo = this.fb.group({
      date: [null, []],
      type: [null, []],
      revision: [null, []],
      month_0: [null, []],
      month_1: [null, []],
      month_2: [null, []],
      nwd_0: [null, []],
      nwd_1: [null, []],
      nwd_2: [null, []],
      tl_ot_wd_0: [null, []],
      tt_ot_wd_0: [null, []],
      tl_ot_wd_1: [null, []],
      tt_ot_wd_1: [null, []],
      tl_ot_wd_2: [null, []],
      tt_ot_wd_2: [null, []],
      total_tlwd_0: [null, []],
      total_ttwd_0: [null, []],
      total_tlwd_1: [null, []],
      total_ttwd_1: [null, []],
      total_tlwd_2: [null, []],
      total_ttwd_2: [null, []],
      max_tube_capa_0: [null, []],
      max_tube_capa_1: [null, []],
      max_tube_capa_2: [null, []],
      max_capa_tl_0: [null, []],
      max_capa_tt_0: [null, []],
      max_capa_tl_1: [null, []],
      max_capa_tt_1: [null, []],
      max_capa_tl_2: [null, []],
      max_capa_tt_2: [null, []],
      looping_m0: ['', []],
      machine_airbag_m0: ['', []],
      fed_tl_m0: ['', []],
      fed_tt_m0: ['', []],
      total_mo_m0: ['', []],
      note_tl_m0: ['', []],
      looping_m1: ['', []],
      machine_airbag_m1: ['', []],
      fed_tl_m1: ['', []],
      fed_tt_m1: ['', []],
      total_mo_m1: ['', []],
      note_tl_m1: ['', []],
      looping_m2: ['', []],
      machine_airbag_m2: ['', []],
      fed_tl_m2: ['', []],
      fed_tt_m2: ['', []],
      total_mo_m2: ['', []],
      note_tl_m2: ['', []],
      upload_file_m0: [null, []],
      upload_file_m1: [null, []],
      upload_file_m2: [null, []],
    });
  }

  ngOnInit(): void {
    this.idMo = this.activeRoute.snapshot.paramMap.get('idMo');
    console.log("Ini id mo", this.idMo);
  }

  navigateToViewMo() {
    this.router.navigate(['/transaksi/view-mo-ppc']);
  }

  navigateToEdit() {
    this.router.navigate(['/transaksi/edit-mo-ppc', this.idMo]);
  }

}
