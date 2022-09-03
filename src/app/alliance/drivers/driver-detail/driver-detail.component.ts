import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {shareReplay, Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {DriversService} from "../drivers.service";
import {NgbModal, NgbModalOptions, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {first} from "rxjs/operators";
import {FileUploader} from 'ng2-file-upload';
import {ToastrService} from 'ngx-toastr';
const URL = 'http://localhost:8080/api/upload';
import * as _ from 'underscore';
import {UserManagementService} from "../../user-management/user-management.service";
import Swal from "sweetalert2";
import {TitleCasePipe} from '@angular/common';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {environment} from 'src/environments/environment';
import {CountryService} from "../../../global/services/country.service";

@Component({
  selector: 'app-driver-detail',
  templateUrl: './driver-detail.component.html',
  styleUrls: ['./driver-detail.component.scss']
})
export class DriverDetailComponent implements OnInit {

  apiServerPath: String = environment.apiServerPath;
  editDriverFormGroup: FormGroup;
  private driverSubscription: Subscription;
  private routeSub: Subscription;
  pageSlug: any = 'Drivers';
  driverId: any;
  driver: any;
  title = 'ng-bootstrap-modal-demo';
  modalOptions:NgbModalOptions;
  ngbModalRef: NgbModalRef;
  user: any;
  users: any[];
  private usersSubscription: Subscription;
  createCertificationFormGroup: FormGroup;
  editCertificationFormGroup: FormGroup;
  equipmentExperienceEndorsementsFormGroup: FormGroup;
  expirationLogSettingsFormGroup: FormGroup;
  // currentDate: Date;
  currentDate: any;
  model: NgbDateStruct;
  selectedUser: any;
  countries: any[];
  countryIsoCode: any = '';
  states: any[];
  stateIsoCode: any = '';
  cities: any[];
  certCountries: any[];
  certCountryIsoCode: any = '';
  certStates: any[];
  certStateIsoCode: any = '';
  certCities: any[];

  public uploader: FileUploader = new FileUploader({
    url: URL,
    itemAlias: 'image',
  });

  constructor(
    private driversService: DriversService,
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private userManagementService: UserManagementService,
    private titleCasePipe: TitleCasePipe,
    private countryService: CountryService,
    // private date: NgbDateStruct
  ){
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    // this.currentDate = new Date(yyyy, mm, dd);
    this.currentDate = {
      day: dd,
      month: mm,
      year: yyyy,
    };
    this.modalOptions = {
      backdrop:'static',
      backdropClass:'customBackdrop',
      size:'xl'
    }
  }

  ngOnInit(): void {
    this.initForm();
    this.subscribers();
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };
    this.uploader.onCompleteItem = (item: any, status: any) => {
      this.toastr.success('File successfully uploaded!');
    };
  }

  subscribers(){
    this.countryService.countries$.subscribe((countries: any) => {
      // console.log('COUNTRIES POPULATED')
      this.countries = countries;
      this.certCountries = countries;
    })
    this.subscribeDriver()
    this.subscribeUsers()
  }

  subscribeDriver(){
    this.driverSubscription = this.driversService.driver$.subscribe((driver: any) => {
      // console.log('DRIVER');
      // console.log(driver);
      if(this.countries.length > 0 && driver?.country?._id !== undefined){
        if(driver?.state?._id !== undefined){
          this.onCountryChange({target:{value: driver?.country?._id}}, () => {
            this.editDriverFormGroup.patchValue({
              state: driver?.state?._id,
            });
            if(this.states.length > 0 && driver?.city?._id !== undefined){
              this.onStateChange({target:{value: driver?.state?._id}}, () => {
                this.editDriverFormGroup.patchValue({
                  city: driver?.city?._id,
                });
              })
            }
          })
        }
      }
      this.driver =  driver
      this.editDriverFormGroup.patchValue({
        ratePerMile: driver?.ratePerMile,
        code: driver?.code,
        image: driver?.image,
        active: driver?.active,
        first_name: driver?.first_name,
        last_name: driver?.last_name,
        gender: driver?.gender,
        address: driver?.address,
        zip: driver?.zip,
        country: driver?.country?._id,
        phone: driver?.phone,
        mobile: driver?.mobile,
        ssn: driver?.ssn,
        tax_id: driver?.tax_id,
        external_id: driver?.external_id,
        dispatcher: driver?.dispatcher,
        email: driver?.email,
      });
      this.equipmentExperienceEndorsementsFormGroup.patchValue({
        flatbed: driver?.equipmentExperienceEndorsements?.flatbed,
        van: driver?.equipmentExperienceEndorsements?.van,
        refrigerated: driver?.equipmentExperienceEndorsements?.refrigerated,
        dropDeck: driver?.equipmentExperienceEndorsements?.dropDeck,
        towawayVehicles: driver?.equipmentExperienceEndorsements?.towawayVehicles,
        passengerVehicles: driver?.equipmentExperienceEndorsements?.passengerVehicles,
        dblTriple: driver?.equipmentExperienceEndorsements?.dblTriple,
        tanker: driver?.equipmentExperienceEndorsements?.tanker,
        hazMat: driver?.equipmentExperienceEndorsements?.hazMat,
        hazMatTanker: driver?.equipmentExperienceEndorsements?.hazMatTanker,
        airBrake: driver?.equipmentExperienceEndorsements?.airBrake,
        endorsementsRadio: driver?.equipmentExperienceEndorsements?.endorsementsRadio,
      })
      this.expirationLogSettingsFormGroup.patchValue({
        lastDrugTest: driver?.expirationLogSettings?.lastDrugTest,
        nextDrugTest: driver?.expirationLogSettings?.nextDrugTest,
        lastAlcohalTest: driver?.expirationLogSettings?.lastAlcohalTest,
        nextAlcohalTest: driver?.expirationLogSettings?.nextAlcohalTest,
        physExamExp: driver?.expirationLogSettings?.physExamExp,
        oORegExp: driver?.expirationLogSettings?.oORegExp,
        oOTractorExp: driver?.expirationLogSettings?.oOTractorExp,
        oOTrailerExp: driver?.expirationLogSettings?.oOTrailerExp,
        oOInusrExp: driver?.expirationLogSettings?.oOInusrExp,
        otherInusrExp: driver?.expirationLogSettings?.otherInusrExp,
        mvaExp: driver?.expirationLogSettings?.mvaExp,
        arcPrcExp: driver?.expirationLogSettings?.arcPrcExp,
        hazMatTraining: driver?.expirationLogSettings?.hazMatTraining,
        annualReview: driver?.expirationLogSettings?.annualReview,
        milesDriven: driver?.expirationLogSettings?.milesDriven,
        yrsExp: driver?.expirationLogSettings?.yrsExp,
      })
      this.ref.detectChanges();
      this.modalService.dismissAll();
      this.getDispatcher();
    });
    this.routeSub = this.route.params.subscribe(params => {
      this.driverId = params['id'];
      this.driversService.getDriver(this.driverId);
    });
  }

  subscribeUsers(){
    this.usersSubscription = this.userManagementService.users$.subscribe((users: any) => {
      this.users =  users.results
      this.ref.detectChanges();
      this.getDispatcher();
    });
    this.userManagementService.getAllUsers(1, 'active=true');
  }

  getDispatcher(){
    if(this.users && this.users.length > 0 && this.driver){
      this.user = _.find(this.users, (user) => {
        return user.id === this.driver.dispatcher;
      })
      if(this.user !== undefined)
        this.ref.detectChanges();
    }
  }

  initForm(){
    this.editDriverFormGroup = this.fb.group(
      {
        file: [
          '',
          Validators.compose([]),
        ],
        fileSource: [
          '',
          Validators.compose([]),
        ],
        code: [
          '',
          Validators.compose([]),
        ],
        active: [false, Validators.compose([])],
        first_name: [
          '',
          Validators.compose([
            Validators.required
          ]),
        ],
        ratePerMile: [
          '',
          Validators.compose([
            Validators.required
          ]),
        ],
        last_name: [
          '',
          Validators.compose([
            Validators.required
          ]),
        ],
        gender: [
          '',
          Validators.compose([
            Validators.required
          ]),
        ],
        address: [
          '',
          Validators.compose([
            Validators.required
          ]),
        ],
        zip: [
          '',
          Validators.compose([
            Validators.required
          ]),
        ],
        state: [
          '',
          Validators.compose([
            Validators.required
          ]),
        ],
        city: [
          '',
          Validators.compose([
            Validators.required
          ]),
        ],
        country: [
          '',
          Validators.compose([Validators.required]),
        ],
        phone: [
          '',
          Validators.compose([
            Validators.required
          ]),
        ],
        mobile: [
          '',
          Validators.compose([
            Validators.required
          ]),
        ],
        ssn: [
          '',
          Validators.compose([]),
        ],
        tax_id: [
          '',
          Validators.compose([]),
        ],
        external_id: [
          '',
          Validators.compose([]),
        ],
        dispatcher: ['', Validators.compose([Validators.required])],
        email: ['', Validators.compose([])],
        password: ['', Validators.compose([])],
      }
    );
    this.createCertificationFormGroup = this.fb.group(
      {
        drivingSchool: ['', Validators.compose([Validators.required])],
        country: ['', Validators.compose([Validators.required])],
        state: ['', Validators.compose([Validators.required])],
        city: ['', Validators.compose([Validators.required])],
        contact: ['', Validators.compose([Validators.required])],
        phone: ['', Validators.compose([Validators.required])],
        startDate: ['', Validators.compose([Validators.required])],
        graduationDate: ['', Validators.compose([Validators.required])],
        rank: ['', Validators.compose([Validators.required])],
        recruiter: ['', Validators.compose([Validators.required])],
        referredBy: ['', Validators.compose([Validators.required])],
        comments: ['', Validators.compose([Validators.required])]
      }
    );
    this.editCertificationFormGroup = this.fb.group(
      {
        certificationId: ['', Validators.compose([Validators.required])],
        drivingSchool: ['', Validators.compose([Validators.required])],
        country: ['', Validators.compose([Validators.required])],
        state: ['', Validators.compose([Validators.required])],
        city: ['', Validators.compose([Validators.required])],
        contact: ['', Validators.compose([Validators.required])],
        phone: ['', Validators.compose([Validators.required])],
        startDate: [this.currentDate, Validators.compose([Validators.required])],
        graduationDate: [this.currentDate, Validators.compose([Validators.required])],
        rank: ['', Validators.compose([Validators.required])],
        recruiter: ['', Validators.compose([Validators.required])],
        referredBy: ['', Validators.compose([Validators.required])],
        comments: ['', Validators.compose([Validators.required])]
      }
    );
    this.equipmentExperienceEndorsementsFormGroup = this.fb.group(
      {
        flatbed: [false, Validators.compose([Validators.required])],
        van: [false, Validators.compose([Validators.required])],
        refrigerated: [false, Validators.compose([Validators.required])],
        dropDeck: [false, Validators.compose([Validators.required])],
        towawayVehicles: [false, Validators.compose([Validators.required])],
        passengerVehicles: [false, Validators.compose([Validators.required])],
        dblTriple: [false, Validators.compose([Validators.required])],
        tanker: [false, Validators.compose([Validators.required])],
        hazMat: [false, Validators.compose([Validators.required])],
        hazMatTanker: [false, Validators.compose([Validators.required])],
        airBrake: [false, Validators.compose([Validators.required])],
        endorsementsRadio: ['', Validators.compose([Validators.required])],
        // cdlClassClassA: ['', Validators.compose([Validators.required])],
        // classB: ['', Validators.compose([Validators.required])],
        // classC: ['', Validators.compose([Validators.required])],
        // nonCdl: ['', Validators.compose([Validators.required])],
      }
    );
    this.expirationLogSettingsFormGroup = this.fb.group(
      {
        lastDrugTest: [this.currentDate, Validators.compose([Validators.required])],
        nextDrugTest: [this.currentDate, Validators.compose([Validators.required])],
        nextAlcohalTest: [this.currentDate, Validators.compose([Validators.required])],
        lastAlcohalTest: [this.currentDate, Validators.compose([Validators.required])],

        physExamExp: [this.currentDate, Validators.compose([Validators.required])],
        oORegExp: [this.currentDate, Validators.compose([Validators.required])],
        oOTractorExp: [this.currentDate, Validators.compose([Validators.required])],
        oOTrailerExp: [this.currentDate, Validators.compose([Validators.required])],

        oOInusrExp: [this.currentDate, Validators.compose([Validators.required])],
        otherInusrExp: [this.currentDate, Validators.compose([Validators.required])],
        mvaExp: [this.currentDate, Validators.compose([Validators.required])],
        arcPrcExp: [this.currentDate, Validators.compose([Validators.required])],

        hazMatTraining: [this.currentDate, Validators.compose([Validators.required])],
        annualReview: [this.currentDate, Validators.compose([Validators.required])],
        milesDriven: ['', Validators.compose([Validators.required])],
        yrsExp: ['', Validators.compose([Validators.required])],
      }
    );
  }

  onFileChange(event:any){
    if (event.target.files.length > 0){
      this.editDriverFormGroup.patchValue({
        fileSource: event.target.files[0]
      });
    }
  }

  uploadValidDriverImage(){
    const formData = new FormData();
    formData.append('file', this.editDriverFormGroup.get('fileSource')?.value);
    this.driversService.uploadDriverImage(this.driverId, formData)
      .pipe(shareReplay(), first())
      .subscribe((driverImage: any) => {
        this.driversService.getDriver(this.driverId);
      });
  }

  updateEquipmentExperienceEndorsements(){
    this.driver.equipmentExperienceEndorsements = {
      flatbed: this.equipmentExperienceEndorsementsFormGroup.controls.flatbed.value,
      van: this.equipmentExperienceEndorsementsFormGroup.controls.van.value,
      refrigerated: this.equipmentExperienceEndorsementsFormGroup.controls.refrigerated.value,
      dropDeck: this.equipmentExperienceEndorsementsFormGroup.controls.dropDeck.value,
      towawayVehicles: this.equipmentExperienceEndorsementsFormGroup.controls.towawayVehicles.value,
      passengerVehicles: this.equipmentExperienceEndorsementsFormGroup.controls.passengerVehicles.value,
      dblTriple: this.equipmentExperienceEndorsementsFormGroup.controls.dblTriple.value,
      tanker: this.equipmentExperienceEndorsementsFormGroup.controls.tanker.value,
      hazMat: this.equipmentExperienceEndorsementsFormGroup.controls.hazMat.value,
      hazMatTanker: this.equipmentExperienceEndorsementsFormGroup.controls.hazMatTanker.value,
      airBrake: this.equipmentExperienceEndorsementsFormGroup.controls.airBrake.value,
      endorsementsRadio: this.equipmentExperienceEndorsementsFormGroup.controls.endorsementsRadio.value,
      // cdlClassClassA: this.equipmentExperienceEndorsementsFormGroup.controls.cdlClassClassA.value,
      // classB: this.equipmentExperienceEndorsementsFormGroup.controls.classB.value,
      // classC: this.equipmentExperienceEndorsementsFormGroup.controls.classC.value,
      // nonCdl: this.equipmentExperienceEndorsementsFormGroup.controls.nonCdl.value,
    }
    // this.equipmentExperienceEndorsementsFormGroup.reset();
    // console.log('updateEquipmentExperienceEndorsements')
    // console.log(this.driver.equipmentExperienceEndorsements)
    // this.update({'updateEquipmentExperienceEndorsements': true});
    this.update();
  }

  updateExpirationLogSettings(){
    this.driver.expirationLogSettings = {
      lastDrugTest: this.expirationLogSettingsFormGroup.controls.lastDrugTest.value,
      nextDrugTest: this.expirationLogSettingsFormGroup.controls.nextDrugTest.value,
      lastAlcohalTest: this.expirationLogSettingsFormGroup.controls.lastAlcohalTest.value,
      nextAlcohalTest: this.expirationLogSettingsFormGroup.controls.nextAlcohalTest.value,

      physExamExp: this.expirationLogSettingsFormGroup.controls.physExamExp.value,
      oORegExp: this.expirationLogSettingsFormGroup.controls.oORegExp.value,
      oOTractorExp: this.expirationLogSettingsFormGroup.controls.oOTractorExp.value,
      oOTrailerExp: this.expirationLogSettingsFormGroup.controls.oOTrailerExp.value,

      oOInusrExp: this.expirationLogSettingsFormGroup.controls.oOInusrExp.value,
      otherInusrExp: this.expirationLogSettingsFormGroup.controls.otherInusrExp.value,
      mvaExp: this.expirationLogSettingsFormGroup.controls.mvaExp.value,
      arcPrcExp: this.expirationLogSettingsFormGroup.controls.arcPrcExp.value,

      hazMatTraining: this.expirationLogSettingsFormGroup.controls.hazMatTraining.value,
      annualReview: this.expirationLogSettingsFormGroup.controls.annualReview.value,
      milesDriven: this.expirationLogSettingsFormGroup.controls.milesDriven.value,
      yrsExp: this.expirationLogSettingsFormGroup.controls.yrsExp.value,
    }
    // this.expirationLogSettingsFormGroup.reset();
    // console.log('updateExpirationLogSettings')
    // console.log(this.driver.expirationLogSettings)
    this.update();
  }

  updateCertification(){
    let certificationIndex = this.driver.certifications.findIndex(((obj: any) => obj._id == this.editCertificationFormGroup.controls.certificationId.value));
    this.driver.certifications[certificationIndex].drivingSchool = this.editCertificationFormGroup.controls.drivingSchool.value
    this.driver.certifications[certificationIndex].country = this.editCertificationFormGroup.controls.country.value
    this.driver.certifications[certificationIndex].state = this.editCertificationFormGroup.controls.state.value
    this.driver.certifications[certificationIndex].city = this.editCertificationFormGroup.controls.city.value
    this.driver.certifications[certificationIndex].contact = this.editCertificationFormGroup.controls.contact.value
    this.driver.certifications[certificationIndex].phone = this.editCertificationFormGroup.controls.phone.value
    this.driver.certifications[certificationIndex].startDate = this.editCertificationFormGroup.controls.startDate.value
    this.driver.certifications[certificationIndex].graduationDate = this.editCertificationFormGroup.controls.graduationDate.value
    this.driver.certifications[certificationIndex].rank = this.editCertificationFormGroup.controls.rank.value
    this.driver.certifications[certificationIndex].recruiter = this.editCertificationFormGroup.controls.recruiter.value
    this.driver.certifications[certificationIndex].referredBy = this.editCertificationFormGroup.controls.referredBy.value
    this.driver.certifications[certificationIndex].comments = this.editCertificationFormGroup.controls.comments.value
    // console.log('updateCertification')
    // console.log(this.driver.certifications[certificationIndex])
    this.editCertificationFormGroup.reset();
    this.update();
  }

  fillCertificationEditForm(certificationCurrentObject: any){
    if(certificationCurrentObject?.state?._id !== undefined){
      this.onCertCountryChange({target:{value: certificationCurrentObject?.country?._id}}, () => {
        this.editCertificationFormGroup.patchValue({
          state: certificationCurrentObject?.state?._id,
        });
        if(this.states.length > 0 && certificationCurrentObject?.city?._id !== undefined){
          this.onCertStateChange({target:{value: certificationCurrentObject?.state?._id}}, () => {
            this.editCertificationFormGroup.patchValue({
              city: certificationCurrentObject?.city?._id,
            });
          })
        }
      })
    }
    // this.editCertificationFormGroup.patchValue({
    //   state: certificationCurrentObject?.state,
    //   city: certificationCurrentObject?.city,
    // });
    this.editCertificationFormGroup.patchValue({
      certificationId: certificationCurrentObject?._id,
      drivingSchool: certificationCurrentObject?.drivingSchool,
      country: certificationCurrentObject?.country?._id,
      contact: certificationCurrentObject?.contact,
      phone: certificationCurrentObject?.phone,
      startDate: certificationCurrentObject?.startDate,
      graduationDate: certificationCurrentObject?.graduationDate,
      rank: certificationCurrentObject?.rank,
      recruiter: certificationCurrentObject?.recruiter,
      referredBy: certificationCurrentObject?.referredBy,
      comments: certificationCurrentObject?.comments,
    });
  }

  deleteCertification(certificationCurrentObject: any){
    let certificationName = this.titleCasePipe.transform(certificationCurrentObject.drivingSchool);
    Swal.fire({
      title: 'Are you sure want to delete this Certification ' + certificationName + ' ?',
      text: 'You will not be able to recover this Certification',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete Certification',
      cancelButtonText: 'No, keep it',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#50CD89',
    }).then((result: any) => {
      if (result.value){
        this.driver.certifications.splice(this.driver.certifications.findIndex(function(i: any){
          return i._id === certificationCurrentObject._id;
        }), 1);
        this.update();
        Swal.fire({
          title: 'Deleted!',
          html: 'Your Certification ' + certificationName + ' has been deleted.',
          icon: 'success',
          confirmButtonColor: '#50CD89'
        })
      } else if (result.dismiss === Swal.DismissReason.cancel){
        Swal.fire({
          title: 'Cancelled',
          html: 'Your Certification ' + certificationName + ' is safe :)',
          icon: 'error',
          confirmButtonColor: '#50CD89'
        })
      }
    })
  }

  update(){
    let allCertifications = [...this.driver.certifications];
    if(allCertifications.length > 0)
      allCertifications = allCertifications.map(({_id, ...rest}) => {
        // console.log('Cert Obj before modifications')
        // console.log({...rest})
        // console.log(typeof rest['country'])
        if(typeof rest['country'] !== 'string')
          rest['country'] = rest['country']['_id']
        if(typeof rest['state'] !== 'string')
          rest['state'] = rest['state']['_id']
        if(typeof rest['city'] !== 'string')
          rest['city'] = rest['city']['_id']
        // console.log('Cert Obj after modifications')
        // console.log({...rest})
        return rest;
      });
    if (this.createCertificationFormGroup.valid){
      allCertifications.push({
        drivingSchool: this.createCertificationFormGroup.controls.drivingSchool.value,
        country: this.createCertificationFormGroup.controls.country.value,
        state: this.createCertificationFormGroup.controls.state.value,
        city: this.createCertificationFormGroup.controls.city.value,
        contact: this.createCertificationFormGroup.controls.contact.value,
        phone: this.createCertificationFormGroup.controls.phone.value,
        startDate: this.createCertificationFormGroup.controls.startDate.value,
        graduationDate: this.createCertificationFormGroup.controls.graduationDate.value,
        rank: this.createCertificationFormGroup.controls.rank.value,
        recruiter: this.createCertificationFormGroup.controls.recruiter.value,
        referredBy: this.createCertificationFormGroup.controls.referredBy.value,
        comments: this.createCertificationFormGroup.controls.comments.value,
      });
      this.createCertificationFormGroup.reset();
    }
    if (this.editDriverFormGroup.valid){
      let driver: any = {
        // code: this.editDriverFormGroup.controls.code.value,
        ratePerMile: this.editDriverFormGroup.controls.ratePerMile.value,
        active: this.editDriverFormGroup.controls.active.value,
        first_name: this.editDriverFormGroup.controls.first_name.value,
        last_name: this.editDriverFormGroup.controls.last_name.value,
        gender: this.editDriverFormGroup.controls.gender.value,
        address: this.editDriverFormGroup.controls.address.value,
        zip: this.editDriverFormGroup.controls.zip.value,
        state: this.editDriverFormGroup.controls.state.value,
        city: this.editDriverFormGroup.controls.city.value,
        country: this.editDriverFormGroup.controls.country.value,
        phone: this.editDriverFormGroup.controls.phone.value,
        mobile: this.editDriverFormGroup.controls.mobile.value,
        ssn: this.editDriverFormGroup.controls.ssn.value,
        tax_id: this.editDriverFormGroup.controls.tax_id.value,
        external_id: this.editDriverFormGroup.controls.external_id.value,
        dispatcher: this.editDriverFormGroup.controls.dispatcher.value,
        email: this.editDriverFormGroup.controls.email.value,
        image: this.driver.image,
        certifications: allCertifications,
        expirationLogSettings: this.driver.expirationLogSettings,
        equipmentExperienceEndorsements: this.driver.equipmentExperienceEndorsements,
      };
      if(
        this.editDriverFormGroup.controls.password.value !== '' &&
        this.editDriverFormGroup.controls.password.value !== undefined &&
        this.editDriverFormGroup.controls.password.value !== null
      ){
        driver['password'] = this.editDriverFormGroup.controls.password.value
      }
      if(
        this.editDriverFormGroup.controls.file.value !== undefined
        &&
        this.editDriverFormGroup.controls.file.value !== ''
        &&
        this.editDriverFormGroup.controls.fileSource.value !== undefined
        &&
        this.editDriverFormGroup.controls.fileSource.value !== ''
        &&
        this.editDriverFormGroup.controls.file.value !== null
        &&
        this.editDriverFormGroup.controls.fileSource.value !== null
      ){
        this.uploadValidDriverImage();
      }
      // console.log('DRIVER OBJ TO UPDATE IS');
      // console.log({...driver});
      this.driversService.updateDriver(this.driverId, {...driver})
        .pipe(shareReplay(), first())
        .subscribe((driver: any) => {
          this.editDriverFormGroup.reset();
          this.driversService.getDriver(this.driverId);
        });
    }
  }

  ngOnDestroy(){
    this.routeSub.unsubscribe();
    this.driverSubscription.unsubscribe();
    this.usersSubscription.unsubscribe();
  }

  open(content: any){
    this.modalService.open(content, this.modalOptions).result.then((result) => {
    }, (reason) => {
    });
  }

  parseFloat(number: any){
    return parseFloat(number);
  }

  // public config: any = {
  //   displayFn:(item: any) => { return item.name; }, //to support flexible text displaying for each item
  //   displayKey:"name", //if objects array passed which key to be displayed defaults to description
  //   search:true, //true/false for the search functionlity defaults to false,
  //   height: 'auto', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
  //   placeholder:'Select', // text to be displayed when no item is selected defaults to Select,
  //   customComparator: ()=>{}, // a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
  //   limitTo: 5, // number thats limits the no of options displayed in the UI (if zero, options will not be limited)
  //   moreText: 'more', // text to be displayed whenmore than one items are selected like Option 1 + 5 more
  //   noResultsFound: 'No results found!', // text to be displayed when no items are found while searching
  //   searchPlaceholder:'Search', // label thats displayed in search input,
  //   searchOnKey: 'name', // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
  //   clearOnSelection: false, // clears search criteria when an option is selected if set to true, default is false
  //   inputDirection: 'ltr', // the direction of the search input can be rtl or ltr(default)
  // }

  // selectionChanged(e: any){
  //   console.log('selectionChanged')
  //   console.log(e)
  // }

  onCountryChange(selectedCountryId: any, callback: any = function(){}){
    let countryId = selectedCountryId.target.value;
    this.countryIsoCode = _.find(this.countries, (country) => {
      return country._id === countryId;
    }).isoCode;
    this.countryService.getStatesOfCountry(this.countryIsoCode)
      .pipe(shareReplay(), first())
      .subscribe({
        next: (states: any) => {
          // console.log('STATES POPULATED')
          this.states = states;
          if(callback)
            callback(this.states)
        },
        error: (error) => {
          console.log('DRIVER DETAIL ALL STATES ERROR');
          console.log(error);
        }
      })
  }

  onStateChange(selectedStateId: any, callback: any = function(){}){
    // console.log('onStateChange CALLED');
    let stateId = selectedStateId.target.value;
    this.stateIsoCode = _.find(this.states, (state) => {
      return state._id === stateId;
    }).isoCode;
    this.countryService.getCitiesOfState(this.countryIsoCode, this.stateIsoCode)
      .pipe(shareReplay(), first())
      .subscribe({
        next: (cities: any) => {
          this.cities = cities;
          if(callback)
            callback(this.cities)
        },
        error: (error) => {
          console.log('DRIVER DETAIL ALL CITIES ERROR');
          console.log(error);
        }
      })
  }

  onCertCountryChange(selectedCountryId: any, callback: any = function(){}){
    let countryId = selectedCountryId.target.value;
    this.certCountryIsoCode = _.find(this.certCountries, (country) => {
      return country._id === countryId;
    }).isoCode;
    this.countryService.getStatesOfCountry(this.certCountryIsoCode)
      .pipe(shareReplay(), first())
      .subscribe({
        next: (states: any) => {
          // console.log('STATES POPULATED')
          this.certStates = states;
          if(callback)
            callback(this.certStates)
        },
        error: (error) => {
          console.log('DRIVER DETAIL CERT ALL STATES ERROR');
          console.log(error);
        }
      })
  }

  onCertStateChange(selectedStateId: any, callback: any = function(){}){
    // console.log('onCertStateChange CALLED');
    let stateId = selectedStateId.target.value;
    this.certStateIsoCode = _.find(this.certStates, (state) => {
      return state._id === stateId;
    }).isoCode;
    this.countryService.getCitiesOfState(this.certCountryIsoCode, this.certStateIsoCode)
      .pipe(shareReplay(), first())
      .subscribe({
        next: (cities: any) => {
          this.certCities = cities;
          if(callback)
            callback(this.certCities)
        },
        error: (error) => {
          console.log('DRIVER DETAIL CERT ALL CITIES ERROR');
          console.log(error);
        }
      })
  }

}

