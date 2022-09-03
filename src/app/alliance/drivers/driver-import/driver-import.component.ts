import {ActivatedRoute} from "@angular/router";
import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {shareReplay} from "rxjs";
import {first} from "rxjs/operators";
import {DriverCSVRecord} from "./DriverCSVModel";
import { Router } from '@angular/router';
import {DriversService} from "../drivers.service";

@Component({
  selector: 'app-driver-import',
  templateUrl: './driver-import.component.html',
  styleUrls: ['./driver-import.component.scss']
})
export class DriverImportComponent implements OnInit {

  constructor(
    private driversService: DriversService,
    private ref: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
  ){ }

  ngOnInit(): void {
  }

  public importUserError: string;
  public importDriverSuccess: string;
  public uniqueUsersCount: number;
  public records: any[] = [];
  @ViewChild('csvReader') csvReader: any;

  uploadListener($event: any): void {
    // console.log('uploadListener EVENT')
    // console.log($event)
    let text = [];
    let files = $event.srcElement.files;
    if (this.isValidCSVFile(files[0])){
      let input = $event.target;
      let reader = new FileReader();
      reader.readAsText(input.files[0]);
      reader.onload = () => {
        let csvData = reader.result;
        let TypeCSVModelsArray = (<string>csvData).split(/\r\n|\n/);
        // console.log('CSV all data')
        // console.log(TypeCSVModelsArray)
        let headersRow = this.getHeaderArray(TypeCSVModelsArray);
        // console.log('CSV Header Row')
        // console.log(headersRow)
        this.records = this.getDataRecordsArrayFromCSVFile(TypeCSVModelsArray, headersRow.length);
        // console.log('CSV all records')
        // console.log(this.records)
        this.ref.detectChanges();
      };
      reader.onerror = function (){
        console.error('error is occurred while reading file!');
      };
    } else {
      alert("Please import valid driver .csv file.");
      this.fileReset();
    }
  }

  getDataRecordsArrayFromCSVFile(TypeCSVModelsArray: any, headerLength: any){
    let csvArr = [];
    let userEmails = [];
    for (let i = 1; i < TypeCSVModelsArray.length; i++){
      let currentRecord = (<string>TypeCSVModelsArray[i]).split(',');
      if (currentRecord.length == headerLength){
        let driverCSVRecord: DriverCSVRecord = new DriverCSVRecord();
        driverCSVRecord.email = currentRecord[0].trim().replace(/["']/g, "");
        driverCSVRecord.code = currentRecord[1].trim().replace(/["']/g, "");
        driverCSVRecord.active = currentRecord[2].trim().replace(/["']/g, "") === 'true' ? true : false;
        driverCSVRecord.first_name = currentRecord[3].trim().replace(/["']/g, "");
        driverCSVRecord.last_name = currentRecord[4].trim().replace(/["']/g, "");
        driverCSVRecord.gender = currentRecord[5].trim().replace(/["']/g, "");
        driverCSVRecord.address = currentRecord[6].trim().replace(/["']/g, "");
        driverCSVRecord.zip = currentRecord[7].trim().replace(/["']/g, "");
        driverCSVRecord.state = currentRecord[8].trim().replace(/["']/g, "");
        driverCSVRecord.city = currentRecord[9].trim().replace(/["']/g, "");
        driverCSVRecord.country = currentRecord[10].trim().replace(/["']/g, "");
        driverCSVRecord.phone = currentRecord[11].trim().replace(/["']/g, "");
        driverCSVRecord.mobile = currentRecord[12].trim().replace(/["']/g, "");
        driverCSVRecord.ssn = currentRecord[13].trim().replace(/["']/g, "");
        driverCSVRecord.tax_id = currentRecord[14].trim().replace(/["']/g, "");
        driverCSVRecord.external_id = currentRecord[15].trim().replace(/["']/g, "");
        // console.log('DRIVER CSV RECORDS');
        // console.log(driverCSVRecord);
        csvArr.push(driverCSVRecord);
      }
    }
    return csvArr;
  }

  isValidCSVFile(file: any){
    return file.name.endsWith(".csv");
  }

  getHeaderArray(TypeCSVModelsArr: any){
    let headers = (<string>TypeCSVModelsArr[0]).split(',');
    let headerArray = [];
    for (let j = 0; j < headers.length; j++){
      headerArray.push(headers[j]);
    }
    return headerArray;
  }

  fileReset(){
    this.csvReader.nativeElement.value = "";
    this.records = [];
    this.uniqueUsersCount = 0;
    this.importUserError = '';
    this.importDriverSuccess = '';
  }

  import(){
    this.driversService.importDrivers(this.records)
      .pipe(shareReplay(), first())
      .subscribe((response:any) => {
        // console.log('IMPORT RESPONSE');
        // console.log(response);
        this.importDriverSuccess = response.insertedCount+' drivers imported successfully.';
        this.ref.detectChanges();
        setTimeout(() => {
          const routeToPath = '/drivers/listing';
          this.router.navigate([routeToPath]);
        }, 1500)
      })
  }
}

