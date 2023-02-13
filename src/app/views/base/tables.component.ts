import { Component } from '@angular/core';

@Component({
  templateUrl: 'tables.component.html'
})
export class TablesComponent {

  items = [];
  data: any;
  pageOfItems: Array<any>;
  dataSize: any;
  dataSizing: any;
  filteredItems: any;

  constructor() { 
    this.items = [
      {
        id: "1",
        name: "Row 1",
        descr: "Row Number 1"
      },
      {
        id: "2",
        name: "Row 2",
        descr: "Row Number 2"
      },
      {
        id: "3",
        name: "Row 3",
        descr: "Row Number 3"
      },
      {
        id: "4",
        name: "Row 4",
        descr: "Row Number 4"
      },
      {
        id: "1",
        name: "Row 1",
        descr: "Row Number 1"
      },
      {
        id: "2",
        name: "Row 2",
        descr: "Row Number 2"
      },
      {
        id: "3",
        name: "Row 3",
        descr: "Row Number 3"
      },
      {
        id: "4",
        name: "Row 4",
        descr: "Row Number 4"
      },
      {
        id: "1",
        name: "Row 1",
        descr: "Row Number 1"
      },
      {
        id: "2",
        name: "Row 2",
        descr: "Row Number 2"
      },
      {
        id: "3",
        name: "Row 3",
        descr: "Row Number 3"
      },
      {
        id: "4",
        name: "Row 4",
        descr: "Row Number 4"
      },
    ]
    this.data = this.items;
  }
  
  onChangePage(pageOfItems: Array<any>) {
    // update current page of items
    this.pageOfItems = pageOfItems;
    this.dataSizing = this.items.length;
  }

  onSearchChange(searchValue) {
    var val = searchValue;
    this.filteredItems = this.data;
    var data = this.filteredItems.filter(function(list){
      return  list.name.toLowerCase().indexOf(val.toLowerCase()) > -1 || list.descr.toLowerCase().indexOf(val.toLowerCase()) > -1 
    });
    if(data.length > 0){
      this.items = Array(data.length).fill(0).map((x, i) => (
        { 
          idx: (i + 1),
          id: data[i].id,
          name : data[i].name,
          descr : data[i].descr
        }
      ));
    }
    else{
      this.items = Array(this.data.length).fill(0).map((x, i) => (
        { 
          idx: (i + 1),
          id: this.data[i].id,
          name : this.data[i].name,
          descr : this.data[i].descr
        }
      ));
    }
  }
}
