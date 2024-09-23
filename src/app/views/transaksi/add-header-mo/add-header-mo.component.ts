import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-header-mo',
  templateUrl: './add-header-mo.component.html',
  styleUrls: ['./add-header-mo.component.scss']
})
export class AddHeaderMoComponent implements OnInit {

  public isDisable: boolean;

  constructor() { 
    this.isDisable = true;
  }

  ngOnInit(): void {
  }

}
