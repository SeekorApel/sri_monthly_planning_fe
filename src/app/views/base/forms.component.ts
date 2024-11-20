import { Component } from '@angular/core';
import { Select2OptionData } from 'ng-select2';
import { Options } from 'select2';
import { PlantService } from 'src/app/services/master-data/plant/plant.service';
import { ApiResponse } from 'src/app/response/Response';
import { Plant } from 'src/app/models/Plant';
@Component({
  templateUrl: 'forms.component.html'
})
export class FormsComponent {
  public uomOptions: Array<Select2OptionData>;
  public options: Options = { width: '100%'};
  uom: any;
  plant:Plant[];
  errorMessage: string;
  
  constructor(private plantService: PlantService) { 
    plantService.getAllPlant().subscribe(
      (response: ApiResponse<Plant[]>) => {
        this.plant = response.data;
        this.uomOptions = this.plant.map((element) => ({
          id: element.plant_ID.toString(), // Ensure the ID is a string
          text: element.plant_NAME // Set the text to the plant name
        }));
      },
      (error) => {
        this.errorMessage = 'Failed to load plants: ' + error.message;
      }
    );
    
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
