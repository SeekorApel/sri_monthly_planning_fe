import { Component } from '@angular/core';
import { Select2OptionData } from 'ng-select2';
import { Options } from 'select2';

@Component({
  templateUrl: 'forms.component.html'
})
export class FormsComponent {
  public uomOptions: Array<Select2OptionData>;
  public options: Options = { width: '100%'};
  uom: any;
  
  constructor() { 
    this.uomOptions = [
      {
        id : 'KG',
        text : 'KG',
      },
      {
        id : 'L',
        text : 'L',
      },
      {
        id : 'M',
        text : 'M',
      },
      {
        id : 'UN',
        text : 'UN',
      },
      {
        id : 'PC',
        text : 'PC',
      }
    ]
  }

  isCollapsed: boolean = false;
  iconCollapse: string = 'icon-arrow-up';

  collapsed(event: any): void {
    // console.log(event);
  }

  expanded(event: any): void {
    // console.log(event);
  }

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
    this.iconCollapse = this.isCollapsed ? 'icon-arrow-down' : 'icon-arrow-up';
  }

}
