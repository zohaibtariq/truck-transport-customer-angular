import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {shareReplay} from "rxjs";
import {first} from "rxjs/operators";
import {CSVRecord} from "./CSVModel";
import {UserManagementService} from "../user-management.service";
import { Router } from '@angular/router';
// import * as moment from 'moment';

@Component({
  selector: 'app-user-import',
  templateUrl: './user-import.component.html',
  styleUrls: ['./user-import.component.scss']
})
export class UserImportComponent implements OnInit {

  constructor(
    private userManagementService: UserManagementService,
    private ref: ChangeDetectorRef,
    private router: Router
  ){ }

  ngOnInit(): void {
  }

  public importUserError: string;
  public importUserSuccess: string;
  public uniqueUsersCount: number;
  public records: any[] = [];
  public importUserEmails: any[] = [];
  public emailsNotUnique: any[] = [];
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
        let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);
        // console.log('CSV all data')
        // console.log(csvRecordsArray)
        let headersRow = this.getHeaderArray(csvRecordsArray);
        // console.log('CSV Header Row')
        // console.log(headersRow)
        this.records = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);
        // console.log('CSV all records')
        // console.log(this.records)
        this.userManagementService.uniqueUsers(this.importUserEmails)
          .pipe(shareReplay(), first())
          .subscribe((response:any) => {
            this.uniqueUsersCount = response.count;
            // console.log('Unique RESPONSE');
            // console.log(response);
            if(response.count === 0){
              this.importUserSuccess = 'All data is ok please proceed with import.';
              // this.userManagementService.importUsers(this.records)
            }
            else{
              // console.log('No IMPORT due to incorrect data');
              const  emailsNotUnique = response.results.map(function(user: any){
                return user.email;
              })
              // console.log(emailsNotUnique)
              this.importUserError = 'Highlighted emails are already exists.';
              this.emailsNotUnique = emailsNotUnique;
            }
            // console.log('detectChanges');
            this.ref.detectChanges();
          });
      };
      reader.onerror = function (){
        // console.log('error is occured while reading file!');
      };
    } else {
      alert("Please import valid user .csv file.");
      this.fileReset();
    }
  }

  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any){
    let csvArr = [];
    let userEmails = [];
    for (let i = 1; i < csvRecordsArray.length; i++){
      let currentRecord = (<string>csvRecordsArray[i]).split(',');
      if (currentRecord.length == headerLength){
        let csvRecord: CSVRecord = new CSVRecord();
        csvRecord.role = currentRecord[0].trim().replace(/["']/g, "");
        csvRecord.active = (currentRecord[1].trim().replace(/["']/g, "") === 'true' ? true : false);
        // csvRecord.gender = currentRecord[2].trim().replace(/["']/g, "");
        csvRecord.name = currentRecord[2].trim().replace(/["']/g, "");
        csvRecord.email = currentRecord[3].trim().replace(/["']/g, "");
        // csvRecord.password = currentRecord[4].trim().replace(/["']/g, "");
        csvRecord.isEmailVerified = false;
        // csvRecord.createdAt = moment().format();
        // csvRecord.updatedAt = moment().format();
        // console.log('EACH EMAIL');
        // console.log(csvRecord.email);
        csvArr.push(csvRecord);
        userEmails.push(csvRecord.email.trim());
      }
    }
    this.importUserEmails = userEmails;
    // console.log('ALL UNIQUE EMAIL');
    // console.log(this.importUserEmails);
    return csvArr;
  }

  isValidCSVFile(file: any){
    return file.name.endsWith(".csv");
  }

  getHeaderArray(csvRecordsArr: any){
    let headers = (<string>csvRecordsArr[0]).split(',');
    let headerArray = [];
    for (let j = 0; j < headers.length; j++){
      headerArray.push(headers[j]);
    }
    return headerArray;
  }

  fileReset(){
    this.csvReader.nativeElement.value = "";
    this.records = [];
    this.importUserEmails = [];
    this.emailsNotUnique = [];
    this.uniqueUsersCount = 0;
    this.importUserError = '';
    this.importUserSuccess = '';
  }

  import(){
    this.userManagementService.importUsers(this.records)
      .pipe(shareReplay(), first())
      .subscribe((response:any) => {
        // console.log('IMPORT RESPONSE');
        // console.log(response);
        this.importUserSuccess = response.count + ' User' + ((response.count > 1) ? 's' : '') + ' imported successfully.';
        this.ref.detectChanges();
        setTimeout(() => {
          const routeToPath = '/users/listing';
          this.router.navigate([routeToPath]);
          // this.router.navigateByUrl([routeToPath]);
          // this.router.navigateByUrl(['/team/113/user/ganesh']);
        }, 2000)
      })
  }

}
