import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-view-plant',
  templateUrl: './view-plant.component.html',
  styleUrls: ['./view-plant.component.scss']
})
export class ViewPlantComponent implements OnInit {
  @ViewChild('addModal') public addModal: ModalDirective;
  @ViewChild('updateModal') public updateModal: ModalDirective;

  constructor() { }

  ngOnInit(): void {
  }

}
