import { Component } from '@angular/core';

@Component({
  templateUrl: 'tables.component.html'
})
export class TablesComponent {

  items = [];
  pageOfItems: Array<any>;
  dataSize: any;
  dataSizing: any;

  constructor() { 
    this.items = [
      {
        id: 1,
        name: "Row 1",
        descr: "Row Number 1"
      },
      {
        id: 2,
        name: "Row 2",
        descr: "Row Number 2"
      },
      {
        id: 3,
        name: "Row 3",
        descr: "Row Number 3"
      },
      {
        id: 4,
        name: "Row 4",
        descr: "Row Number 4"
      },
      {
        id: 1,
        name: "Row 1",
        descr: "Row Number 1"
      },
      {
        id: 2,
        name: "Row 2",
        descr: "Row Number 2"
      },
      {
        id: 3,
        name: "Row 3",
        descr: "Row Number 3"
      },
      {
        id: 4,
        name: "Row 4",
        descr: "Row Number 4"
      },
      {
        id: 1,
        name: "Row 1",
        descr: "Row Number 1"
      },
      {
        id: 2,
        name: "Row 2",
        descr: "Row Number 2"
      },
      {
        id: 3,
        name: "Row 3",
        descr: "Row Number 3"
      },
      {
        id: 4,
        name: "Row 4",
        descr: "Row Number 4"
      },
    ]
  }
  
  onChangePage(pageOfItems: Array<any>) {
    // update current page of items
    this.pageOfItems = pageOfItems;
    this.dataSizing = this.items.length;
  }

}
