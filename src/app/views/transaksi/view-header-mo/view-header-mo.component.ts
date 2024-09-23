import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-header-mo',
  templateUrl: './view-header-mo.component.html',
  styleUrls: ['./view-header-mo.component.scss']
})
export class ViewHeaderMoComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  navigateToAdd() {
    this.router.navigate(['/transaksi/add-header-mo']);
  }

}
