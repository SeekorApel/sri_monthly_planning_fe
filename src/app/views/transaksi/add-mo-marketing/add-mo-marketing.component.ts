import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { DetailMarketingOrder } from 'src/app/models/DetailMarketingOrder';

@Component({
  selector: 'app-add-mo-marketing',
  templateUrl: './add-mo-marketing.component.html',
  styleUrls: ['./add-mo-marketing.component.scss']
})
export class AddMoMarketingComponent implements OnInit {

  //Variable Declaration
  idMo: String;
  monthNames: string[] = ['', '', ''];
  marketingOrderTable: DetailMarketingOrder[];

  constructor(private router: Router, private activeRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.idMo = this.activeRoute.snapshot.paramMap.get('idMo');
    console.log("Ini id mo edit", this.idMo);
  }

  navigateToViewMo() {
    this.router.navigate(['/transaksi/view-mo-marketing']);
  }

}
