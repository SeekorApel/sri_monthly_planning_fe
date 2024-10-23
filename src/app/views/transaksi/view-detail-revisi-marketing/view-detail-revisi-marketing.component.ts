import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DetailMarketingOrder } from 'src/app/models/DetailMarketingOrder';
import { MarketingOrder } from 'src/app/models/MarketingOrder';
import { MarketingOrderService } from 'src/app/services/transaksi/marketing order/marketing-order.service';

@Component({
  selector: 'app-view-detail-revisi-marketing',
  templateUrl: './view-detail-revisi-marketing.component.html',
  styleUrls: ['./view-detail-revisi-marketing.component.scss']
})
export class ViewDetailRevisiMarketingComponent implements OnInit {

  month0: any;
  month1: string;
  month2: string;
  type: string;
  formHeaderMo: FormGroup;
  isReadOnly: boolean = true;
  marketingOrder: MarketingOrder = new MarketingOrder();
  headerMarketingOrder: any[] = [];
  detailMarketingOrder: DetailMarketingOrder[];

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private fb: FormBuilder,
    private moService: MarketingOrderService) {

  }

  ngOnInit(): void { }

}
