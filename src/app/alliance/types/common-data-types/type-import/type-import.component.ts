import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";
import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {shareReplay} from "rxjs";
import {first} from "rxjs/operators";
import {TypeCSVRecord} from "./TypeCSVModel";
import { Router } from '@angular/router';
import {TypesService} from "../../services/types.service";

@Component({
  selector: 'app-type-import',
  templateUrl: './type-import.component.html',
  styleUrls: ['./type-import.component.scss']
})
export class TypeImportComponent implements OnInit {

  constructor(
    private typesService: TypesService,
    private ref: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
  ){ }

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      this.type = params['type'];
    });
  }

  private routeSub: Subscription;
  public type: string;
  public importUserError: string;
  public importUserSuccess: string;
  public uniqueUsersCount: number;
  public records: any[] = [];
  @ViewChild('csvReader') csvReader: any;

  uploadListener($event: any): void {
    let text = [];
    let files = $event.srcElement.files;
    if (this.isValidCSVFile(files[0])){
      let input = $event.target;
      let reader = new FileReader();
      reader.readAsText(input.files[0]);
      reader.onload = () => {
        let csvData = reader.result;
        let TypeCSVModelsArray = (<string>csvData).split(/\r\n|\n/);
        let headersRow = this.getHeaderArray(TypeCSVModelsArray);
        this.records = this.getDataRecordsArrayFromCSVFile(TypeCSVModelsArray, headersRow.length);
        this.ref.detectChanges();
      };
      reader.onerror = function (){
      };
    } else {
      alert("Please import valid profile .csv file.");
      this.fileReset();
    }
  }

  getDataRecordsArrayFromCSVFile(TypeCSVModelsArray: any, headerLength: any){
    let csvArr = [];
    let userEmails = [];
    for (let i = 1; i < TypeCSVModelsArray.length; i++){
      let currentRecord = (<string>TypeCSVModelsArray[i]).split(',');
      if (currentRecord.length == headerLength){
        let typeCSVRecord: TypeCSVRecord = new TypeCSVRecord();
        typeCSVRecord.isCustomer = currentRecord[0].trim().replace(/["']/g, "") === 'true' ? true : false;
        typeCSVRecord.isBillTo = currentRecord[1].trim().replace(/["']/g, "") === 'true' ? true : false;
        typeCSVRecord.isConsignee  = currentRecord[2].trim().replace(/["']/g, "") === 'true' ? true : false;
        typeCSVRecord.isShipper = currentRecord[3].trim().replace(/["']/g, "") === 'true' ? true : false;
        typeCSVRecord.isBroker = currentRecord[4].trim().replace(/["']/g, "") === 'true' ? true : false;
        typeCSVRecord.isForwarder = currentRecord[5].trim().replace(/["']/g, "") === 'true' ? true : false;
        typeCSVRecord.isTerminal = currentRecord[6].trim().replace(/["']/g, "") === 'true' ? true : false;
        typeCSVRecord.mcId = currentRecord[7].trim().replace(/["']/g, "");
        typeCSVRecord.ediId = currentRecord[8].trim().replace(/["']/g, "");
        typeCSVRecord.notes = currentRecord[9].trim().replace(/["']/g, "");
        typeCSVRecord.email = currentRecord[10].trim().replace(/["']/g, "");
        typeCSVRecord.officeHours = currentRecord[11].trim().replace(/["']/g, "");
        typeCSVRecord.active = currentRecord[12].trim().replace(/["']/g, "") === 'true' ? true : false;
        typeCSVRecord.location = {
          id: currentRecord[13].trim().replace(/["']/g, ""),
          extendedNotes: currentRecord[14].trim().replace(/["']/g, ""),
          address1: currentRecord[15].trim().replace(/["']/g, ""),
          zip: currentRecord[16].trim().replace(/["']/g, ""),
          state: currentRecord[17].trim().replace(/["']/g, ""),
          city: currentRecord[18].trim().replace(/["']/g, ""),
          country: currentRecord[19].trim().replace(/["']/g, ""),
          phone: currentRecord[20].trim().replace(/["']/g, ""),
          fax: currentRecord[21].trim().replace(/["']/g, ""),
          contact: currentRecord[22].trim().replace(/["']/g, ""),
          cell: currentRecord[23].trim().replace(/["']/g, ""),
          appt: currentRecord[24].trim().replace(/["']/g, ""),
          externalId: currentRecord[25].trim().replace(/["']/g, ""),
          name: currentRecord[26].trim().replace(/["']/g, ""),
        }
        csvArr.push(typeCSVRecord);
        userEmails.push(typeCSVRecord.email.trim());
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
    this.importUserSuccess = '';
  }

  import(){
    this.typesService.importProfiles(this.records)
      .pipe(shareReplay(), first())
      .subscribe((response:any) => {
        this.importUserSuccess = response.insertedCount+' '+ this.type.charAt(0).toUpperCase() + this.type.slice(1).replace('-', ' ') +' imported successfully.';
        this.ref.detectChanges();
        setTimeout(() => {
          const routeToPath = '/types/'+this.type;
          this.router.navigate([routeToPath]);
        }, 1500)
      })
  }
}

