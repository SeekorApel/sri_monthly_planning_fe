import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DeliveryScheduleService } from 'src/app/services/master-data/deliverySchedule/deliverySchedule.service';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-view-delivery-schedule',
  templateUrl: './view-delivery-schedule.component.html',
  styleUrls: ['./view-delivery-schedule.component.scss']
})
export class ViewDeliveryScheduleComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  deliveryScheduleList: any[] = [];
  file: File | null = null;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private deliveryScheduleService: DeliveryScheduleService // Inject PlantService
  ) { }
  ngOnInit(): void {
  }
  onDragOver(event: DragEvent) {
    event.preventDefault(); // Mencegah default behavior
}

onDrop(event: DragEvent) {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files.length > 0) {
        this.file = files[0];
        this.ReadExcel({ target: { files } }); // Panggil ReadExcel dengan file yang di-drop
    }
}

loadDeliverySchedule() {
this.deliveryScheduleService.getAllDeliverySchedule().subscribe(
  (response) => {
    this.deliveryScheduleList = response.data; // Simpan data plant ke dalam variabel
  },
  (error) => {
    console.error('Error fetching plants:', error); // Tangani error
  }
);
}


ReadExcel(event: any) {
this.file = event.target.files[0];
let fileReader = new FileReader();
fileReader.readAsBinaryString(this.file as File);
fileReader.onload = (e) => {
  var workbook = XLSX.read(fileReader.result, { type: 'binary' });
  var sheetName = workbook.SheetNames[0];
  var excelData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
  console.log(excelData); // Tampilkan data Excel yang terbaca di console
}
}


uploadExcelFile() {
if (this.file) {
  const formData = new FormData();
  formData.append('file', this.file);

  this.deliveryScheduleService.signIn('Aurel', 'polman').subscribe(
    (signinResponse) => {
        const token = signinResponse.data; 

      // Now upload the Excel file
      this.deliveryScheduleService.savePlantsExcelFile(formData).subscribe(
        (response) => {
          console.log('File uploaded successfully', response);
        },
        (error) => {
          console.error('Error uploading file', error);
        }
      );
    },
    (error) => {
      console.error('Error signing in', error);
    }
  );
} else {
  console.error('No file selected');
}
}


}
