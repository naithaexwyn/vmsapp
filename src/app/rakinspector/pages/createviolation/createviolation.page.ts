import { Component, OnInit, ViewChild, ChangeDetectorRef, ElementRef, HostListener, NgZone } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { ViewmapmodalPage } from '../modalpopup/viewmapmodal/viewmapmodal.page';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Globalization } from '@ionic-native/globalization/ngx';
import { TranslateService } from '@ngx-translate/core';
import { IonicSelectableComponent } from 'ionic-selectable';
import { ViewerModalComponent } from 'ngx-ionic-image-viewer';

import { File, FileEntry } from '@ionic-native/File/ngx';
import 'moment-timezone';
import {
  ToastController,
  Platform,
  LoadingController
} from '@ionic/angular';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  Marker,
  GoogleMapsAnimation,
  MyLocation,
  ILatLng,
  BaseArrayClass
} from '@ionic-native/google-maps';
import { ModuleService } from 'src/app/shared/services/module.service';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/shared/services/toast.service';
import { DatePipe } from '@angular/common';
import { Network } from '@ionic-native/network/ngx';
import { HttpBackend, HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions, CaptureVideoOptions } from '@ionic-native/media-capture/ngx';
import { LoaderService } from 'src/app/shared/services/loader.service';
import * as moment from 'moment';
import 'moment-timezone';
import { FileUploadService } from 'src/app/shared/services/file-upload.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ConnectivityService } from 'src/app/shared/services/offline-code/connectivity.service';
import { DbService } from 'src/app/shared/services/offline-code/db.service';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { VideoEditor } from '@ionic-native/video-editor/ngx';

class Port {
  public id: number;
  public name: string;
}

@Component({
  selector: 'app-createviolation',
  templateUrl: './createviolation.page.html',
  styleUrls: ['./createviolation.page.scss'],
  providers: [DatePipe]
})
export class CreateviolationPage implements OnInit {


  videoData: any =[];
  svtSelected: any = 0;
  map: GoogleMap;
  imgUrl;
  sideCodeSelected: any;
  creatViolation: FormGroup;
  voilationType: any=[];
  voilationTitleData: any = [];// = [{ title_id: '', violation_eng_title: '' }];
  sideCode: any = [];//[{ side_code_id: '', description: '' }];
  submitted = true;
  errorMsg = '';
  isVehicle: boolean = false;
  isCommercial: boolean = false;
  isIndividual: boolean = false;
  plateSourceList: any;
  selectedSourceVal: any;
  plateCodeDataList: any = [];
  oldCodeDataList: any;
  selectedPlateCode: any;
  selectedOldCode: any;
  violCategoryList: any;
  violCategoryListAll: any;
  fineCodeList: any=[];
  reservedCodeList: any;
  areaList: any;
  fineAmountList: any;
  setLanguage: any;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Opacity: any = 1;
  setLocation: any;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  CurrentLocation: any;
  selectVioTitle: any;
  selectSidecodeTitle: any;
  updatedVioTitleID: any = "";

  upDatedSideCodeID: any;
  ports: Port[];
  port: Port;
  dBphotos: any = [];
  filesDb: any = [];
  violationCategorySelected: any;
  isAnimalhitCountData: boolean = false;
  VideoMedia: any;
  imageBase = environment.violationImgUrl;
  sourceId: any;
  cordova: any;
  showReservation: boolean = false;

  @ViewChild('violationTitleComponent') violationTitleComponent: IonicSelectableComponent;
  @ViewChild('sideCodeComponent') sideCodeComponent: IonicSelectableComponent;
  @ViewChild('documnetNumberComponent') documnetNumberComponent: IonicSelectableComponent;
  @ViewChild('licenseNumberComponent') licenseNumberComponent: IonicSelectableComponent;
  @ViewChild('plateNumberComponent') plateNumberComponent: IonicSelectableComponent;
  @ViewChild('fineCodeComponent') fineCodeComponent : IonicSelectableComponent;
  @ViewChild('areaComponent') areaComponent : IonicSelectableComponent;

  onClear: boolean = false;
  addVioTitleData: any;
  sCodeData: any;
  documentList: any;
  onDisconnect: boolean;
  onConnect: boolean;
  basePhotos: any = [];
  photos: any = [];
  identityDocBasePhotos: any = [];
  identityDocPhotos: any = [];
  sideCodeId: any;
  tzNames: any;
  file = new File();
  msgVideo: any;
  blob: any;
  selectedSourceValDocument: any;
  percentDone: any;
  sideCodeActualData: any;
  documentTypeName: any;
  private httpClient: HttpClient;
  actual_amount: any;
  repeat_amount: any;
  is_violation_repeated: any;
  documentNumber: any="";
  licenseNumber: any="";
  platecodeNumber: any="";
  documentNumbersList: any = [];// = [{ document_no: '' }];
  licenseNumberList: any = [];// = [{ license_no: '' }];
  plateCodeList: any = [];// = [{ license_plate_no: '' }];
  document: any;
  camDisabled: boolean = false;
  offlineViolation: any = {};
  offlinedocs: any = [];
  offlinevideos: any = [];
  offline_docpath: any = "";
  offline_videos_path = "";
  offline_signature_path = "";
  /* Fine Code */
  finecode: any;
  finecodeValue: any;
  /* Fine Code */
  elementVisible: boolean = false;
  abercheckbox: boolean = false;
  license: any;
  reservedCode: any;
  /*----------*/
  plateNumber: any;
  reservedIdNumber: any;
  /*---------*/
  finecodecount: boolean = true;
  ownerPhoneRequired: boolean = false;
  @ViewChild('canvas', { static: true }) signaturePadElement;
  signaturePad: any;
  canvasWidth: number;
  canvasHeight: number;
  isCustomerwithproof: string = "Yes";
  commparamvalue: any = '0';
  licenseparamList: any;
  name_ded_eng: any;
  name_ded_ar: any;
  isPlateSourceselectedOther: boolean = false;
  check: any;
  wImg: any;
  vImg: any;
  videoresponse: string;
  fName: any;
  isvideoCaptured: boolean = false;
  showText: boolean = false;
  selectedPlateSource: any;
  plateCategoryData: any;
  plateCategoryid: any;
  fine_category_id: any="";
  offline: boolean = false;
  carsId: any;
  selectedplatecategoryId: any;
  platecategory: any;
  offlineIdentityDoc : any = [];
  offlineViolationDoc: any = [];
  offlineVideo: any = [];
  licenseLocation: string;
  licenseExpiryDate: any;
  reservationSitesList: any;
  reservationSitesAreasList: any;
  latitude: any;
  longitude: any;
  selectedPlateSourceCode: any;
  selectedReservedData: any;
  alertErrorMessage: string;
  allowStatus: any;
  showMandatory: boolean = false;
  showVehicleClass: boolean = false;
  vehicleClassData: any;
  warning_required: boolean = false;
  warningSpecificationId: any;
  createViolation: boolean = false;
  specificationList: any;
  durationData: any;
  durationSelected: any;
  defaultwarning: boolean;
  dedSelectedEmirates : any;
  user_type: any;
  constructor(
    private zone: NgZone,
    private modalController: ModalController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private platform: Platform,
    private camera: Camera,
    private moduleService: ModuleService,
    private fb: FormBuilder,
    private globalization: Globalization,
    private translateService: TranslateService,
    public routerServices: Router,
    public toastService: ToastService,
    private datePipe: DatePipe,
    private network: Network,
    private http: HttpClient,
    private mediaCapture: MediaCapture,
    private loaderService: LoaderService,
    public fileUploadService: FileUploadService,
    httpBackend: HttpBackend,
    public geolocation: Geolocation,
    public cRef: ChangeDetectorRef,
    private connectivity: ConnectivityService,
    private dbservice: DbService,
    private el: ElementRef,
    private androidPermissions: AndroidPermissions,
    private locationAccuracy: LocationAccuracy,
    private httpobj: HTTP, private elementRef: ElementRef,
    private transfer: FileTransfer,
    public alertCtrl: AlertController,
    private videoEditor: VideoEditor
  ) {
    this.sourceId = localStorage.getItem('sourceId');
    this.user_type = localStorage.getItem('user_type');
    console.log("sourceeeee", this.sourceId);
    this.dedSelectedEmirates = JSON.parse(localStorage.getItem('dedSelectedEmirate'));
    
    
    this.httpClient = new HttpClient(httpBackend);
    console.log(moment.tz("Asia/Dubai").format('yyyy-MM-dd H:mm:ss'));

    this.ports = [
      { id: 1, name: 'Tokai' },
      { id: 2, name: 'Vladivostok' },
      { id: 3, name: 'Navlakhi' }
    ];

    this.setLanguage = window.localStorage.getItem('language');
    this.translateService.use(this.setLanguage);

    this.creatViolation = this.fb.group({
      source_id:[''],
      voilationType: ['', [Validators.required]],
      voilationTitle: [''],
      voilationtitleid: [''],
      sideCode: [0],
      sideCodeID: [0],
      documentType: [''],
      documentNo: [''],
      sideCodeDescription: [''],
      licenseNo: [''],
      plateNo: [''],
      plateSource: [''],
      plateCode: [''],
      plateColor: [''],
      oldCode: [''],
      violationCategory: ['', [Validators.required]],
      fineCode: ['', [Validators.required]],
      finecodecount: ['1'],
      finePlace: [''],
      area: ['', [Validators.required]],
      fineNotes: ['', [Validators.required]],
      recipientPerson: ['', [Validators.required]],
      phone: ['', [Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      recipientMobile: ['', [Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      email: ['', [Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      reservedCode: [''],
      reservedIdNumber: [''],
      ownername: [''],
      ownerphone: [''],
      ownerdescription: [''],
      identityDoc: [''],
      identityDoc_file: [''],
      address: [''],
      description: [''],
      dailyFines: [''],
      violationDocument: [''],
      fineAmount: [''],
      camerafiles: [''],
      animalhitCount: [''],
      mulltifiles: [''],
      videofile: [''],
      video: [''],
      customerwithproof: [''],
      searchparamcommercial: [''],
      other_plate_source: ['', [Validators.required]],
      plateCategory: [''],
      areaCode:[''],
      reservationSites:[''],
      reservationSiteAreas: [''],
      vehicle_class_type:[''],
      licenseExpiryDate:[''],
      licenseLocation:[''],
      warningDuration:[''],
      fc_warning_hours:[''],
      fc_warning_hours_title:[''],
      warningSpecification:[''],
      building_number : [''],
      street_name:['']
    });
  }
  get showSelectable(): boolean {
  if (this.selectedPlateSourceCode == null || !Array.isArray(this.dedSelectedEmirates)) {
    return false;
  }

  // Convert both to string for comparison → avoids type mismatch
  return this.dedSelectedEmirates.map(x => String(x)).includes(String(this.selectedPlateSourceCode));
}


  onInput($event: any) {
    if ($event.target.value.length > 10) {
      console.log($event.target.getAttribute('formControlName'))
      this.creatViolation.controls[$event.target.getAttribute('formControlName')].setValue($event.target.value.slice(0, 10));
    }
  }

  ngOnInit() {

    this.file.checkDir(this.file.externalDataDirectory, 'ViolationDocs').then(response => {
      console.log('Directory exists' + response);
    }).catch(err => {
      console.log('Directory doesn\'t exist' + JSON.stringify(err));
      this.file.createDir(this.file.externalDataDirectory, 'ViolationDocs', false).then(response => {
        console.log('Directory create' + response);
      }).catch(err => {
        console.log('Directory no create' + JSON.stringify(err));
      });
    });

    this.file.checkDir(this.file.externalDataDirectory, 'VIOLATORSIGNATURES').then(response => {
      console.log('Directory exists' + response);
    }).catch(err => {
      console.log('Directory doesn\'t exist' + JSON.stringify(err));
      this.file.createDir(this.file.externalDataDirectory, 'VIOLATORSIGNATURES', false).then(response => {
        console.log('Directory create' + response);
      }).catch(err => {
        console.log('Directory no create' + JSON.stringify(err));
      });
    });

    console.log(this.datePipe.transform(new Date(), 'yyyy-MM-dd H:mm:ss'));
    this.moduleService.languageEvent.subscribe((result: any) => {
      this.translateService.use(result);
    }),
      (error) => {
        console.log(error)
      };

    this.moduleService.mapEvent.subscribe((res: any) => {
      console.log('map res', res);
      let data = res;
      console.log('map data', data);
      this.creatViolation.controls['finePlace'].setValue(data.lat + ',' + data.lng);
    }),
      (error) => {
        console.log(error)
      };
    this.getVoilationTypeData();
    this.getDocumentTypeData();
    this.getReservedCodeList();
    this.getAreaData();
    this.getSideCodeData();
    this.getVehicleClassData();
    this.getWarningData();
    this.getWarningSpecificatins();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
  }

  init() {
    const canvas: any = this.elementRef.nativeElement.querySelector('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 400;

    if (this.signaturePad) {
      this.signaturePad.clear(); 
    }
  }

  public ngAfterViewInit(): void {
  
  }

  isCanvasBlank(): boolean {
    if (this.signaturePad) {
      return this.signaturePad.isEmpty() ? true : false;
    }
  }
  clear() {
    this.signaturePad.clear();
  }
  undo() {
    const data = this.signaturePad.toData();
    if (data) {
      data.pop(); // remove the last dot or line
      this.signaturePad.fromData(data);
    }
  }


  portChange(event: {
    component: IonicSelectableComponent,
    value: any,
  }, title: any) {
  
    event.component.searchText = "";
    console.log('port event:', event);
    if (title == 'vTitle') {
      const objdata: any = event.value;
      console.log('vTitle port:', event.value.title_id);
      this.updatedVioTitleID = event.value.title_id;
    }
    else {
      console.log("enteredd")
      if (!this.isCommercial) {
        console.log('sCode port:', event.value.side_code_id);
        this.upDatedSideCodeID = event.value.side_code_id;
        this.sideCodeValueData(this.upDatedSideCodeID);
      }
      else {
        this.creatViolation.controls['sideCodeDescription'].setValue(this.setLanguage == 'ar' ? event.value.description_eng : event.value.description);
  
        if (event.value.side_code_no != "" && event.value.side_code_no != null) {
          this.creatViolation.controls['licenseNo'].setValue({ 'license_no': event.value.side_code_no });
          this.licenseNumber = event.value.side_code_no;
        }
        else {
          this.licenseNumber = "";
          this.license = "";
        }
        let paramObj = {
          "licenseNo": this.licenseNumber
        }
  
        this.moduleService.GetLicenseByLicenseNumber(paramObj).subscribe((res) => {
          console.log(res);
          if (res.ResponseContent && res.ResponseContent.length > 0) {
            this.licenseNumberList = res.ResponseContent;
            this.licenseNumberList.map(
              obj => {
                obj.license_no = obj.LicenseNumber
              }
            );
  
            // Check if the license status is in the allowStatuses array
            this.allowStatus = res.allowStatuses;
            if (this.allowStatus.includes(this.licenseNumberList[0].LicenseStatusEN)) {
              this.license = this.licenseNumberList[0];
              this.licenseExpiryDate = this.licenseNumberList[0].ExpiryDate;
              this.licenseLocation = this.licenseNumberList[0].X + ',' + this.licenseNumberList[0].Y;
              
              let lInfo = this.licenseNumberList;
              console.log(lInfo);
              if (lInfo.length > 0) {
                let rInfo = lInfo[0].Persons.filter((item: any) => { return item.RoleEN.toLowerCase().indexOf('director') >= 0 });
                
                // this.creatViolation.controls['sideCodeDescription'].setValue(this.setLanguage == 'ar' ? lInfo[0].NameAR : lInfo[0].NameEN);
                this.creatViolation.controls['sideCodeDescription'].setValue(lInfo[0].NameAR);
                if (rInfo.length > 0) {
                  this.creatViolation.controls['ownername'].setValue(this.setLanguage == 'ar' ? rInfo[0].NameAR : rInfo[0].NameEN);
                  this.creatViolation.controls['ownerphone'].setValue(rInfo[0].PrimaryPhoneNumber ? ((rInfo[0].PrimaryPhoneNumber[0] !== '0' ? '0' : '') + rInfo[0].PrimaryPhoneNumber) : '');
                  this.creatViolation.controls['email'].setValue(rInfo[0].Email);
                  this.name_ded_eng = lInfo[0].NameEN;
                  this.name_ded_ar = lInfo[0].NameAR;
                }
  
                rInfo = lInfo[0].Persons.filter((item: any) => { return item.RoleEN.toLowerCase().indexOf('owner') >= 0 });
                if (rInfo.length > 0) {
                  this.creatViolation.controls['ownername'].setValue(this.setLanguage == 'ar' ? rInfo[0].NameAR : rInfo[0].NameEN);
                  this.creatViolation.controls['ownerphone'].setValue(rInfo[0].PrimaryPhoneNumber ? ((rInfo[0].PrimaryPhoneNumber[0] !== '0' ? '0' : '') + rInfo[0].PrimaryPhoneNumber) : '');
                  this.creatViolation.controls['email'].setValue(rInfo[0].Email);
                  this.name_ded_eng = lInfo[0].NameEN;
                  this.name_ded_ar = lInfo[0].NameAR;
                }
  
                rInfo = lInfo[0].Persons.filter((item: any) => { return item.RoleEN.toLowerCase().indexOf('partner') >= 0 });
                if (rInfo.length > 0) {
                  this.creatViolation.controls['ownername'].setValue(this.setLanguage == 'ar' ? rInfo[0].NameAR : rInfo[0].NameEN);
                  this.creatViolation.controls['ownerphone'].setValue(rInfo[0].PrimaryPhoneNumber ? ((rInfo[0].PrimaryPhoneNumber[0] !== '0' ? '0' : '') + rInfo[0].PrimaryPhoneNumber) : '');
                  this.creatViolation.controls['email'].setValue(rInfo[0].Email);
                  this.name_ded_eng = lInfo[0].NameEN;
                  this.name_ded_ar = lInfo[0].NameAR;
                }
  
                rInfo = lInfo[0].Persons.filter((item: any) => { return item.RoleEN.toLowerCase().indexOf('individual') >= 0 });
                if (rInfo.length > 0) {
                  this.creatViolation.controls['ownername'].setValue(this.setLanguage == 'ar' ? rInfo[0].NameAR : rInfo[0].NameEN);
                  this.creatViolation.controls['ownerphone'].setValue(rInfo[0].PrimaryPhoneNumber ? ((rInfo[0].PrimaryPhoneNumber[0] !== '0' ? '0' : '') + rInfo[0].PrimaryPhoneNumber) : '');
                  this.creatViolation.controls['email'].setValue(rInfo[0].Email);
                  this.name_ded_eng = lInfo[0].NameEN;
                  this.name_ded_ar = lInfo[0].NameAR;
                }
              }
            } else {
              // Show alert if the license status is not in allowStatuses
              this.alertErrorMessage = `The license status "${this.licenseNumberList[0].LicenseStatusEN}" is not allowed.`;
              this.showAlert();
              // this.toastService.showError(`The license status "${this.licenseNumberList[0].LicenseStatusEN}" is not allowed.`, "Alert");
              this.license = {};
              this.resetFormFields();
            }
          } else {
            this.licenseNumberList = [];
            this.toastService.showError("No license found with the given number.", "Alert");
            this.resetFormFields();
          }
        }, (error) => {
          console.error(error);
          this.toastService.showError("An error occurred while fetching the license details.", "Error");
          this.resetFormFields();
        });
      }
    }
  }
  
  // Add this method to reset form fields
  resetFormFields() {
    this.creatViolation.controls['ownername'].reset();
    this.creatViolation.controls['ownerphone'].reset();
    this.creatViolation.controls['email'].reset();
    this.name_ded_eng = '';
    this.name_ded_ar = '';
  }
  searchSideCodes(event: {
    component: IonicSelectableComponent,
    text: string
  }) {
    let portName = event.text;
    event.component.startSearch();
    event.component.hideLoading();
    if (!this.isCommercial) {
      if (portName != "") {
        if (portName.length >= 3) {
          let payload = {
            "searchtext": portName
          }
          this.moduleService.searchSideCode(payload).subscribe((data: any) => {
            this.sideCode = data.data.map(({ side_code_id, side_code_no, description, description_eng, side_type_code, car_no, car_sid, class_pad_new,
              class_pad, calar_pad, license_no, document_type, document_no }: any) => ({
                side_code_id, side_code_no, description, description_eng, side_type_code, car_no, car_sid,
                class_pad_new, class_pad, calar_pad, license_no, document_type, document_no
              }));
            this.sideCode = this.sideCode.filter((value: any, index: any, a: any) => a.findIndex((t: any) => (t.side_code_id === value.side_code_id)) === index);
            event.component.items = this.sideCode;
            event.component.endSearch();
            if (this.sideCode.length === 0) {
              this.sideCodeComponent.canClear = false;
            }
            else {
              this.sideCodeComponent.canClear = true;
            }
          }),
            (error) => {
              console.log(error)
            }

        }
      }
      else {
        if (!this.isCommercial) {
          this.getSideCodeData();
        }
      }

    }
    else {
      this.sideCode = [];
      if (portName != "") {
        if (portName.length >= 3) {
          let searchValue = "";
          searchValue = event.component.searchText;
          let paramObj = {
            "term": searchValue
          }
          this.moduleService.GetLicenceByParam(paramObj).subscribe((res) => {
            console.log(res);
            if (res.ResponseContent.length > 0) {
              console.log(this.sideCode)
              this.sideCode = res.ResponseContent.map(({ side_code_id, LicenseNumber: side_code_no, NameEN: description, NameAR: description_eng }, index) => ({
                side_code_id: index + 1, side_code_no, description, description_eng
              }));
              event.component.items = this.sideCode;
              event.component.endSearch();
              if (this.sideCode.length === 0) {
                this.sideCodeComponent.canClear = false;
              }
              else {
                this.sideCodeComponent.canClear = true;
              }
            }
          })
        }
      }
    }
  }


  documentNumberChange(event: {
    component: IonicSelectableComponent,
    value: any,
  }) {
    this.fineCodeComponent.clear();
    this.finecode={};
    this.creatViolation.controls['fineAmount'].setValue('');
    this.documentNumber = event.value.document_no;
  }

  licenseNumberChange(event: {
    component: IonicSelectableComponent,
    value: any,
  }) {

    this.fineCodeComponent.clear();
    this.finecode={};
    this.creatViolation.controls['fineAmount'].setValue('');
    if (!this.isCommercial) {
      this.licenseNumber = event.value.license_no;
    }
    else {
      this.licenseNumber = event.value.license_no;
      if (this.licenseNumberList.length > 0) {
        let lInfo = this.licenseNumberList.filter((item) => { return item.license_no == event.value.license_no })
        console.log(lInfo);
        if (lInfo.length > 0) {
          if (this.allowStatus.includes(this.licenseNumberList[0].LicenseStatusEN)) {

            let rInfo = lInfo[0].Persons.filter((item: any) => { return item.RoleEN.toLowerCase().indexOf('director') >= 0 })
            this.creatViolation.controls['sideCodeDescription'].setValue(this.setLanguage == 'ar' ? lInfo[0].NameAR : lInfo[0].NameEN);
            if (rInfo.length > 0) {
              this.creatViolation.controls['ownername'].setValue(this.setLanguage == 'ar' ? rInfo[0].NameAR : rInfo[0].NameEN);
              this.creatViolation.controls['ownerphone'].setValue(rInfo[0].PrimaryPhoneNumber ? ((rInfo[0].PrimaryPhoneNumber[0] !== '0' ? '0' : '') + rInfo[0].PrimaryPhoneNumber) : '');
              //this.creatViolation.controls['ownerphone'].setValue('0' + rInfo[0].PrimaryPhoneNumber);
              this.creatViolation.controls['email'].setValue(rInfo[0].Email);
              this.name_ded_eng = lInfo[0].NameEN;
              this.name_ded_ar = lInfo[0].NameAR;
            }

            rInfo = lInfo[0].Persons.filter((item: any) => { return item.RoleEN.toLowerCase().indexOf('owner') >= 0 })
            if (rInfo.length > 0) {
              this.creatViolation.controls['ownername'].setValue(this.setLanguage == 'ar' ? rInfo[0].NameAR : rInfo[0].NameEN);
              this.creatViolation.controls['ownerphone'].setValue(rInfo[0].PrimaryPhoneNumber ? ((rInfo[0].PrimaryPhoneNumber[0] !== '0' ? '0' : '') + rInfo[0].PrimaryPhoneNumber) : '');
              this.creatViolation.controls['email'].setValue(rInfo[0].Email);
              this.name_ded_eng = lInfo[0].NameEN;
              this.name_ded_ar = lInfo[0].NameAR;
            }

            rInfo = lInfo[0].Persons.filter((item: any) => { return item.RoleEN.toLowerCase().indexOf('partner') >= 0 })
            if (rInfo.length > 0) {
              this.creatViolation.controls['ownername'].setValue(this.setLanguage == 'ar' ? rInfo[0].NameAR : rInfo[0].NameEN);
              this.creatViolation.controls['ownerphone'].setValue(rInfo[0].PrimaryPhoneNumber ? ((rInfo[0].PrimaryPhoneNumber[0] !== '0' ? '0' : '') + rInfo[0].PrimaryPhoneNumber) : '');
              this.creatViolation.controls['email'].setValue(rInfo[0].Email);
              this.name_ded_eng = lInfo[0].NameEN;
              this.name_ded_ar = lInfo[0].NameAR;
            }

            rInfo = lInfo[0].Persons.filter((item: any) => { return item.RoleEN.toLowerCase().indexOf('individual') >= 0 })
            if (rInfo.length > 0) {
              this.creatViolation.controls['ownername'].setValue(this.setLanguage == 'ar' ? rInfo[0].NameAR : rInfo[0].NameEN);
              this.creatViolation.controls['ownerphone'].setValue(rInfo[0].PrimaryPhoneNumber ? ((rInfo[0].PrimaryPhoneNumber[0] !== '0' ? '0' : '') + rInfo[0].PrimaryPhoneNumber) : '');
              //this.creatViolation.controls['ownerphone'].setValue('0' + rInfo[0].PrimaryPhoneNumber);
              this.creatViolation.controls['email'].setValue(rInfo[0].Email);
              this.name_ded_eng = lInfo[0].NameEN;
              this.name_ded_ar = lInfo[0].NameAR;
            }
          }
          else {
            if (lInfo[0].LicenseStatusEN) {
              this.toastService.showError("Enter License number has been " + lInfo[0].LicenseStatusEN, "Alert");
              return;
            }
            this.license = { license_no: lInfo[0].license_no }
          }
        }
      }
    }
  }

  onLicenseSearchFail(event: {
    component: IonicSelectableComponent,
    text: string
  }) {
    this.getvoilationSearchByField(event.component.searchText);
    this.licenseNumber = event.component.searchText;
    event.component.showAddItemTemplate();
  };

  onLicenseSearchSuccess(event: {
    component: IonicSelectableComponent,
    text: string
  }) {
    if (event.component.searchText == '') {
      this.getvoilationSearchByField(event.component.searchText);
    }

    event.component.hideAddItemTemplate();
  }



  plateNumberChange(event: {
    component: IonicSelectableComponent,
    value: any,
  }) {
    this.fineCodeComponent.clear();
    this.finecode={};
    this.creatViolation.controls['fineAmount'].setValue('');
    this.platecodeNumber = event.value.license_plate_no;
    this.selectedSourceVal = "";
  }

  selectDocumentType(event: any) {
    this.selectedSourceVal = event.target.value;
    console.log("this.selectedSourceVal",this.selectedSourceVal);
    console.log("this.creatViolation.value['documentType']",this.creatViolation.value['documentType']);
  }

  onSearchFail(event: {
    component: IonicSelectableComponent,
    text: string
  }, info: any) {
    console.log("if fail search", event.component.searchText);
    this.violationTitleComponent.showAddItemTemplate();
    if (info == 'vTitle') {
      this.addVioTitleData = event.component.searchText;
      this.updatedVioTitleID = null;

    }
    else {
      console.log("if fail search2", event.component.searchText);
      this.sCodeData = event.component.searchText;
      let obj = {
        "sidetypeid":this.sideCodeId,
        "searchtext": event.component.searchText
      }
      this.moduleService.searchSideCode(obj).subscribe((data: any) => {
        this.sideCode = data.data;
        this.sideCode = this.sideCode.map(({ side_code_id, side_code_no, description, description_eng, side_type_code, car_no, car_sid, class_pad_new,
          class_pad, calar_pad, license_no, document_type, document_no }: any) => ({
            side_code_id, side_code_no, description, description_eng, side_type_code, car_no, car_sid,
            class_pad_new, class_pad, calar_pad, license_no, document_type, document_no
          }));
        this.sideCode = this.sideCode.filter((value: any, index: any, a: any) => a.findIndex((t: any) => (t.side_code_id === value.side_code_id)) === index);
      }),
        (error) => {
          console.log(error)
        }
      }
    }

  onDocumentSearchFail(event: {
    component: IonicSelectableComponent,
    text: string
  }) {

    this.getvoilationSearchByField(event.component.searchText);
    this.documentNumber = event.component.searchText;

    event.component.showAddItemTemplate();

  };



  onPlateNoSearchFail(event: {
    component: IonicSelectableComponent,
    text: string
  }) {
    //this.plateNumber=event.component.searchText;
    this.getvoilationSearchByField(event.component.searchText);
    this.platecodeNumber = event.component.searchText;
    event.component.showAddItemTemplate();
  };

  onSearchSuccess(event: {
    component: IonicSelectableComponent,
    text: string
  }) {
    // Hide form.
    console.log('event', event);
    console.log("event text", event.component.searchText);
    event.component.hideAddItemTemplate();
  }

  onDocumentSearchSuccess(event: {
    component: IonicSelectableComponent,
    text: string
  }) {
    // Hide form.
    console.log('event', event);
    console.log("event text", event.component.searchText);
    if (event.component.searchText == '') {

      this.getvoilationSearchByField(event.component.searchText);
    }

    event.component.hideAddItemTemplate();
  }



  onPlateNoSearchSuccess(event: {
    component: IonicSelectableComponent,
    text: string
  }) {
    // Hide form.
    console.log('event', event);
    this.platecodeNumber = event.component.searchText;
    console.log("event text", event.component.searchText);
    this.getvoilationSearchByField(event.component.searchText);
  }

  violationTitleClicked() {
    this.violationTitleComponent.clear();
  }

  confirm() {
    this.plateNumberComponent.confirm();
    this.plateNumberComponent.close();
  }

  addPort(title: any) {
    if (title == 'vTitle') {
      this.voilationTitleData = this.voilationTitleData.filter((item: any) => { return item.title_id != '' })
      const userName = localStorage.getItem('first_name') + '' + localStorage.getItem('last_name');
      let obj = {
        title_id: '',
        side_type_code: '',
        violation_eng_title: this.addVioTitleData,
        violation_ar_title: '',
        created_on: moment.tz("Asia/Dubai").format('YYYY-MM-DD HH:mm:ss'),
        created_by: userName,
        updated_on: moment.tz("Asia/Dubai").format('YYYY-MM-DD HH:mm:ss'),
        updated_by: userName,
        status: 'Active'
      };
      this.voilationTitleData = [obj, ...this.voilationTitleData];

      this.voilationTitleData = this.voilationTitleData.sort((a: any, b: any) => {
        if (a < b) { return 1; }
        if (a > b) { return -1; }
        return 0;
      });

      this.violationTitleComponent.hideAddItemTemplate();

    } else {
      console.log('else');
      let sObj = {
        side_code_id: null,
        side_code_no: null,
        description: this.sCodeData,
        description_eng: '',
        side_type_code: null,
        car_no: null,
        car_sid: null,
        class_pad_new: null,
        class_pad: null,
        calar_pad: null,
        license_no: null,
        document_type: null,
        document_no: null
      };
      this.sideCode.push(sObj);
      this.sideCodeComponent.hideAddItemTemplate();
    }
  }

  addDocument() {
    // this.documentNumbersList.push({ document_no: this.documentNumber });
    if (this.documentNumber != "") {
      this.documentNumbersList = [{ document_no: this.documentNumber }, ...this.documentNumbersList];
    }
    this.documnetNumberComponent.hideAddItemTemplate();
  }

  addLicense() {
    // this.licenseNumberList.push({ license_no: this.licenseNumber });
    if (this.licenseNumber != "") {
      this.licenseNumberList = [{ license_no: this.licenseNumber }, ...this.licenseNumberList];
      this.licenseNumberComponent.hideAddItemTemplate();
    }
  }
  addPlateNo() {
    //this.plateCodeList.push({ license_plate_no: this.platecodeNumber });
    if (this.platecodeNumber != "") {
      if (this.plateCodeList.find(x => x.license_plate_no == this.platecodeNumber) === undefined) {
        this.plateCodeList = [{ license_plate_no: this.platecodeNumber }, ...this.plateCodeList];
        this.plateNumberComponent.hideAddItemTemplate();
      }
    }
  }

  onSelectplateno(event: {
    component: IonicSelectableComponent,
    item: any,
    isSelected: boolean
  }) {
    this.plateNumberComponent.confirm();
    this.plateNumberComponent.close();
  }


  vioTitleAction(data: any) {
    console.log('selectVioTitle', data);
    console.log('selectVioTitle', this.voilationTitleData);
    let inputVal = this.voilationTitleData.filter((item: any) => item.violation_eng_title.indexOf(data) >= 0);
    console.log('Filter Vio Title Data', inputVal);
    if (inputVal.length === 1) {
      this.updatedVioTitleID = inputVal[0].title_id;
    } else {
      this.updatedVioTitleID = null;
    }
    console.log('updatedVioTitleID', this.updatedVioTitleID);
  }

  ionViewDidEnter() {
    this.platform.ready();
  }

  ionViewWillLeave() {
    const loadingExist = document.getElementsByTagName('ion-loading')[0];
    if (loadingExist) {
      this.loaderService.loadingDismiss();
    }
    
  }

  get form() { return this.creatViolation.controls; }
  getVoilationTypeData() {


    if (localStorage.getItem('isOnline') === "true") {

      console.log("App is online");
      let payload = {
        "source_id": this.sourceId
      }
      this.moduleService.getVoilationType(payload).subscribe((result: any) => {
        console.log('VoilationType result', result);
          this.voilationType = result.data;
          console.log(this.voilationType);
          console.log(this.voilationType.name_eng);          
      }),
        (error) => {
          console.log(error)
        };

    } else {

      console.log("App is offline")
      this.dbservice.fetchsideTypesList(this.sourceId).subscribe((res) => {
        this.voilationType = res;
        console.log("sqlite data", res);

      }),
        (error) => {
          console.log(error)
        };
    }
  }



  getVoilationTitle(id: any) {

    if (localStorage.getItem('isOnline') === "true") {
      let payload = {
        "side_type":id,
        "term":"T"
      }
      this.moduleService.getVoilationTitle(payload).subscribe((result: any) => {
        this.voilationTitleData = result.data;
        console.log('getVoilationTitle', this.voilationTitleData);

      }),
        (error) => {
          console.log(error)
        };

    } else {
    }

  }
  selectcustomerwithproof(event: any) {
    console.log(event.target.value)
    this.isCustomerwithproof = event.target.value;
    if (this.isCustomerwithproof == 'Yes') {

    }
    else {
      // this.creatViolation.controls['identityDoc'].setValue('');
    }
  }

  getvoilationSearchByField(documentNumber: any) {
    if (this.isCommercial) {
      let paramObj = {
        "licenseNo": documentNumber
      }
      this.moduleService.GetLicenseByLicenseNumber(paramObj).subscribe((res) => {
        console.log(res);
        if (res.ResponseContent && res.ResponseContent.length > 0) {
          this.licenseNumberList = res.ResponseContent;
          this.licenseNumberList.map(
            obj => {
              obj.license_no = obj.LicenseNumber
            }
          );
  
          // Check if the license status is in the allowStatuses array
          this.allowStatus = res.allowStatuses;
          if (this.allowStatus.includes(this.licenseNumberList[0].LicenseStatusEN)) {
            this.license = this.licenseNumberList[0];
            this.licenseExpiryDate = this.licenseNumberList[0].ExpiryDate;
            this.licenseLocation = this.licenseNumberList[0].X + ',' + this.licenseNumberList[0].Y;
            let lInfo = this.licenseNumberList;
            if (lInfo.length > 0) {
              console.log(lInfo);
              let rInfo = lInfo[0].Persons.filter((item: any) => { return item.RoleEN.toLowerCase().indexOf('director') >= 0 });
              this.creatViolation.controls['sideCodeDescription'].setValue(this.setLanguage == 'ar' ? lInfo[0].NameAR : lInfo[0].NameEN);
              if (rInfo.length > 0) {
                this.creatViolation.controls['ownername'].setValue(this.setLanguage == 'ar' ? rInfo[0].NameAR : rInfo[0].NameEN);
                this.creatViolation.controls['ownerphone'].setValue(rInfo[0].PrimaryPhoneNumber ? ((rInfo[0].PrimaryPhoneNumber[0] !== '0' ? '0' : '') + rInfo[0].PrimaryPhoneNumber) : '');
                this.creatViolation.controls['email'].setValue(rInfo[0].Email);
                this.name_ded_eng = lInfo[0].NameEN;
                this.name_ded_ar = lInfo[0].NameAR;
              }
  
              rInfo = lInfo[0].Persons.filter((item: any) => { return item.RoleEN.toLowerCase().indexOf('owner') >= 0 })
              if (rInfo.length > 0) {
                this.creatViolation.controls['ownername'].setValue(this.setLanguage == 'ar' ? rInfo[0].NameAR : rInfo[0].NameEN);
                this.creatViolation.controls['ownerphone'].setValue(rInfo[0].PrimaryPhoneNumber ? ((rInfo[0].PrimaryPhoneNumber[0] !== '0' ? '0' : '') + rInfo[0].PrimaryPhoneNumber) : '');
                this.creatViolation.controls['email'].setValue(rInfo[0].Email);
                this.name_ded_eng = lInfo[0].NameEN;
                this.name_ded_ar = lInfo[0].NameAR;
              }
  
              rInfo = lInfo[0].Persons.filter((item: any) => { return item.RoleEN.toLowerCase().indexOf('partner') >= 0 })
              if (rInfo.length > 0) {
                this.creatViolation.controls['ownername'].setValue(this.setLanguage == 'ar' ? rInfo[0].NameAR : rInfo[0].NameEN);
                this.creatViolation.controls['ownerphone'].setValue(rInfo[0].PrimaryPhoneNumber ? ((rInfo[0].PrimaryPhoneNumber[0] !== '0' ? '0' : '') + rInfo[0].PrimaryPhoneNumber) : '');
                this.creatViolation.controls['email'].setValue(rInfo[0].Email);
                this.name_ded_eng = lInfo[0].NameEN;
                this.name_ded_ar = lInfo[0].NameAR;
              }
  
              rInfo = lInfo[0].Persons.filter((item: any) => { return item.RoleEN.toLowerCase().indexOf('individual') >= 0 })
              if (rInfo.length > 0) {
                this.creatViolation.controls['ownername'].setValue(this.setLanguage == 'ar' ? rInfo[0].NameAR : rInfo[0].NameEN);
                this.creatViolation.controls['ownerphone'].setValue(rInfo[0].PrimaryPhoneNumber ? ((rInfo[0].PrimaryPhoneNumber[0] !== '0' ? '0' : '') + rInfo[0].PrimaryPhoneNumber) : '');
                this.creatViolation.controls['email'].setValue(rInfo[0].Email);
                this.name_ded_eng = lInfo[0].NameEN;
                this.name_ded_ar = lInfo[0].NameAR;
              }
            }
          } else {
            // Show alert if the license status is not in allowStatuses
            this.alertErrorMessage = `The license status "${this.licenseNumberList[0].LicenseStatusEN}" is not allowed.`;
            this.showAlert();
            // this.toastService.showError(`The license status "${this.licenseNumberList[0].LicenseStatusEN}" is not allowed.`, "Alert");
            this.license = {};
          }
          } else {
            this.licenseNumberList = [];
            this.toastService.showError("No license found with the given number.", "Alert");
          }
      }, (error) => {
        console.error(error);
        this.toastService.showError("An error occurred while fetching the license details.", "Error");
      });
    } else {
      let payload = {
        "voilationType": this.svtSelected,
        "term": documentNumber
      }
      this.moduleService.getvoilationSearchByField(payload).subscribe((result: any) => {
        if (result.data.length > 0) {
          this.documentNumbersList = result.data.map(({ document_no }: any) => ({ document_no })).filter((item) => { return item.document_no != '' && item.document_no != 'null' && item.document_no != null });
          this.documentNumbersList = this.documentNumbersList.filter((v, i) => this.documentNumbersList.findIndex(item => item.document_no == v.document_no) === i);
          this.licenseNumberList = result.data.map(({ license_no }: any) => ({ license_no })).filter((item) => { return item.license_no != '' && item.license_no != 'null' && item.license_no != null });
          this.licenseNumberList = this.licenseNumberList.filter((v, i) => this.licenseNumberList.findIndex(item => item.license_no == v.license_no) === i);
          this.plateCodeList = result.data.map(({ license_plate_no }: any) => ({ license_plate_no })).filter((item) => { return item.license_plate_no != '' && item.license_plate_no != 'null' && item.license_plate_no != null });
          this.plateCodeList = this.plateCodeList.filter((v, i) => this.plateCodeList.findIndex(item => item.license_plate_no == v.license_plate_no) === i);
        } else {
          // this.toastService.showError("No data found for the given search term.", "Alert");
          console.log("No data found for the given search term");
        }
      }, (error) => {
        console.error(error);
        this.toastService.showError("An error occurred while searching for violation data.", "Error");
      });
    }
  }

  getSideCodeData() {
    let payload = {
      "term": "T"
    }
    this.moduleService.getSideCode(payload).subscribe((result: any) => {
      console.log('getSideCode', result);
      this.sideCode = result.data;

      this.sideCode = this.sideCode.map(({ side_code_id, side_code_no, description, description_eng, side_type_code, car_no, car_sid, class_pad_new,
        class_pad, calar_pad, license_no, document_type, document_no }: any) => ({
          side_code_id, side_code_no, description, description_eng, side_type_code, car_no, car_sid,
          class_pad_new, class_pad, calar_pad, license_no, document_type, document_no
        }));
      this.sideCode = this.sideCode.filter((value: any, index: any, a: any) => a.findIndex((t: any) => (t.side_code_id === value.side_code_id)) === index);

      if (this.sideCode.length === 0) {
        this.sideCodeComponent.canClear = false;
      }
      else {
        this.sideCodeComponent.canClear = true;
      }
    }),
      (error) => {
        console.log(error)
      };
  }

  async svtypeValue(event) {
    this.documentNumber = "";
    this.licenseNumber = "";
    this.platecodeNumber = "";
    this.creatViolation.controls['voilationTitle'].reset();
    this.creatViolation.controls['sideCode'].reset();
    this.fineCodeComponent.clear();
    this.finecode={};
    this.creatViolation.controls['fineAmount'].setValue('');
    Object.keys(this.creatViolation.controls).forEach(key => {
      if (key !== "voilationType") {
        this.creatViolation.controls[key].reset();
      }
    });
    this.creatViolation.controls['finecodecount'].setValue('1');

    console.log('svtSelected', event.target.value);
    this.svtSelected = event.target.value;
    this.abercheckbox = false;
    this.getViolationCategoryData(this.svtSelected);
    await this.getPlateSourceData();
    this.applyValidatorsBasedOnSvyt(this.svtSelected);
    this.getVoilationTitle(this.svtSelected);
  }

  applyValidatorsBasedOnSvyt(type: any){
        if (this.svtSelected == 3) {

      this.isVehicle = true;
      this.isCommercial = false;
      this.isIndividual = false;
      this.ownerPhoneRequired = true;
      this.creatViolation.controls['plateNo'].setValidators([Validators.required]);
      this.creatViolation.controls['plateNo'].updateValueAndValidity();
      this.creatViolation.controls['plateSource'].setValidators([Validators.required]);
      this.creatViolation.controls['plateSource'].updateValueAndValidity();
      this.creatViolation.controls['plateCategory'].setValidators([Validators.required]);
      this.creatViolation.controls['plateCategory'].updateValueAndValidity();
      this.creatViolation.controls['plateCode'].setValidators([Validators.required]);
      this.creatViolation.controls['plateCode'].updateValueAndValidity();
      this.creatViolation.controls['reservedCode'].setValidators([Validators.required]); //reservedIdNumber
      this.creatViolation.controls['reservedCode'].updateValueAndValidity();
      this.creatViolation.controls['reservedIdNumber'].setValidators([Validators.required]);
      this.creatViolation.controls['reservedIdNumber'].updateValueAndValidity();
      // recipientMobile: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]]
      this.creatViolation.controls['recipientMobile'].setValidators([Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]);
      this.creatViolation.controls['recipientMobile'].updateValueAndValidity();
      // this.creatViolation.controls['ownername'].setValidators([Validators.required]);
      // this.creatViolation.controls['ownername'].updateValueAndValidity();
    this.creatViolation.controls['ownerphone'].setValidators([Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]);
      this.creatViolation.controls['ownerphone'].updateValueAndValidity();
      this.creatViolation.controls['ownerdescription'].setValidators([]);
      this.creatViolation.controls['ownerdescription'].updateValueAndValidity();
      this.creatViolation.controls['documentType'].setValidators([]);
      this.creatViolation.controls['documentType'].updateValueAndValidity();
      this.creatViolation.controls['documentNo'].setValidators([]);
      this.creatViolation.controls['documentNo'].updateValueAndValidity();
      this.creatViolation.controls['licenseNo'].setValidators([]);
      this.creatViolation.controls['licenseNo'].updateValueAndValidity();
      // this.creatViolation.controls['sideCodeDescription'].setValidators([]);
      this.creatViolation.controls['other_plate_source'].setValidators([]);
      this.creatViolation.controls['other_plate_source'].updateValueAndValidity();
      this.creatViolation.controls['sideCodeDescription'].setValidators([Validators.required]);   
      this.creatViolation.controls['reservationSites'].setValidators([]);
      this.creatViolation.controls['reservationSites'].updateValueAndValidity();
      this.creatViolation.controls['reservationSiteAreas'].setValidators([]);
      this.creatViolation.controls['reservationSiteAreas'].updateValueAndValidity();
      this.getReservationSites();
    }
    else if (this.svtSelected == 4) {
      this.isVehicle = true;
      this.isCommercial = false;
      this.isIndividual = false;
      this.ownerPhoneRequired = true;
      this.creatViolation.controls['plateNo'].setValidators([Validators.required]);
      this.creatViolation.controls['plateNo'].updateValueAndValidity();
      this.creatViolation.controls['plateSource'].setValidators([Validators.required]);
      this.creatViolation.controls['plateSource'].updateValueAndValidity();
      this.creatViolation.controls['plateCategory'].setValidators([Validators.required]);
      this.creatViolation.controls['plateCategory'].updateValueAndValidity();
      this.creatViolation.controls['plateCode'].setValidators([Validators.required]);
      this.creatViolation.controls['plateCode'].updateValueAndValidity();
      this.creatViolation.controls['reservedCode'].setValidators([Validators.required]); //reservedIdNumber
      this.creatViolation.controls['reservedCode'].updateValueAndValidity();
      this.creatViolation.controls['reservedIdNumber'].setValidators([Validators.required]);
      this.creatViolation.controls['reservedIdNumber'].updateValueAndValidity();
      this.creatViolation.controls['recipientMobile'].setValidators([Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]);
      this.creatViolation.controls['recipientMobile'].updateValueAndValidity();
      this.creatViolation.controls['ownerphone'].setValidators([Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]);
      this.creatViolation.controls['ownerphone'].updateValueAndValidity();
      this.creatViolation.controls['ownerdescription'].setValidators([]);
      this.creatViolation.controls['ownerdescription'].updateValueAndValidity();
      this.creatViolation.controls['documentType'].setValidators([]);
      this.creatViolation.controls['documentType'].updateValueAndValidity();
      this.creatViolation.controls['documentNo'].setValidators([]);
      this.creatViolation.controls['documentNo'].updateValueAndValidity();
      this.creatViolation.controls['licenseNo'].setValidators([]);
      this.creatViolation.controls['licenseNo'].updateValueAndValidity();
      this.creatViolation.controls['other_plate_source'].setValidators([]);
      this.creatViolation.controls['other_plate_source'].updateValueAndValidity();
      this.creatViolation.controls['reservationSites'].setValidators([]);
      this.creatViolation.controls['reservationSites'].updateValueAndValidity();
      this.creatViolation.controls['reservationSiteAreas'].setValidators([]);
      this.creatViolation.controls['reservationSiteAreas'].updateValueAndValidity();
      this.violCategoryList = this.violCategoryListAll;
      this.getReservationSites();
    }
    else if (this.svtSelected == 2) {

      this.ownerPhoneRequired = true;
      this.isCommercial = true;
      this.isVehicle = false;
      this.isIndividual = false;
      this.plateSourceList = this.plateSourceList.filter(
        (item: any) => item.show_commercial === "1"
      );
   
      this.creatViolation.controls['licenseNo'].setValidators([Validators.required]);
      this.creatViolation.controls['licenseNo'].updateValueAndValidity();
      this.creatViolation.controls['recipientPerson'].setValidators([]);
      this.creatViolation.controls['recipientPerson'].updateValueAndValidity();
      this.creatViolation.controls['reservedCode'].setValidators([Validators.required]); //reservedIdNumber
      this.creatViolation.controls['reservedCode'].updateValueAndValidity();
      this.creatViolation.controls['reservedIdNumber'].setValidators([]);
      this.creatViolation.controls['reservedIdNumber'].updateValueAndValidity();
      this.creatViolation.controls['recipientMobile'].setValidators([]);
      this.creatViolation.controls['recipientMobile'].updateValueAndValidity();
      this.creatViolation.controls['ownerphone'].setValidators([Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]);
      this.creatViolation.controls['ownerphone'].updateValueAndValidity();
      this.creatViolation.controls['animalhitCount'].setValidators([]);
      this.creatViolation.controls['animalhitCount'].updateValueAndValidity();
      this.creatViolation.controls['ownerdescription'].setValidators([]);
      this.creatViolation.controls['ownerdescription'].updateValueAndValidity();
      this.creatViolation.controls['documentType'].setValidators([]);
      this.creatViolation.controls['documentType'].updateValueAndValidity();
      this.creatViolation.controls['documentNo'].setValidators([]);
      this.creatViolation.controls['documentNo'].updateValueAndValidity();
      this.creatViolation.controls['plateNo'].setValidators([]);
      this.creatViolation.controls['plateNo'].updateValueAndValidity();
      this.creatViolation.controls['plateSource'].setValidators([Validators.required]);
      this.creatViolation.controls['plateSource'].updateValueAndValidity();
      this.creatViolation.controls['plateCategory'].setValidators([]);
      this.creatViolation.controls['plateCategory'].updateValueAndValidity();
      this.creatViolation.controls['plateCode'].setValidators([]);
      this.creatViolation.controls['plateCode'].updateValueAndValidity();
      this.creatViolation.controls['other_plate_source'].setValidators([]);
      this.creatViolation.controls['other_plate_source'].updateValueAndValidity();
      this.creatViolation.controls['sideCodeDescription'].setValidators([Validators.required]);
      this.creatViolation.controls['reservationSites'].setValidators([]);
      this.creatViolation.controls['reservationSites'].updateValueAndValidity();
      this.creatViolation.controls['reservationSiteAreas'].setValidators([]);
      this.creatViolation.controls['reservationSiteAreas'].updateValueAndValidity();    
      this.getReservationSites();
    }
    else {
      this.isIndividual = true;
      this.isVehicle = false;
      this.isCommercial = false;
      this.ownerPhoneRequired = false;
      this.creatViolation.controls['documentType'].setValidators([Validators.required]);
      this.creatViolation.controls['documentType'].updateValueAndValidity();
      this.creatViolation.controls['documentNo'].setValidators([Validators.required]);
      this.creatViolation.controls['documentNo'].updateValueAndValidity();
      this.creatViolation.controls['plateNo'].setValidators([]);
      this.creatViolation.controls['plateNo'].updateValueAndValidity();
      this.creatViolation.controls['plateSource'].setValidators([]);
      this.creatViolation.controls['plateSource'].updateValueAndValidity();
      this.creatViolation.controls['plateCategory'].setValidators([]);
      this.creatViolation.controls['plateCategory'].updateValueAndValidity();
      this.creatViolation.controls['plateCode'].setValidators([]);
      this.creatViolation.controls['plateCode'].updateValueAndValidity();
      this.creatViolation.controls['licenseNo'].setValidators([]);
      this.creatViolation.controls['licenseNo'].updateValueAndValidity();
      this.creatViolation.controls['animalhitCount'].setValidators([]);
      this.creatViolation.controls['animalhitCount'].updateValueAndValidity();
      this.creatViolation.controls['recipientMobile'].setValidators([Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]);
      this.creatViolation.controls['recipientMobile'].updateValueAndValidity();
      this.creatViolation.controls["reservedCode"].setValidators([]);
      this.creatViolation.controls['reservedCode'].updateValueAndValidity();
      this.creatViolation.controls['reservedIdNumber'].setValidators([]);
      this.creatViolation.controls['reservedIdNumber'].updateValueAndValidity();
      this.creatViolation.controls['ownername'].setValidators([]);
      this.creatViolation.controls['ownername'].updateValueAndValidity();
      this.creatViolation.controls['ownerphone'].setValidators([]);
      this.creatViolation.controls['ownerphone'].updateValueAndValidity();
      this.creatViolation.controls['ownerdescription'].setValidators([]);
      this.creatViolation.controls['ownerdescription'].updateValueAndValidity();
      this.creatViolation.controls['other_plate_source'].setValidators([]);
      this.creatViolation.controls['other_plate_source'].updateValueAndValidity();
      this.creatViolation.controls['reservationSites'].setValidators([]);
      this.creatViolation.controls['reservationSites'].updateValueAndValidity();
      this.creatViolation.controls['reservationSiteAreas'].setValidators([]);
      this.creatViolation.controls['reservationSiteAreas'].updateValueAndValidity();
    }
  }

  sideCodeValueData(idval) {
    console.log('selected idval', idval);
    let obj = {
      "sidecodeid":idval,
    }
    console.log(obj);
    this.moduleService.searchSideCode(obj).subscribe((data: any) => {
      console.log("dataaaaaaaaaaaaaaaaaa",data);
      this.sideCode = data.data;
      console.log("this.sideCode",this.sideCode);
      this.sideCode = this.sideCode.map(({ side_code_id, side_code_no, description, description_eng, side_type_code, car_no, car_sid, class_pad_new,
        class_pad, calar_pad, license_no, document_type, document_no, email, reserved_code, reserved_number }: any) => ({
          side_code_id, side_code_no, description, description_eng, side_type_code, car_no, car_sid,
          class_pad_new, class_pad, calar_pad, license_no, document_type, document_no, email, reserved_code, reserved_number
        }));
      this.sideCode = this.sideCode.filter((value: any, index: any, a: any) => a.findIndex((t: any) => (t.side_code_id === value.side_code_id)) === index);

      if (data.data) {
        data = data.data[0];
        if (data.document_type != "" && data.document_type != null) {
          this.selectedSourceValDocument = parseInt(data.document_type);
          console.log("selectedSourceValDocument----====", this.selectedSourceValDocument);
          this.creatViolation.controls['documentNo'].setValue({ 'document_no': data.document_no });
          this.documentNumber = data.document_no;

        }
        else {
          this.document = '';
          this.documentNumber = '';
        }

        this.creatViolation.controls['sideCodeDescription'].setValue(data.description);


        if (data.license_no != "" && data.license_no != null) {
          // this.creatViolation.controls['licenseNo'].setValue(data.license_no);
          this.creatViolation.controls['licenseNo'].setValue({ 'license_no': data.license_no });
          // this.creatViolation.controls['licenseNo'].setValue({ 'license_no': '2410' });
          this.licenseNumber = data.license_no;
        }
        else {
          this.licenseNumber = "";
          this.license = "";
        }


        this.creatViolation.controls['recipientPerson'].setValue(data.recipient_person);
        this.creatViolation.controls['recipientMobile'].setValue(data.recipient_mobile.replace(/^\s+/g, ''));
        this.creatViolation.controls['email'].setValue(data.email.replace(/^\s+/g, ''));
        //this.creatViolation.controls['reservedCode'].setValue(data.reserved_code);
        if (data.reserved_code != "" && data.reserved_code != null) {
          this.reservedCode = parseInt(data.reserved_code);//this.reservedCodeList.filter((item:any)=>{return String(item.reserved_code) === data.reserved_code})?[0].reserved_code;
        }
        //this.creatViolation.get('reservedCode').setValue(data.reserved_code);

        this.creatViolation.controls['reservedIdNumber'].setValue(data.reserved_number);


        // this.getSideCodeWiseDataList(data.side_code_no);
        // if (data.length > 0) {
        // this.creatViolation.controls['plateNo'].setValue(data.car_no);
        if (data.car_no != "" && data.car_no != null) {
          this.creatViolation.controls['plateNo'].setValue({ 'license_plate_no': data.car_no });
          this.platecodeNumber = data.car_no;
          this.creatViolation.controls['plateSource'].setValue(data.car_sid);
          // eslint-disable-next-line radix
          this.selectedSourceVal = parseInt(data.car_sid);

          console.log(this.selectedSourceVal);
          console.log("plateCodeDataList", this.plateCodeDataList)

          if (localStorage.getItem('isOnline') === "true") {
            let payload = {
              "source_id": this.sourceId,
              "plate_category": this.plateCategoryid,
              "plate_source": this.selectedPlateSource
            }
            this.moduleService.getPlateCode(payload).pipe(finalize(() => {
              this.creatViolation.controls['plateCode'].setValue(data.class_pad_new);
              this.selectedPlateCode = data.class_pad_new;
            })).subscribe((result: any) => {
              console.log('getPlateCode', result);
              this.plateCodeDataList = result.data;
              if (this.plateCodeDataList.length > 0) {
                this.plateCodeDataList = this.plateCodeDataList.filter((item: any) => {
                  return item.source_code === String(this.selectedSourceVal);
                })
              }
            }),
              (error) => {
                console.log(error)
              };
          }
          else {
            console.log("App is offline")
            this.dbservice.fetchPlateCodes(this.plateCategoryid).pipe(finalize(() => {
              this.creatViolation.controls['plateCode'].setValue(data.class_pad_new);
              this.selectedPlateCode = data.class_pad_new;
            })).subscribe((res) => {
              this.plateCodeDataList = res;
              if (this.plateCodeDataList.length > 0) {
                this.plateCodeDataList = this.plateCodeDataList.filter((item: any) => {
                  return item.source_code === String(this.selectedSourceVal);
                })
              }
              console.log('getPlateCode', res);
            }),
              (error) => {
                console.log(error)
              };
          }



          console.log('selectedPlateCode', this.selectedSourceVal);
          this.creatViolation.controls['plateColor'].setValue(data.calar_pad);
          // this.selectedPlateColor = data.calar_pad;
          // console.log('selectedPlateColor', this.selectedPlateColor);
          this.creatViolation.controls['oldCode'].setValue(data.class_pad);
          this.selectedOldCode = data.class_pad;
          console.log('selectedOldCode', this.selectedOldCode);
        }
        else {
          this.creatViolation.controls['plateNo'].setValue([]);
          this.creatViolation.controls['plateSource'].setValue([]);
          this.creatViolation.controls['plateCategory'].setValue([]);
          this.creatViolation.controls['plateCode'].setValue([]);
          this.platecodeNumber = "";
          this.selectedSourceVal = "";
          this.selectedPlateCode = "";
          this.selectedOldCode = "";
        }
        // }
        this.upDatedSideCodeID = data.side_code_id;

        let objData = {
          voilationType: this.svtSelected,
          documentType: data.document_type,
          documentNo: data.document_no,
          licenseNo: data.license_no,
          // licenseNo: '2410',
          plateNo: data.cra_no,
          plateSource: data.car_sid,
          plateCode: data.class_pad_new
        }
        // this.moduleService.getViolationexistsin3days(objData).subscribe((result: any) => {

        //   if (result.statusCode == 409 || result.status === 409) {
        //     this.toastService.showError('Violation can not be created within 3 days.', 'Alert');
        //   }

        // })
      }
      else {
        this.creatViolation.controls['plateNo'].setValue('');
        this.creatViolation.controls['plateSource'].setValue('');
        this.creatViolation.controls['plateCategory'].setValue('');
        // eslint-disable-next-line radix
        this.selectedSourceVal = parseInt('');
        this.creatViolation.controls['plateCode'].setValue('');
        this.selectedPlateCode = '';
        this.creatViolation.controls['plateColor'].setValue('');
        this.creatViolation.controls['oldCode'].setValue('');
        this.selectedOldCode = '';
        this.upDatedSideCodeID = null;
      }

      this.cRef.detectChanges();
    }),
      (error) => {
        console.log(error)
      }

    // }
    console.log('upDatedSideCodeID', this.upDatedSideCodeID);

  }


getPlateSourceData(): Promise<any> {
  return new Promise((resolve, reject) => {
    if (localStorage.getItem('isOnline') === "true") {
      let payload = {
        "source_id": this.sourceId
      };

      this.moduleService.getPlateSource(payload).subscribe({
        next: (result: any) => {
          this.plateSourceList = result.data;
          console.log('PlateSource', this.plateSourceList);
          if(this.svtSelected == 2) {this.setDefaultEmirate(this.plateSourceList); this.selectedPlateSourceCode = 4}
          
          resolve(this.plateSourceList); // ✅ return data
        },
        error: (err) => {
          console.log(err);
          reject(err);
        }
      });
    } else {
      console.log("App is offline");
      this.dbservice.fetchPlateSources().subscribe({
        next: (res) => {
          this.plateSourceList = res;
          console.log('PlateSource (offline)', this.plateSourceList);
          resolve(this.plateSourceList); // ✅ return data
        },
        error: (err) => {
          console.log(err);
          reject(err);
        }
      });
    }
  });
}

private setDefaultEmirate(list: any[]) {
  const defaultEmirate = list.find((item: any) => item.is_default_show === "1");
  if (defaultEmirate) {
    this.form['plateSource'].setValue(defaultEmirate);
    this.selectedSourceVal = defaultEmirate;
  } else if (list.length > 0) {
    // fallback if no default flag found
    this.form['plateSource'].setValue(list[0]);
    this.selectedSourceVal = list[0];
  }
}


   getSourceValue(event: any){
    this.creatViolation.controls['plateCategory'].setValue('');
    const selectedOption = event.detail.value;
    this.carsId = selectedOption.car_sid;
    console.log(selectedOption);
    console.log(this.carsId);
    if(this.sourceId == 1){
      this.selectedPlateSource = event.detail.value.car_sid;
      this.selectedPlateSourceCode = event.detail.value.aber_code;
      this.creatViolation.value['plateSource'] =  this.selectedPlateSourceCode;
    }
    else{
      this.selectedPlateSource = event.detail.value.car_sid;
      this.selectedPlateSourceCode = event.detail.value.raqab_code;
      if(this.svtSelected == 2){
        this.creatViolation.value['plateSource'] =  this.selectedPlateSource;
      }
      else{
        this.creatViolation.value['plateSource'] =  this.selectedPlateSourceCode;
      }
    }
    
    console.log("this.selectedPlateSource = event.target.value;",this.selectedPlateSource);
    if (this.selectedPlateSourceCode != '0') {
      this.isPlateSourceselectedOther = false;
      this.creatViolation.controls['other_plate_source'].setValue('');
      this.creatViolation.controls['other_plate_source'].setValidators([]);
      this.creatViolation.controls['other_plate_source'].updateValueAndValidity();

      if(this.svtSelected == 3){
      this.creatViolation.controls['plateCode'].setValidators([Validators.required]);
      this.creatViolation.controls['plateCode'].updateValueAndValidity();
      this.creatViolation.controls['plateCategory'].setValidators([Validators.required]);
      this.creatViolation.controls['plateCategory'].updateValueAndValidity();
       this.getPlateCategoryData();
      }
    }
    else {
      console.log("othersssssssssss");
      this.isPlateSourceselectedOther = true;
      this.creatViolation.controls['plateCode'].setValue('');
      this.creatViolation.controls['plateCode'].setValidators([]);
      this.creatViolation.controls['plateCode'].updateValueAndValidity();
      this.creatViolation.controls['plateCategory'].setValue('');
      this.creatViolation.controls['plateCategory'].setValidators([]);
      this.creatViolation.controls['plateCategory'].updateValueAndValidity();
      this.creatViolation.controls['other_plate_source'].setValidators([Validators.required]);
      this.creatViolation.controls['other_plate_source'].updateValueAndValidity();
    }
    
  }

  getPlateCategoryData(){
    if (localStorage.getItem('isOnline') === "true") {
      let payload = {
        "source_id": this.sourceId,
        "plate_source_id":this.selectedPlateSource
      }
      this.moduleService.getPlateCategory(payload).subscribe((result: any) => {

        this.plateCategoryData = result.data;
        console.log('PlateCategory', this.plateCategoryData);
      }),
        (error) => {
          console.log(error)
        };
    }
    else {
      console.log("App is offline")
      this.dbservice.fetchPlateCategory(this.carsId).subscribe((res: any) => {
        console.log(res);
        this.plateCategoryData = res;
        console.log('plateCategoryData', this.plateCategoryData);
      });
    }


  }
  platecategoryId(event: any){
  this.creatViolation.controls['plateCode'].setValue('');
  const selectedOption = event.detail.value;
  // console.log("event",event.detail.value);
  // this.selectedplatecategoryId = event.detail.value.id;
  // console.log(this.selectedplatecategoryId,"id")
  // this.plateCategoryid = event.detail.value.aber_code
  // console.log(this.plateCategoryid)
  // localStorage.setItem('plateCategory', this.plateCategoryid);
  // this.creatViolation.value.plateCategory=this.plateCategoryid;
  // console.log(this.creatViolation.value);
  // console.log(this.creatViolation.value.plateCategory);
  // localStorage.setItem('plateCategory', this.plateCategoryid);
  // if(this.sourceId == 1){
  //   this.creatViolation.controls['plateCategory'].setValue(selectedOption.aber_code);
  //   // this.creatViolation.value.plateCategory = selectedOption.aber_code;
  //   this.plateCategoryid = event.detail.value.aber_code;
  // }
  // else{
  //   this.creatViolation.controls['plateCategory'].setValue(selectedOption.raqab_code);
  //   // this.creatViolation.value.plateCategory = selectedOption.raqab_code;
  //   this.plateCategoryid = event.detail.value.raqab_code;
  // }
  if(this.sourceId == 1){
    this.plateCategoryid = event.detail.value.aber_code;
    this.creatViolation.value['plateCategory'] =  this.plateCategoryid;
  }
  else{
    this.plateCategoryid = event.detail.value.raqab_code;
    this.creatViolation.value['plateCategory'] =  this.plateCategoryid;
  }
  console.log(" create violation values after selecting plate category:",this.creatViolation.value);
  this.getPlateCodeData2();
  }

  getPlateCodeData2() {

    localStorage.setItem('plateSource', this.selectedPlateSource)
    this.selectedPlateCode = null;
    this.fineCodeComponent.clear();
    this.finecode={};
    this.creatViolation.controls['fineAmount'].setValue('');
    if (localStorage.getItem('isOnline') === "true") {
      let payload = {
        "source_id": this.sourceId,
        "plate_category": this.plateCategoryid,
        "plate_source": this.selectedPlateSourceCode
      }
      console.log("payload of plateCode", payload);
      this.moduleService.getPlateCode(payload).subscribe((result: any) => {
        console.log('getPlateCode', result);
        this.plateCodeDataList = result.data;
        if (this.plateCodeDataList.length > 0) {
          this.plateCodeDataList = this.plateCodeDataList.filter((item: any) => {
            return item.source_code === String(this.selectedPlateSourceCode);
          })
        }
      }),
        (error) => {
          console.log(error)
        };
    }
    else {
      console.log("App is offline")
      this.dbservice.fetchPlateCodes(this.selectedplatecategoryId).subscribe((res) => {
        this.plateCodeDataList = res;
        if (this.plateCodeDataList.length > 0) {
          this.plateCodeDataList = this.plateCodeDataList.filter((item: any) => {
            return item.source_code === String(this.selectedPlateSource);
          })
        }
        console.log('getPlateCode', res);
      }),
        (error) => {
          console.log(error)
        };
    }
  }
  platecodechange(source:any)
  {
    this.fineCodeComponent.clear();
    this.finecode={};
    this.creatViolation.controls['fineAmount'].setValue('');
  }

  getOldCodeData() {
    this.moduleService.getOldCode().subscribe((result: any) => {
      console.log('getOldCode', result);
      this.oldCodeDataList = result.data;
    });
  }
   getViolationCategoryData(id: any) {
    if (localStorage.getItem('isOnline') === "true") {

      console.log('selected vTypeId', id);
     let payload = {
        "side_type": id,
        "source_id":this.sourceId,
        "user_type":this.user_type
      }
       this.moduleService.getViolationCategory(payload).subscribe((result: any) => {
        console.log('ViolationCategoryData', result);
        this.violCategoryList = result.data;
        this.violCategoryListAll = result.data;
      },
        (error) => {
          console.log(error)
        }
      );

    } else {

      console.log("App is offline")
      this.dbservice.fetchFineCategoriesList().subscribe((res) => {
        this.violCategoryList = res;//.filter((item: any) => { return item.side_type == id });
        this.violCategoryListAll = res;
        console.log("ViolationCategoryData", this.violCategoryList);
      },
        (error) => {
          console.log(error)
        }
      );

    }

  }

  isAber(event: any) {
    //console.log(event);
    this.creatViolation.controls['violationCategory'].setValue('');
    if (event.target.checked) {
      this.violCategoryList = this.violCategoryListAll.filter((item: any) => {
        return item.fine_category_id != 2
      })
    }
    else {
      this.violCategoryList = this.violCategoryListAll;
    }
  }

  violationCategoryChange(event: any) {
    console.log('event', event.target.value);
    this.creatViolation.controls['fineCode'].reset();
    this.violationCategorySelected = event.target.value.fine_category_id;
    console.log('violationCategorySelected', event.target.value.fine_category_id);
    console.log(event.target.value.create_vehicle_class);
    if(event.target.value.create_vehicle_class == 1){
    this.showVehicleClass = true;
    console.log("aber violation so enable the validation for vehicle class");
    this.creatViolation.controls['vehicle_class_type'].setValidators([Validators.required]);
    this.creatViolation.controls['vehicle_class_type'].updateValueAndValidity();
    }
    else{
      this.showVehicleClass = false;
      this.creatViolation.controls['vehicle_class_type'].setValidators([]);
      this.creatViolation.controls['vehicle_class_type'].updateValueAndValidity();
    }
    console.log("this.showvehicleclass", this.showVehicleClass);
    if (this.violationCategorySelected == 6 ) {
      this.creatViolation.controls['animalhitCount'].setValidators([Validators.required]);
      this.creatViolation.controls['animalhitCount'].updateValueAndValidity();
      this.isAnimalhitCountData = true;
    }
    else {
      this.creatViolation.controls['animalhitCount'].setValidators([]);
      this.creatViolation.controls['animalhitCount'].updateValueAndValidity();
      this.isAnimalhitCountData = false;
    }
    this.getFineCodeData(this.violationCategorySelected);

  }


  getFineCodeData(id: any) {
    // this.fineCodeList = [];
    this.fine_category_id = id;
    if (localStorage.getItem('isOnline') === "true") {

      console.log('fine_category_id', this.fine_category_id);
      let payload = {
        "fine_category_id": this.fine_category_id,
        "module_type":'Violation'
      }
      this.moduleService.getFineCode(payload).subscribe((result: any) => {
        console.log('getFineCodeData', result);
        if(result.data == false){
          this.fineCodeList = []; 
        }
        else{
          this.fineCodeList = result.data;
        }
        console.log("this.fineCodeList", this.fineCodeList);
      }),
        (error) => {
          console.log(error)
        };

    } else {

      console.log("App is offline")
      console.log('fine_category_id', id);
      this.dbservice.fetchFineCategoryCodeList().subscribe((res) => {
        this.fineCodeList = res.filter((item: any) => { return item.fine_category_id == id });
        console.log("fineCodeList", this.fineCodeList);

      }),
        (error) => {
          console.log(error)
        };

    }

  }


  fineCodeChange(event: { component: IonicSelectableComponent, value: any }) {
      this.wImg = '';
      this.vImg = '';
      this.identityDocPhotos = [];
      this.photos = [];
    if (!this.platecodeNumber && !this.documentNumber && !this.licenseNumber) {
      this.clearFineCode();
      this.toastService.showError("Please enter the document/Plate/License Number to select the fine code.", "Alert");
      return;
    }
  
    const fineCodeId = event.value?.fine_code_id;
    if (!fineCodeId) return;
    
    this.finecodeValue = fineCodeId;
    this.warning_required = event.value.warning_required == 1;
    console.log('this.warning_required', this.warning_required);
    let payload = {
      "side_type":this.svtSelected,
      "fine_code":fineCodeId,
      "document_type":this.selectedSourceVal,
      "document_no": this.documentNumber,
      "license_no":this.licenseNumber,
      "license_plate_no":this.platecodeNumber,
      "plate_source":this.carsId,
      "plate_category":this.plateCategoryid,
      "plate_code": this.creatViolation.value['plateCode']
    }
    this.moduleService.checkWarningexistinviolation(payload).pipe(finalize(()=>{
      console.log("check warning exist in violation api call completed");
    })).subscribe((resp: any)=>{
      console.log(resp.data);
      if(resp.data.isSameViolation == 'Yes'){
        this.warning_required = false;
        this.imageBase =  environment.violationImgUrl;
        this.toastService.showInfo(resp.data.msg,'')
      }
      else{
        // this.warning_required = true;
        console.log("not exist before");
      }
    }),
    (error: any)=>{
      console.log("Error", error);
    }
    this.updateWarningSettings(event.value);
  
    if (this.isOnline()) {
      this.getFineAmountData(fineCodeId);
    } else {
      this.setFineAmountOffline(fineCodeId);
    }
  }
  
  private clearFineCode() {
    this.fineCodeComponent.clear();
    this.finecode = {};
    this.creatViolation.controls['fineAmount'].setValue('');
  }
  
  private updateWarningSettings(value: any) {
    if (this.warning_required) {

      this.imageBase = environment.imgUrl
      const warningHours = value.fc_warning_hours;
      const warningHourstitle = value.fc_warning_hours_title;
  
      if (warningHours) {
        this.creatViolation.controls['fc_warning_hours'].setValue(warningHours);
        this.creatViolation.controls['fc_warning_hours_title'].setValue(warningHourstitle);
        this.defaultwarning = true;
        this.creatViolation.controls['warningDuration'].setValidators([]);
      } else {
        this.defaultwarning = false;
      }
      this.creatViolation.controls['warningDuration'].updateValueAndValidity();
    } else {
      this.creatViolation.controls['warningSpecification'].setValidators([]);
      this.creatViolation.controls['warningSpecification'].updateValueAndValidity();
    }
  }
  
  private setFineAmountOffline(fineCodeId: number) {
    const fineData = this.fineCodeList.find((item: any) => item.fine_code_id === fineCodeId);
    if (fineData) {
      this.creatViolation.controls['fineAmount'].setValue(fineData.fine_amount);
    }
    this.creatViolation.controls['finecodecount'].setValidators([]);
    this.creatViolation.controls['finecodecount'].updateValueAndValidity();
    this.finecodecount = false;
  }
  
  private isOnline(): boolean {
    return JSON.parse(localStorage.getItem('isOnline') || 'false');
  }
  





  lessThanOneValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
  
      // Check if the value is less than 1
      if (value !== null && value !== undefined && value < 1) {
        return { 'lessThanOne': true }; // Validation failed
      }
  
      return null; // Validation passed
    };
  }

  getFineAmountData(id: any) {
    console.log('fine Amount Data', id);
    let payload = {
        "fine_code_id": id
    }
    this.moduleService.getFineAmount(payload).subscribe((result: any) => {
      this.fineAmountList = result.data[0];
      this.actual_amount = this.fineAmountList.fine_amount;
      this.creatViolation.controls['fineAmount'].setValue(this.actual_amount)
  
      console.log('getFineAmountData', this.fineAmountList);
  
      if (this.fineAmountList.field_need_count === '0') {
        this.creatViolation.controls['finecodecount'].setValidators([]);
        this.creatViolation.controls['finecodecount'].updateValueAndValidity();
        this.finecodecount = false;
      } else {
        this.creatViolation.controls['finecodecount'].setValidators([Validators.required, this.lessThanOneValidator()]);
        this.creatViolation.controls['finecodecount'].updateValueAndValidity();
        this.finecodecount = true;
      }
  
      this.creatViolation.controls['dailyFines'].setValue(this.fineAmountList.per_day);
    }, (error) => {
      console.log(error)
    });
  }

  getVehicleClassData(){
    this.moduleService.getVehicleClassTypes().subscribe((response: any) => {
      if(response.statusCode == 200 || response.status == 200){
        console.log("response of vehicle class---->", response);
        this.vehicleClassData = response.data;
      }
      else{
        this.toastService.showError("Failed to fetch Vehicle class data", "Error");
      }
    });
  };
  

  getReservedCodeList() {
    if (localStorage.getItem('isOnline') === "true") {
      let payload = {
        "source_id": this.sourceId
      }
      this.moduleService.getReservedCode(payload).subscribe((result: any) => {
        console.log('getReservedCode', result);
        this.reservedCodeList = result.data;
      }),
        (error) => {
          console.log(error)
        };
    }
    else {
      console.log("App is offline")
      this.dbservice.fetchReservedCodes().subscribe((res) => {
        console.log('getReservedCode', res);
        this.reservedCodeList = res;
      }),
        (error) => {
          console.log(error)
        };
    }

  }

  checklocationaccess() {
    this.checkPermission();
  }

  checkPermission() {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
      result => {
        if (result.hasPermission) {
          this.enableGPS();
        } else {
          this.locationAccPermission();
        }
      },
      error => {
        //alert(error);
        //this.toastService.showError(error, 'Alert');
      }
    );
  }

  locationAccPermission() {
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      if (canRequest) {
      } else {
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
          .then(
            () => {
              this.enableGPS();
            },
            error => {
              //alert(error)
              //this.toastService.showError(error, 'Alert');
            }
          );
      }
    });
  }

  enableGPS() {
    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
      () => {
        localStorage.setItem("locationserviceenabled", "true");
        //this.toastService.showSuccess('Location Service Enabled, woohoo!', 'Success');
        this.getAreaData();
      },
      error => {
        localStorage.setItem("locationserviceenabled", "false");
        this.getAreaData();
      }//this.toastService.showError(error, 'Alert')//alert(JSON.stringify(error))
    );
  }
  getAreaData() {

    if (localStorage.getItem('isOnline') === "true") {
      let payload ={
        "source_id":this.sourceId
      }
      this.moduleService.getArea(payload).subscribe((result: any) => {
        console.log('Area', result);
        this.areaList = result.data;
        if (localStorage.getItem('locationserviceenabled') === "false") {
          this.areaList = this.areaList.filter((result: any) => {
            return result.area_code != 1;
          })
        }
        else {
          //this.areaList = [result.data[0],...this.areaList]
        }
      }),
        (error) => {
          console.log(error)
        };

    } else {
      this.dbservice.fetchAreasList().subscribe((res) => {
        console.log('Area', res);
        this.areaList = res;
        if (localStorage.getItem('locationserviceenabled') === "false") {
          this.areaList = this.areaList.filter((result: any) => {
            return result.area_code != 1;
          })
        }
        else {
          // this.areaList = [res[0],...this.areaList]
        }
      }),
        (error) => {
          console.log(error)
        };
    }


  }



  getDocumentTypeData() {

    if (localStorage.getItem('isOnline') === "true") {

      console.log("App is online");
      this.moduleService.getDocumentType().subscribe((result: any) => {
        console.log('getDocumentType', result);
        this.documentList = result.data;
        console.log(this.documentList.name_eng);
        

      }),
        (error) => {
          console.log(error)
        };

    } else {

      console.log("App is offline")
      this.dbservice.fetchDocumentTypesList().subscribe((res) => {
        this.documentList = res;
        console.log("sqlite data", res);

      }),
        (error) => {
          console.log(error)
        };

    }
  }



  getSideCodeWiseDataList(id: any) {
    this.moduleService.getSideCodeWiseData(id).subscribe((result: any) => {
      console.log('getSideCodeWiseData', result);
    }),
      (error) => {
        console.log(error)
      };
  }

  // sideCodeOption(row) {
  //   console.log('row', row);
  // }

  async viewMapModal() {
    console.log(this.setLocation);

    const modal = await this.modalController.create({
      component: ViewmapmodalPage,
      cssClass: 'css-class',
      swipeToClose: true,
      presentingElement: await this.modalController.getTop()

    });
    modal.onDidDismiss().then((data) => {
      // Call the method to do whatever in your home.ts
      console.log('Modal closedd');
      this.Opacity = 1;
    });
    this.Opacity = 0;
    return await modal.present();
  }




  closeModalBt() {
    this.modalController.dismiss();
  }




  onMarkerAdded(marker: Marker) {
    marker.one(GoogleMapsEvent.MARKER_CLICK).then(() => {
      console.log(marker);
    });
  }

 
  identityDocCam() {
    if(this.creatViolation.value['fineCode'] == null || this.creatViolation.value['fineCode'] == ''){
      this.toastService.showError("Please select fine code first", "Error");
      return;
    }
    this.camera.getPicture({
      quality: 50,
      sourceType: this.camera.PictureSourceType.CAMERA,
      encodingType: this.camera.EncodingType.JPEG,
      destinationType: this.camera.DestinationType.DATA_URL,
    }).then((imageData) => {
      let imageBase64 = 'data:image/jpeg;base64,' + imageData;
      let realData = imageData;
      console.log("imageBase64", imageBase64);
      this.compressImage(imageBase64).then((compressedImage: string) => {
        let compressedBlob = this.b64toBlob(compressedImage.split(',')[1], 'image/jpeg');
        console.log(compressedBlob,"compressedBlob")
        const random = Math.floor(Math.random() * (999999 - 100000)) + 100000000000000000;
        const imageFle = random + '.jpg';
        this.identityDocBasePhotos.push(imageBase64);
        console.log("4",this.identityDocBasePhotos);
        let filePath = this.file.externalDataDirectory + imageFle;
        this.offline_docpath = filePath + '/';
        this.loaderService.loadingPresent();
        if (localStorage.getItem('isOnline') === "true") {
          this.offline = false;
          const formData = new FormData();
          formData.append('uploadedImage', compressedBlob, imageFle);
          if(this.warning_required){
            this.moduleService.warningImage(formData).subscribe((resp: any)=>{
              console.log("image resp", resp.data);
              if(resp.statusCode === 200){
                this.loaderService.loadingDismiss();
                console.log("image resp", resp.data);
                this.wImg = resp.data;
                console.log("wImg", this.wImg);
                this.identityDocPhotos.push(this.wImg);
                console.log("typeeeeee",typeof(this.wImg));
                console.log("type",this.creatViolation.value['identityDoc'].type);
                console.log("this.identityDocPhoos",this.identityDocPhotos);
              }
              else{
                this.toastService.showError("Image not upladed successfully", "Error")
                this.loaderService.loadingDismiss();
              }
              
            },
            
            (error: any) => {
              if (error.statusCode == 400 && error.data && error.data.msg) {
                this.toastService.showError(error.data.msg, 'Alert');
                this.loaderService.loadingDismiss();
              } else if (error.status === 401) {
                this.toastService.showError('Unauthorized. Please log in again.', 'Alert');
                this.loaderService.loadingDismiss();
              } else {
                this.toastService.showError('An error occurred. Please try again.', 'Alert');
                this.loaderService.loadingDismiss();
              }
              console.error("Error creating violation:", error);
              this.loaderService.loadingDismiss();
            })
          }
          else{
            this.moduleService.violationImage(formData).subscribe((resp: any)=>{
              console.log("image resp", resp.data);
              if(resp.statusCode === 200){
                this.loaderService.loadingDismiss();
                console.log("image resp", resp.data);
                this.wImg = resp.data;
                console.log("wImg", this.wImg);
                this.identityDocPhotos.push(this.wImg);
                console.log("typeeeeee",typeof(this.wImg));
                console.log("type",this.creatViolation.value['identityDoc'].type);
                console.log("this.identityDocPhoos",this.identityDocPhotos);
              }
              else{
                this.toastService.showError("Image not upladed successfully", "Error")
                this.loaderService.loadingDismiss();
              }
              
            },
            
            (error: any) => {
              if (error.statusCode == 400 && error.data && error.data.msg) {
                this.toastService.showError(error.data.msg, 'Alert');
                this.loaderService.loadingDismiss();
              } else if (error.status === 401) {
                this.toastService.showError('Unauthorized. Please log in again.', 'Alert');
                this.loaderService.loadingDismiss();
              } else {
                this.toastService.showError('An error occurred. Please try again.', 'Alert');
                this.loaderService.loadingDismiss();
              }
              console.error("Error creating violation:", error);
              this.loaderService.loadingDismiss();
            })
          }

        } else {
          this.offline = true;
          let filePath = this.file.externalDataDirectory + "ViolationDocs/";
          console.log(imageBase64);
          console.log("imageFle",imageFle); 
          let contentType = this.getContentType(imageBase64);
          console.log("contentType",contentType);
          this.file.checkDir(this.file.externalDataDirectory, 'ViolationDocs').then(() => {
            console.log('Directory exists:', filePath);
          }).catch(() => {
            console.log('Directory does not exist. Creating...');
            this.file.createDir(this.file.externalDataDirectory, 'ViolationDocs', false).then((directoryEntry) => {
              console.log('Directory created:', directoryEntry);
            }).catch((err) => {
              console.log('Error creating directory:', err);
            });
          });
          let fileName = imageFle; 
          this.file.writeFile(filePath, fileName, compressedBlob, { replace: true }).then((success) => {
            this.loaderService.loadingDismiss();
            console.log("File Written Successfully", success);
            this.identityDocPhotos.push(imageFle);
          }).catch((err) => {
            this.loaderService.loadingDismiss();
            console.log("Error Occurred While Writing File", err);
          });
        }
      }).catch((error) => {
        console.error("Error compressing image:", error);
        this.toastService.showError("Error compressing image. Please try again.", "Error");
      });
    },
    (err) => {
      // Handle camera error
      console.error("Camera error:", err);
      this.toastService.showError("Error accessing camera. Please try again.", "Error");
    });        
  }

  identityDocGallery() {
    if(this.creatViolation.value['fineCode'] == null || this.creatViolation.value['fineCode'] == ''){
      this.toastService.showError("Please select fine code first", "Error");
      return;
    }
    this.camera.getPicture({
      quality: 50,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      encodingType: this.camera.EncodingType.JPEG,
      destinationType: this.camera.DestinationType.DATA_URL,
    }).then((imageData) => {
      let imageBase64 = 'data:image/jpeg;base64,' + imageData;
      let realData = imageData;
      this.compressImage(imageBase64).then((compressedImage: string) => {
        let compressedBlob = this.b64toBlob(compressedImage.split(',')[1], 'image/jpeg');
        console.log(compressedBlob,"compressedBlob")
      // let blob = this.b64toBlob(realData, 'image/jpeg');
      const random = Math.floor(Math.random() * (999999 - 100000)) + 100000000000000000;
      const imageFle = random + '.jpg';
      // this.identityDocPhotos = imageFle
      this.identityDocBasePhotos.push(imageBase64);
      let filePath = this.file.externalDataDirectory + imageFle;
      this.offline_docpath = filePath + '/';
      this.loaderService.loadingPresent()
      if (localStorage.getItem('isOnline') === "true") {
        this.offline = false;
        const formData = new FormData();
        formData.append('uploadedImage', compressedBlob, imageFle);
        if(this.warning_required){
          this.moduleService.warningImage(formData).subscribe((resp: any)=>{
            console.log("image resp", resp.data);
            if(resp.statusCode === 200){
              this.loaderService.loadingDismiss();
              console.log("image resp", resp.data);
              this.wImg = resp.data;
              console.log("wImg", this.wImg);
              this.identityDocPhotos.push(this.wImg);
              console.log("typeeeeee",typeof(this.wImg));
              console.log("type",this.creatViolation.value['identityDoc'].type);
              console.log("this.identityDocPhoos",this.identityDocPhotos);
            }
            else{
              this.toastService.showError("Image not upladed successfully", "Error")
              this.loaderService.loadingDismiss();
            }
            
          }, (error: any) => {
            if (error.statusCode == 400 && error.data && error.data.msg) {
              this.toastService.showError(error.data.msg, 'Alert');
              this.loaderService.loadingDismiss();
            } else if (error.status === 401) {
              this.toastService.showError('Unauthorized. Please log in again.', 'Alert');
              this.loaderService.loadingDismiss();
            } else {
              this.toastService.showError('An error occurred. Please try again.', 'Alert');
              this.loaderService.loadingDismiss();
            }
            console.error("Error creating violation:", error);
            this.loaderService.loadingDismiss();
          })
        }
        else{
          this.moduleService.violationImage(formData).subscribe((resp: any)=>{
            console.log("image resp", resp.data);
            if(resp.statusCode === 200){
              this.loaderService.loadingDismiss();
              console.log("image resp", resp.data);
              this.wImg = resp.data;
              console.log("wImg", this.wImg);
              this.identityDocPhotos.push(this.wImg);
              console.log("typeeeeee",typeof(this.wImg));
              console.log("type",this.creatViolation.value['identityDoc'].type);
              console.log("this.identityDocPhoos",this.identityDocPhotos);
            }
            else{
              this.toastService.showError("Image not upladed successfully", "Error")
              this.loaderService.loadingDismiss();
            }
            
          }, (error: any) => {
            if (error.statusCode == 400 && error.data && error.data.msg) {
              this.toastService.showError(error.data.msg, 'Alert');
              this.loaderService.loadingDismiss();
            } else if (error.status === 401) {
              this.toastService.showError('Unauthorized. Please log in again.', 'Alert');
              this.loaderService.loadingDismiss();
            } else {
              this.toastService.showError('An error occurred. Please try again.', 'Alert');
              this.loaderService.loadingDismiss();
            }
            console.error("Error creating violation:", error);
            this.loaderService.loadingDismiss();
          })
        }
      } else {
        this.offline = true;
        let filePath = this.file.externalDataDirectory + "ViolationDocs/";
        console.log(imageBase64);
        console.log("imageFle",imageFle); 
        let contentType = this.getContentType(imageBase64);
        console.log("contentType",contentType);
        this.file.checkDir(this.file.externalDataDirectory, 'ViolationDocs').then(() => {
          console.log('Directory exists:', filePath);
        }).catch(() => {
          console.log('Directory does not exist. Creating...');
          this.file.createDir(this.file.externalDataDirectory, 'ViolationDocs', false).then((directoryEntry) => {
            console.log('Directory created:', directoryEntry);
          }).catch((err) => {
            console.log('Error creating directory:', err);
          });
        });
        let fileName = imageFle; 
        this.file.writeFile(filePath, fileName, compressedBlob, { replace: true }).then((success) => {
          this.loaderService.loadingDismiss();
          console.log("File Written Successfully", success);
          this.identityDocPhotos.push(imageFle);
        }).catch((err) => {
          this.loaderService.loadingDismiss();
          console.log("Error Occurred While Writing File", err);
        });

      }
    }).catch((error) => {
      console.error("Error compressing image:", error);
      this.toastService.showError("Error compressing image. Please try again.", "Error");
    });

    }, (err) => {
      // Handle error
      console.error("Camera error:", err);
      this.toastService.showError("Error accessing camera. Please try again.", "Error");
    });         
  }

  getCemara() {
    if(this.creatViolation.value['fineCode'] == null || this.creatViolation.value['fineCode'] == ''){
      this.toastService.showError("Please select fine code first", "Error");
      return;
    }
    this.camera.getPicture({
      quality: 50,
      sourceType: this.camera.PictureSourceType.CAMERA,
      encodingType: this.camera.EncodingType.JPEG,
      destinationType: this.camera.DestinationType.DATA_URL,
    }).then((imageData) => {
      let imageBase64 = 'data:image/jpeg;base64,' + imageData;
      let realData = imageData;
      this.compressImage(imageBase64).then((compressedImage: string) => {
        let compressedBlob = this.b64toBlob(compressedImage.split(',')[1], 'image/jpeg');
        console.log(compressedBlob,"compressedBlob")
      // let blob = this.b64toBlob(realData, 'image/jpeg');
      const random = Math.floor(Math.random() * (999999 - 100000)) + 100000000000000000;
      const imageFle = random + '.jpg';
      let filePath = this.file.externalDataDirectory + imageFle;
      this.basePhotos.push(imageBase64)
      console.log("filePath",filePath);
      this.offline_docpath = filePath + '/';
      this.loaderService.loadingPresent();
      if (localStorage.getItem('isOnline') === "true") {
        this.offline = false;
        const formData = new FormData();
        formData.append('uploadedImage', compressedBlob, imageFle);
        let payload = {
          "uploadPath" : "violation",
          "uploadImage": compressedBlob,
        }
        console.log("payload",payload);
        if(this.warning_required){
          this.moduleService.warningImage(formData).subscribe((resp: any)=>{
            console.log("image resp", resp.data);
            if(resp.statusCode === 200){
              this.loaderService.loadingDismiss();
              console.log("image resp", resp.data);
              this.vImg = resp.data;
              console.log("this.vImg", this.vImg);
           if (this.photos.length <= 4) {
            this.photos.push(this.vImg);
            console.log('Photos Push', this.photos);
            this.camDisabled = false;
          }
          else {
            this.camDisabled = true;
          }
          }
          else{
            this.loaderService.loadingDismiss();
          }
            
          },
          (error: any) => {
            if (error.statusCode == 400 && error.data && error.data.msg) {
              this.toastService.showError(error.data.msg, 'Alert');
              this.loaderService.loadingDismiss();
            } else if (error.status === 401) {
              this.toastService.showError('Unauthorized. Please log in again.', 'Alert');
              this.loaderService.loadingDismiss();
            } else {
              this.toastService.showError('An error occurred. Please try again.', 'Alert');
              this.loaderService.loadingDismiss();
            }
            console.error("Error creating violation:", error);
            this.loaderService.loadingDismiss();
          })
        }
        else{
          this.moduleService.violationImage(formData).subscribe((resp: any)=>{
            console.log("image resp", resp.data);
            if(resp.statusCode === 200){
              this.loaderService.loadingDismiss();
              console.log("image resp", resp.data);
              this.vImg = resp.data;
              console.log("this.vImg", this.vImg);
           if (this.photos.length <= 4) {
            this.photos.push(this.vImg);
            console.log('Photos Push', this.photos);
            this.camDisabled = false;
          }
          else {
            this.camDisabled = true;
          }
          }
          else{
            this.loaderService.loadingDismiss();
          }
            
          },
          (error: any) => {
            if (error.statusCode == 400 && error.data && error.data.msg) {
              this.toastService.showError(error.data.msg, 'Alert');
              this.loaderService.loadingDismiss();
            } else if (error.status === 401) {
              this.toastService.showError('Unauthorized. Please log in again.', 'Alert');
              this.loaderService.loadingDismiss();
            } else {
              this.toastService.showError('An error occurred. Please try again.', 'Alert');
              this.loaderService.loadingDismiss();
            }
            console.error("Error creating violation:", error);
            this.loaderService.loadingDismiss();
          })
        }
      } 
      else {
        this.offline = true;
        let filePath = this.file.externalDataDirectory + "ViolationDocs/";
        console.log(imageBase64);
        console.log("imageFle",imageFle); 
        let contentType = this.getContentType(imageBase64);
        console.log("contentType",contentType);
        this.file.checkDir(this.file.externalDataDirectory, 'ViolationDocs').then(() => {
          console.log('Directory exists:', filePath);
        }).catch(() => {
          console.log('Directory does not exist. Creating...');
          this.file.createDir(this.file.externalDataDirectory, 'ViolationDocs', false).then((directoryEntry) => {
            console.log('Directory created:', directoryEntry);
          }).catch((err) => {
            console.log('Error creating directory:', err);
          });
        });
        let fileName = imageFle; 
        this.file.writeFile(filePath, fileName, compressedBlob, { replace: true }).then((success) => {
          this.loaderService.loadingDismiss();
          console.log("File Written Successfully", success);
          this.photos.push(imageFle);
        }).catch((err) => {
          this.loaderService.loadingDismiss();
          console.log("Error Occurred While Writing File", err);
        });
      }
    }).catch((error) => {
      console.error("Error compressing image:", error);
      this.toastService.showError("Error compressing image. Please try again.", "Error");
    });
    }, (err) => {
      // Handle error
      console.error("Camera error:", err);
      this.toastService.showError("Error accessing camera. Please try again.", "Error");
    });
  }

  getImageFromGallery() {
    if(this.creatViolation.value['fineCode'] == null || this.creatViolation.value['fineCode'] == ''){
      this.toastService.showError("Please select fine code first", "Error");
      return;
    }
    this.camera.getPicture({
      quality: 50,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      encodingType: this.camera.EncodingType.JPEG,
      destinationType: this.camera.DestinationType.DATA_URL,
    }).then((imageData) => {

      let imageBase64 = 'data:image/jpeg;base64,' + imageData;
      let realData = imageData;
      this.compressImage(imageBase64).then((compressedImage: string) => {
        let compressedBlob = this.b64toBlob(compressedImage.split(',')[1], 'image/jpeg');
        console.log(compressedBlob,"compressedBlob")
      // let blob = this.b64toBlob(realData, 'image/jpeg');
      //this.imgUrl = imageBase64;
      console.log(compressedBlob);
      const random = Math.floor(Math.random() * (999999 - 100000)) + 100000000000000000;
      const imageFle = random + '.jpg';
      // let filePath = this.file.externalDataDirectory + "ViolationDocs";
      let filePath = this.file.externalDataDirectory + imageFle;
      // this.photos = imageFle
      console.log("this.photos", this.photos);
      console.log("filePath",filePath);
      this.offline_docpath = filePath + '/';
      this.loaderService.loadingPresent();
      if (localStorage.getItem('isOnline') === "true") {
        this.offline = false;
        const formData = new FormData();
        formData.append('uploadedImage', compressedBlob, imageFle);
        if(this.warning_required){
          this.moduleService.warningImage(formData).subscribe((resp: any)=>{
            console.log("image resp", resp.data);
            if(resp.statusCode === 200){
              this.loaderService.loadingDismiss();
              console.log("image resp", resp.data);
              this.vImg = resp.data;
              console.log("this.vImg", this.vImg);
            if (this.photos.length <= 4) {
              this.photos.push(this.vImg);
              console.log('Photos Push', this.photos);
              this.camDisabled = false;
            }
            else {
              this.camDisabled = true;
            }
            }
            else{
              this.loaderService.loadingDismiss();
            }
          } ,(error: any) => {
            if (error.statusCode == 400 && error.data && error.data.msg) {
              this.toastService.showError(error.data.msg, 'Alert');
              this.loaderService.loadingDismiss();
            } else if (error.status === 401) {
              this.toastService.showError('Unauthorized. Please log in again.', 'Alert');
              this.loaderService.loadingDismiss();
            } else {
              this.toastService.showError('An error occurred. Please try again.', 'Alert');
              this.loaderService.loadingDismiss();
            }
            console.error("Error creating violation:", error);
            this.loaderService.loadingDismiss();
          })
        }
        else{
          this.moduleService.violationImage(formData).subscribe((resp: any)=>{
            console.log("image resp", resp.data);
            if(resp.statusCode === 200){
              this.loaderService.loadingDismiss();
              console.log("image resp", resp.data);
              this.vImg = resp.data;
              console.log("this.vImg", this.vImg);
            if (this.photos.length <= 4) {
              this.photos.push(this.vImg);
              console.log('Photos Push', this.photos);
              this.camDisabled = false;
            }
            else {
              this.camDisabled = true;
            }
            }
            else{
              this.loaderService.loadingDismiss();
            }
          } ,(error: any) => {
            if (error.statusCode == 400 && error.data && error.data.msg) {
              this.toastService.showError(error.data.msg, 'Alert');
              this.loaderService.loadingDismiss();
            } else if (error.status === 401) {
              this.toastService.showError('Unauthorized. Please log in again.', 'Alert');
              this.loaderService.loadingDismiss();
            } else {
              this.toastService.showError('An error occurred. Please try again.', 'Alert');
              this.loaderService.loadingDismiss();
            }
            console.error("Error creating violation:", error);
            this.loaderService.loadingDismiss();
          })
        }
      } 
      else {
        this.offline = true;
        let filePath = this.file.externalDataDirectory + "ViolationDocs/";
        console.log(imageBase64);
        console.log("imageFle",imageFle); 
        let contentType = this.getContentType(imageBase64);
        console.log("contentType",contentType);
        this.file.checkDir(this.file.externalDataDirectory, 'ViolationDocs').then(() => {
          console.log('Directory exists:', filePath);
        }).catch(() => {
          console.log('Directory does not exist. Creating...');
          this.file.createDir(this.file.externalDataDirectory, 'ViolationDocs', false).then((directoryEntry) => {
            console.log('Directory created:', directoryEntry);
          }).catch((err) => {
            console.log('Error creating directory:', err);
          });
        });
        let fileName = imageFle; 
        this.file.writeFile(filePath, fileName, compressedBlob, { replace: true }).then((success) => {
          this.loaderService.loadingDismiss();
          console.log("File Written Successfully", success);
        }).catch((err) => {
          this.loaderService.loadingDismiss();
          console.log("Error Occurred While Writing File", err);
        });
      }
      if (this.photos.length <= 4) {
        // this.photos.push(this.vImg);//this.imgUrl);
        // this.photos = this.vImg
        this.basePhotos.push(imageBase64);
        console.log('Photos Push', this.photos);
        this.camDisabled = false;
      }
      else {
        this.camDisabled = true;
      }

    }).catch((error) => {
      console.error("Error compressing image:", error);
      this.toastService.showError("Error compressing image. Please try again.", "Error");
    });
    }, (err) => {
      // Handle error
      console.error("Camera error:", err);
      this.toastService.showError("Error accessing camera. Please try again.", "Error");
    });
  }

  compressImage(base64: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set the canvas size to 50% of the original image
        canvas.width = img.width * 0.5;
        canvas.height = img.height * 0.5;
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Compress the image to JPEG with 0.7 quality (adjust as needed)
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
        resolve(compressedBase64);
      };
      img.onerror = (error) => reject(error);
      img.src = base64;
    });
  }

  b64toBlob(b64Data, contentType): Blob {
    contentType = contentType || '';
    const sliceSize = 512;
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    // let blob = new Blob(byteArrays, { type: contentType });
    // return blob;
    return new Blob(byteArrays, { type: contentType });
  }


  getGallery() {
    this.camera.getPicture({
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL
    }).then((imageData) => {
      console.log('imageData', imageData);
      this.imgUrl = 'data:image/jpeg;base64,' + imageData;
      // this.photos.push(this.imgUrl);
    }, (err) => {
      // Handle error
    });
  }


  upload() {
    const formData = new FormData();
    console.log('amend_request', this.photos);
    let data = 'file:///data/user/0/io.ionic.starter/cache/1637148985780.jpg';

    let data_1 = data.split('cache/');
    console.log(data_1);
    formData.append('files', this.photos, this.filesDb);
    this.loaderService.loadingPresent();
    this.httpobj.setDataSerializer('multipart');
    this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
    this.httpobj.sendRequest(environment.apiUrl + '/uploadBulkImage', {
      method: "post",
      data: formData,
      timeout: 60,
    })
      .then(response => {
        this.loaderService.loadingDismiss();
      })
      .catch(error => {
        this.loaderService.loadingDismiss();
      });
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.creatViolation.patchValue({
        fileSource: file
      });
      console.log('files', event.target.files[0]);
      this.creatViolation.controls['identityDoc_file'].setValue(file);
      this.creatViolation.controls['identityDoc'].setValue(file.name);
    }
  }

videoRecord() {
  if(this.creatViolation.value['fineCode'] == null || this.creatViolation.value['fineCode'] == ''){
    this.toastService.showError("Please select fine code first", "Error");
    return;
  }
  this.androidPermissions.hasPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
    .then(status => {
      if (status.hasPermission) {
        this.captureVideo();
      } else {
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
          .then(status => {
            if (status.hasPermission) this.captureVideo();
          });
      }
    });
}

captureVideo() {
  this.loaderService.loadingPresent();
  let options: CaptureVideoOptions = { limit: 1, duration: 20 };
  this.mediaCapture.captureVideo(options)
    .then((data: any) => {
      this.isvideoCaptured = true;
      this.toastService.showSuccess("Video upload in process", "success");
      let capturedVid = data[0];
      console.log("1 video data", capturedVid);
      let localVideoPath = capturedVid.localURL || capturedVid.fullPath;
      console.log("2 video path", localVideoPath);
      let directoryPath = localVideoPath.substr(0, localVideoPath.lastIndexOf('/'));
      let fileName = localVideoPath.substr(localVideoPath.lastIndexOf('/') + 1).replace(/[^a-zA-Z0-9-_\.]/g, '');
      this.compressAndUploadVideo(localVideoPath);  // Updated to call compressAndUploadVideo
    },
    (err: CaptureError) => {
      console.error(err);
      this.toastService.showError(err, "Alert");
      this.loaderService.loadingDismiss();
    });
}

private compressAndUploadVideo(videoUri: string): void {
  this.getFileSize(videoUri).then(originalSize => {
    console.log("Original video size (in bytes):", originalSize);
    const originalSizeInMB = originalSize / (1024 * 1024);

    // Offline mode – store directly
    if (localStorage.getItem('isOnline') != "true") {
      this.storeVideoInMobileStorage(videoUri);
      return;
    }

    // If video is small (<=15MB), skip compression and upload directly
    if (originalSizeInMB <= 15) {
      console.log("Video is small, skipping compression. Proceeding to upload.");
      this.file.resolveLocalFilesystemUrl(videoUri)
        .then((entry) => (<FileEntry>entry).file(file => this.readFile(file)))
        .catch(err => {
          console.error("Error resolving original file URL:", err);
          this.toastService.showError("Error resolving file", "Alert");
        });
      return;
    }

    // Proceed with compression for large videos
    this.videoEditor.transcodeVideo({
      fileUri: videoUri,
      outputFileName: 'compressed_' + new Date().getTime(),
      outputFileType: this.videoEditor.OutputFileType.MPEG4,
      saveToLibrary: false,
      width: 1280,
      height: 720,
      videoBitrate: 1000000,
      audioChannels: 1,
      audioSampleRate: 44100
    }).then((compressedUri: any) => {
      console.log("Original video URI:", videoUri);
      console.log("Compressed video URI:", compressedUri);

      const formattedCompressedUri = compressedUri.startsWith('file://') ? compressedUri : 'file://' + compressedUri;

      this.getFileSize(formattedCompressedUri).then(compressedSize => {
        console.log("Compressed video size (in bytes):", compressedSize);

        this.file.resolveLocalFilesystemUrl(formattedCompressedUri)
          .then((entry) => (<FileEntry>entry).file(file => this.readFile(file)))
          .catch(err => {
            console.error("Error resolving compressed file URL:", err);
            this.toastService.showError("Error resolving file", "Alert");
          });
      }).catch(err => {
        console.error("Error getting compressed file size:", err);
      });

    }).catch(err => {
      console.error("Compression failed due to format error or unsupported profile", JSON.stringify(err));
      this.file.resolveLocalFilesystemUrl(videoUri)
    .then((entry) => (<FileEntry>entry).file(file => this.readFile(file)))
    .catch(e => {
        console.error("Error resolving original video:", e);
        this.toastService.showError("Video processing failed", "Alert");
    });
    });

  }).catch(err => {
    console.error("Error retrieving original video size", err);
    this.toastService.showError("Failed to get video size", "Alert");
    this.loaderService.loadingDismiss();
  });
}


private storeVideoInMobileStorage(imageFileUri: any): void {
  console.log(imageFileUri);
  let filePath = this.file.externalDataDirectory + "ViolationDocs/";
  const random = Math.floor(Math.random() * (999999 - 100000)) + 100000000000000000;
  const videoFile = random + '.mp4';
  
  this.file.writeFile(filePath, videoFile, imageFileUri, { replace: true })
    .then((success) => {
      this.loaderService.loadingDismiss();
      this.toastService.showSuccess("Video Stored in Mobile Storage Successfully", "success");
      this.zone.run(() => {
        this.showText = true;
        console.log("showText", this.showText);
      });
      this.videoData.push(videoFile);
    })
    .catch((err) => {
      this.loaderService.loadingDismiss();
      console.log("Error Occurred While Storing Video in Mobile Storage", err);
    });
}

private getFileSize(fileUri: string): Promise<number> {
  return this.file.resolveLocalFilesystemUrl(fileUri)
    .then((entry: FileEntry) => new Promise<number>((resolve, reject) => {
      entry.file(file => resolve(file.size), err => reject(err));
    }));
}

private readFile(file: any) {
  const reader = new FileReader();
  reader.onloadend = () => {
    const formData = new FormData();
    const imgBlob = new Blob([reader.result], { type: file.type });

    formData.append('file', imgBlob, file.name);
    this.saveStandard(formData);
  };
  reader.readAsArrayBuffer(file);
}

saveStandard(receivedStandardInfo: any) {
  return new Promise((resolve, reject) => {
    if(this.warning_required){
      this.moduleService.warningVideo(receivedStandardInfo).subscribe((resp: any) => {
        console.log("image resp", resp.data);
        if (resp.statusCode === 200) {
          console.log("image resp", resp.data);
          this.videoData.push(resp.data);
          this.toastService.showSuccess("Success", "Video Uploaded Successfully");
          this.zone.run(() => {
            this.showText = true;
            console.log("showText", this.showText);
          });
          this.loaderService.loadingDismiss();
          console.log("this.videoData", this.videoData);
        } else {
          this.toastService.showError("Video Not Uploaded", "Error");
          this.loaderService.loadingDismiss();
        }
        resolve(resp);
      }, (err) => {
        console.log(err);
        this.toastService.showError("Video Not Uploaded", "Error");
        this.loaderService.loadingDismiss();
        reject(err);
      });
    }
    else{
      this.moduleService.violationVideo(receivedStandardInfo).subscribe((resp: any) => {
        console.log("image resp", resp.data);
        if (resp.statusCode === 200) {
          console.log("image resp", resp.data);
          this.videoData.push(resp.data);
          this.toastService.showSuccess("Success", "Video Uploaded Successfully");
          this.zone.run(() => {
            this.showText = true;
            console.log("showText", this.showText);
          });
          this.loaderService.loadingDismiss();
          console.log("this.videoData", this.videoData);
        } else {
          this.toastService.showError("Video Not Uploaded", "Error");
          this.loaderService.loadingDismiss();
        }
        resolve(resp);
      }, (err) => {
        console.log(err);
        this.toastService.showError("Video Not Uploaded", "Error");
        this.loaderService.loadingDismiss();
        reject(err);
      });
    }

  }).catch(error => {
    this.loaderService.loadingDismiss();
    console.log('caught', error.message);
  });
}


  onDelete(data: any, name:any){
    console.log("data",data);
    if(this.warning_required){
      let payload = {
        "imagename":data,
      }
      this.moduleService.deleteImage(payload).subscribe((resp : any)=>{
        console.log(resp.data, "deleted");
        if(name === 'identity'){
          let indexToDelete= this.identityDocPhotos.findIndex((each)=>{
            console.log(each[0]);
            return each[0] === data;
            })
            if (indexToDelete !== -1) {
              this.identityDocPhotos.splice(indexToDelete, 1);
              console.log("Image deleted from array");
            } else {
              console.log("Image not found in array");
            }
            console.log(indexToDelete);
        }
        if(name === 'violation'){
          let indexToDelete= this.photos.findIndex((each)=>{
            console.log(each[0]);
            return each[0] === data;
            })
            if (indexToDelete !== -1) {
              this.photos.splice(indexToDelete, 1);
              console.log("Image deleted from array");
            } else {
              console.log("Image not found in array");
            }
            console.log(indexToDelete)
          
        }
      })
    }
    else{
      let payload = {
        "imagename":data,
        "filePath":'uploads/violation_documents/'
      }
      this.moduleService.vdeleteImage(payload).subscribe((resp : any)=>{
        console.log(resp.data, "deleted");
        // console.log("DocPhotos", this.identityDocPhotos);
        if(name === 'identity'){
          let indexToDelete= this.identityDocPhotos.findIndex((each)=>{
            console.log(each[0]);
            
            return each[0] === data;
            
            })
            if (indexToDelete !== -1) {
              // Remove the image from the array if found
              this.identityDocPhotos.splice(indexToDelete, 1);
              console.log("Image deleted from array");
            } else {
              console.log("Image not found in array");
            }
            console.log(indexToDelete)
          
        }
        if(name === 'violation'){
          let indexToDelete= this.photos.findIndex((each)=>{
            console.log(each[0]);
            
            return each[0] === data;
            
            })
            if (indexToDelete !== -1) {
              // Remove the image from the array if found
              this.photos.splice(indexToDelete, 1);
              console.log("Image deleted from array");
            } else {
              console.log("Image not found in array");
            }
            console.log(indexToDelete)
          
        }
      })
    }

  }

  onVdcamImgDelete(id: any, eventName: any): any {
      if (eventName == 'identityDoc') {
        console.log(id);
        let identityDoc = this.identityDocBasePhotos.indexOf(id);
        console.log('identityDoc', identityDoc);
        console.log('identityDoc', this.identityDocPhotos[id]);
        //this.identityDocBasePhotos.splice(identityDoc, 1);
        this.identityDocBasePhotos.splice(id, 1);
        let vdImgindexphotos = this.identityDocBasePhotos.indexOf(id);
        //this.identityDocPhotos.splice(vdImgindexphotos, 1);
        this.identityDocPhotos.splice(id, 1);
      }
      else {
        let vdImgindex = this.basePhotos.indexOf(id);
        console.log('vdImgindex', vdImgindex);
        console.log('VdImage Name', this.photos[id]);
        //this.basePhotos.splice(vdImgindex, 1);
        this.basePhotos.splice(id, 1);
        let vdImgindexphotos = this.basePhotos.indexOf(id);
        //this.photos.splice(vdImgindexphotos, 1);
        this.photos.splice(id, 1);
        console.log('Image removed');
      }
  }

  scrollTo(el: Element): void {
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

  }

  scrollToError(): void {
    const firstElementWithError = document.getElementById("createform").querySelector('form .ng-invalid[formControlName]');
    console.log("aa:", firstElementWithError);
    this.scrollTo(firstElementWithError);
  }

  handleReservation(event:any){
    console.log(event.detail.value,"reserved code data");
    this.selectedReservedData = event.detail.value;
    console.log(this.selectedReservedData)
    this.creatViolation.value.reservedCode = this.selectedReservedData.reserved_code;
    console.log(this.creatViolation.value);
    if(this.selectedReservedData.no_reserved == 0){
      this.showReservation = true;
      this.creatViolation.controls['reservationSites'].setValidators([Validators.required]);
      this.creatViolation.controls['reservationSites'].updateValueAndValidity();
      this.creatViolation.controls['reservationSiteAreas'].setValidators([Validators.required]);
      this.creatViolation.controls['reservationSiteAreas'].updateValueAndValidity();
      this.creatViolation.controls['reservedIdNumber'].setValidators([Validators.required]);
      this.creatViolation.controls['reservedIdNumber'].updateValueAndValidity();
      this.showMandatory = true;
    }
    else{
      this.showReservation = false;
      this.creatViolation.controls['reservationSites'].setValidators([]);
      this.creatViolation.controls['reservationSites'].updateValueAndValidity();
      this.creatViolation.controls['reservationSiteAreas'].setValidators([]);
      this.creatViolation.controls['reservationSiteAreas'].updateValueAndValidity();
      this.creatViolation.controls['reservedIdNumber'].setValidators([]);
      this.creatViolation.controls['reservedIdNumber'].updateValueAndValidity();
      this.showMandatory = false;
    }
  }

  getReservationSites(){
    if (localStorage.getItem('isOnline') === "true") {
      this.moduleService.getReservationSites().subscribe((result: any) => {
        console.log('getReservationSites', result);
        this.reservationSitesList = result.data;
      }),
        (error) => {
          console.log(error)
        };
    }
    else {
      console.log("App is offline")
      // this.dbservice.fetchReservedCodes().subscribe((res) => {
      //   console.log('getReservedCode', res);
      //   this.reservedCodeList = res;
      // }),
      //   (error) => {
      //     console.log(error)
      //   };
    }
  }

  reservationsiteChange(event : any){
    console.log("Reservation Change", event);
    this.getReservartionAreas(event.detail.value);
    
  }

  getReservartionAreas(id: any){
    if(localStorage.getItem('isOnline') === "true") {
      let payload = {
        reservation_site_id: id
      }
      this.moduleService.getReservationSiteAreas(payload).subscribe((resp)=>{
        console.log("Reservation Areas", resp);
        this.reservationSitesAreasList = resp.data;
      }),
      (error) => {
        console.log(error);
      }
    }
    else{
      console.log("App is offline");
    }
  }

    onSubmit() {
    console.log('Form', this.creatViolation.value);
    console.log("Invalid Controls", this.findInvalidControls(this.creatViolation))
    
    const signimg = "";//this.signaturePad.toDataURL();
    let signImage = "";
    let signature_docs: any = [];
    this.submitted = true;
  
    // Preliminary form validation
    if (this.creatViolation.invalid) {
      // Preserve critical field values
      const currentArea = this.creatViolation.get('area').value;
      
      this.scrollToError();
      this.submitted = false;
      
      // Optional: Restore critical field values if cleared
      if (!currentArea) {
        this.creatViolation.get('area').setValue(currentArea);
      }
      
      return;
    }
  
    // Additional document validations
    if (this.isCustomerwithproof == "Yes") {
      if (this.identityDocPhotos.length === 0) {
        this.toastService.showError(
          this.setLanguage == "ar" ? "الرجاء إدخال صورة الهوية" : "Identity Document Required", 
          this.setLanguage == "ar" ? "تنبيه " : "Alert"
        );
        this.submitted = false;
        return;
      }
    }
  
    if (this.svtSelected != 3 && this.svtSelected != 4) {
      if (this.photos.length === 0) {
        this.toastService.showError("Violation Document Required", this.setLanguage == "ar" ? "تنبيه " : "Alert");
        this.submitted = false;
        return;
      }
    }
  
    if (this.isvideoCaptured === true && this.fName === ''){ 
      this.toastService.showError("video Document Required", this.setLanguage == "ar" ? "تنبيه " : "Alert");
      this.submitted = false;
      return;
    }
  
    // Prepare base data
    let data = {
      user_id: localStorage.getItem('user_id'),
      language: localStorage.getItem('language'),
    };
  
    // Process violation title
    if (this.creatViolation.value['voilationTitle'] != null) {
      let vTitleData = this.creatViolation.value['voilationTitle'].violation_eng_title != undefined 
        ? this.creatViolation.value['voilationTitle'].violation_eng_title 
        : this.addVioTitleData;
      this.creatViolation.value['voilationTitle'] = vTitleData;
    }
  
    // Prepare form values
    let sCodeData = this.creatViolation.value['sideCode'] 
      ? this.creatViolation.value['sideCode'].description 
      : '';
  
    // Set up form values
    this.creatViolation.value['violator_signature'] = signImage;
    this.creatViolation.value['voilationtitleid'] = this.updatedVioTitleID;
    this.creatViolation.value['sideCode'] = sCodeData;
    this.creatViolation.value['sideCodeID'] = this.upDatedSideCodeID == null ? 0 : this.upDatedSideCodeID;
    this.creatViolation.value['created_by'] = localStorage.getItem('user_id');
    this.creatViolation.value['camerafiles'] = this.imgUrl ?? null;
    this.creatViolation.value['created_on'] = moment.tz("Asia/Dubai").format('YYYY-MM-DD HH:mm:ss');
    this.creatViolation.value['mulltifiles'] = this.photos.toString();
  
    // Handle identity documents
    if(this.isCustomerwithproof === 'No'){
      this.creatViolation.value['identityDoc'] = '';
    } else {
      this.creatViolation.value['identityDoc'] = this.identityDocPhotos.toString();
    }
  
    // Set additional values
    this.creatViolation.value['video'] = this.videoData.toString();
    this.creatViolation.value['actual_amount'] = this.actual_amount;
    this.creatViolation.value['repeat_amount'] = null;
    this.creatViolation.value['is_violation_repeated'] = null;
  
    // Safely process area value
    let areaValue = this.creatViolation.value['area'];
    this.creatViolation.value['area'] = 
      areaValue && typeof areaValue === 'object' && areaValue.area_id 
        ? areaValue.area_id 
        : areaValue;
  
    // Replace null/undefined values safely
    Object.keys(this.creatViolation.value).forEach((key) => {
      const value = this.creatViolation.value[key];
      if (
        value === "null" || 
        value === "undefined" ||
        value === null ||
        value === undefined
      ) {
        // Only replace if it's not a critical field
        if (!['area', 'voilationType', 'violationCategory', 'fineCode'].includes(key)) {
          this.creatViolation.value[key] = "";
        }
      }
    });
  
    // Set fine code and additional processing
    let fineCodeValue = this.finecodeValue;

    if (typeof fineCodeValue === 'object' && fineCodeValue !== null) {
      fineCodeValue = fineCodeValue.id || fineCodeValue.fine_code_id;
    }

    this.creatViolation.value['fineCode'] = fineCodeValue;
  
    // Process different violation types
    if (this.svtSelected == 1) {
      // Document type processing
      this.creatViolation.value['documentNo'] = this.documentNumber;
      let getDocDetails = this.documentList.filter((item: any) => item.id == this.creatViolation.value['documentType'])[0];
      
      let arablangdocname = getDocDetails.name_arb;
      let englangdocname = getDocDetails.name_eng;
      
      this.documentTypeName = this.setLanguage === 'ar' 
        ? (arablangdocname || englangdocname)
        : englangdocname;
      
      this.creatViolation.value['documentTypeName'] = this.documentTypeName;
      this.creatViolation.value['licenseNo'] = "";
      this.creatViolation.value['plateNo'] = "";
      this.creatViolation.value['reservedCode'] = "";
      this.creatViolation.value['reservedIdNumber'] = "";
    }
    else if (this.svtSelected == 2) {
      this.creatViolation.value['documentNo'] = '';
      this.creatViolation.value['documentTypeName'] = '';
      this.creatViolation.value['licenseNo'] = this.licenseNumber;
      this.creatViolation.value['plateNo'] = "";
      this.creatViolation.value['licenseExpiryDate'] = this.licenseExpiryDate;
      this.creatViolation.value['licenseLocation'] = this.licenseLocation;
    }
    else {
      this.creatViolation.value['documentNo'] = '';
      this.creatViolation.value['documentTypeName'] = '';
      this.creatViolation.value['plateNo'] = this.platecodeNumber;
      this.creatViolation.value['licenseNo'] = "";
    }
  
    this.creatViolation.value['consider_as_aber'] = "No";
  
    // Fine amount processing
    if (this.creatViolation.value['finecodecount'] !== null) {
      this.creatViolation.value['finecodecount'] = 
        this.creatViolation.value['finecodecount'] == 0 ? 1 : this.creatViolation.value['finecodecount'];
      
      this.creatViolation.value['fineAmount'] = 
        this.creatViolation.value['fineAmount'] * this.creatViolation.value['finecodecount'];
    }
  
    // Input validation
    const exp = /^<([a-z]+)([^<]+)*(?:>(.*)<\/\1>|\s+\/>)$/;
    const ViolationKeys = Object.keys(this.creatViolation.value);
    
    const hasInvalidInput = ViolationKeys.some(item => {
      const value = this.creatViolation.value[item];
      return (
        value != undefined && 
        value != null && 
        !Array.isArray(value) && 
        typeof value !== "object" && 
        isNaN(value) && 
        value.match(exp)
      );
    });
  
    if (hasInvalidInput) {
      this.toastService.showError('Enter Valid Input.', 'Alert');
      return;
    }
  
    // Plate-related processing
    if(this.svtSelected == 3){
      const platesourcecode = this.creatViolation.value.plateSource;
      const platecategorycode = this.creatViolation.value.plateCategory;
      
      this.creatViolation.value.plateSource = 
        this.sourceId == 1 ? platesourcecode.aber_code : platesourcecode.raqab_code;
      
      this.creatViolation.value.plateCategory = 
        this.sourceId == 1 ? platecategorycode.aber_code : platecategorycode.raqab_code;
    }
  
    this.creatViolation.value.violationCategory = this.violationCategorySelected;
  
    // Online/Offline submission logic
    if (localStorage.getItem('isOnline') === "true") {
      this.loaderService.loadingPresent()
      let InsertViolationObj = {
        violationdocs: [...this.photos, ...this.identityDocPhotos],
        violator_signature: signImage,
        violationvideos: this.offlinevideos,
        violationSyncStatus: 0
      }
      console.log("InsertViolationObj",InsertViolationObj)
      this.dbservice.InsertViolationDocs([InsertViolationObj]).then((res) => {
  
      }).catch(() => { });
      this.dbservice.InsertViolationVideos([InsertViolationObj]).then((res) => {
  
      }).catch(() => { });
  
      //if (this.commparamvalue === "0") {
      this.creatViolation.value['name_ded_eng'] = this.name_ded_eng ?? null;
      this.creatViolation.value['name_ded_ar'] = this.name_ded_ar ?? null;
  
      if(this.creatViolation.controls['finePlace'].value === null || undefined || ''){
        this.creatViolation.controls['finePlace'].setValue(this.latitude + ',' +this.longitude);
      }
      this.creatViolation.value['source_id'] = this.sourceId;
      this.creatViolation.value['plateSource'] = this.selectedPlateSourceCode;
      this.creatViolation.value['plateCategory'] = this.plateCategoryid;
      if(this.svtSelected != 1){
        if(this.selectedReservedData && this.selectedReservedData.reserved_code){
          this.creatViolation.value['reservedCode'] = this.selectedReservedData.reserved_code;
        } else {
          this.creatViolation.value['reservedCode'] = '';
        }
      }
  
      console.log("request_body", this.creatViolation.value);
      if(this.warning_required){
        this.creatViolation.value['warningSpecification'] = this.warningSpecificationId;
        this.moduleService.createWarning(this.creatViolation.value).subscribe((result: any) => {    
          console.log("result", result);
            console.log('Created res', result);
            this.loaderService.loadingDismiss()
            this.routerServices.navigate(['/warninglist'], { replaceUrl: true });
            this.toastService.showSuccess('Warning Successfuly Created', 'Thank You');
            this.photos = [];
            this.basePhotos = [];
            this.identityDocPhotos = [];
            this.identityDocBasePhotos = [];
            signature_docs = [];
            this.creatViolation.reset();
            this.creatViolation.setErrors(null); // could be removed
            this.creatViolation.updateValueAndValidity();
            this.moduleService.reloadEvent.next(data);
            this.submitted = false;
  
          // }
          this.loaderService.loadingDismiss()
        },
        (error: any) => {
          console.log(error)
          this.submitted = false;
          this.loaderService.loadingDismiss();
          if (error.statusCode == 400 && error.data && error.data.msg) {
            this.toastService.showError(error.data.msg, 'Alert');
          } else if (error.status === 401) {
            this.toastService.showError('Unauthorized. Please log in again.', 'Alert');
          } else {
            this.toastService.showError('An error occurred. Please try again.', 'Alert');
          }
          console.log("Error Create Warning",error)
          this.toastService.showError(error.data.msg, 'Alert');
        }
      );
  
      }else{
        console.log("FINAL REQUEST BODY SNAPSHOT",
JSON.parse(JSON.stringify(this.creatViolation.value)));
        this.moduleService.violationCreation(this.creatViolation.value).subscribe((result: any) => {
          console.log("result", result);
          if (result.statusCode == 200 || result.status === 200) {
            console.log('Created res', result);
            this.loaderService.loadingDismiss()
            this.routerServices.navigate(['/transactionslist'], { replaceUrl: true });
            this.toastService.showSuccess('Violation Successfuly Created', 'Thank You');
            this.photos = [];
            this.basePhotos = [];
            this.identityDocPhotos = [];
            this.identityDocBasePhotos = [];
            signature_docs = [];
            this.creatViolation.reset();
            this.creatViolation.setErrors(null); // could be removed
            this.creatViolation.updateValueAndValidity();
            this.syncDocuments();
            this.moduleService.reloadEvent.next(data);
          } 
          else {
            this.submitted = false;
            this.loaderService.loadingDismiss();
            console.log("errrrrrr",result.error);
            this.toastService.showError('Violation can not be created within 3 days.', 'Alert');
            return;
  
          }
          this.loaderService.loadingDismiss()
        },
        (error: any) => {
          this.submitted = false;
          this.loaderService.loadingDismiss();
          
          if (error.statusCode == 400 && error.data && error.data.msg) {
            this.toastService.showError(error.data.msg, 'Alert');
          } else if (error.status === 401) {
            this.toastService.showError('Unauthorized. Please log in again.', 'Alert');
          } else {
            this.toastService.showError('An error occurred. Please try again.', 'Alert');
          }
          console.error("Error creating violation:", error);
        }
      );
      }
    } else {
      this.creatViolation.value['source_id'] = this.sourceId
      this.creatViolation.value["docpath"] = this.offline_docpath;
      this.creatViolation.value["videospath"] = this.offline_videos_path;
      this.creatViolation.value["signaturepath"] = this.offline_signature_path;
      let InsertViolationObj = {
        violation: this.creatViolation.value,
        violationdocs: [...this.photos, ...this.identityDocPhotos],
        violator_signature: signImage,
        violationvideos: this.offlinevideos,
        violationSyncStatus: 0
      }
      console.log("createviolationofflinepayload",InsertViolationObj);
  
      this.dbservice.InsertViolation([InsertViolationObj]).then((result) => {
        console.log(result,"resultttts");
        console.info("Inserted items");       
        this.routerServices.navigate(['/transactionslist'], { replaceUrl: true });
        this.toastService.showSuccess('Violation Created in Offile Mode, Data posted to the server when device is online', 'Thank You');
        this.photos = [];
        this.basePhotos = [];
        this.identityDocPhotos = [];
        signature_docs = [];
        this.identityDocBasePhotos = [];
        this.creatViolation.reset();
        this.creatViolation.setErrors(null); 
        this.creatViolation.updateValueAndValidity();
      }).catch(e => console.log(e));
    }
  }

  AreaChange(event: {
    component: IonicSelectableComponent,
    value: any,
  }) {
    console.log(event);
    
    // Assuming your areaList items have 'latitude' and 'longitude' properties
    this.latitude = event.value.latitude;
    this.longitude = event.value.longtitude;
  
    console.log("latitude", this.latitude);
    console.log("longitude", this.longitude);
  
    let options = {
      timeout: 10000,
      enableHighAccuracy: true,
      maximumAge: 3600
    };
  
    this.geolocation.getCurrentPosition(options)
.then((position) => {

  const finePlace =
    position.coords.latitude + ',' + position.coords.longitude;

  this.creatViolation.controls['finePlace'].setValue(finePlace);

})
.catch((error) => {

  console.error("Geolocation error", error);

  this.toastService.showError(
    "Unable to get location. Please enable GPS.",
    "Alert"
  );

});
     console.log(this.creatViolation.controls['finePlace'].value,"finePlace");
  }
  onClearArea(event: {
    component: IonicSelectableComponent,
    items: any[]
  }) {
    event.component.clear();
  }

  
  latlong(){

    let options = {
      timeout: 10000,
      enableHighAccuracy: true,
      maximumAge: 3600
    };

    this.geolocation.getCurrentPosition(options).then((position) => {
      this.creatViolation.controls['finePlace'].setValue(position.coords.latitude + ',' + position.coords.longitude);
      this.onSubmit();
    })
  }


  async openViewer() {
    const modal = await this.modalController.create({
      component: ViewerModalComponent,
      cssClass: 'ion-img-viewer',
      keyboardClose: true,
      showBackdrop: true
    });
    return await modal.present();
  }

  findInvalidControls(f: FormGroup) {
    const invalid = [];
    const controls = f.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  public writeFile(base64Data: any, folderName: string, fileName: any) {
    let contentType = this.getContentType(base64Data);
    let DataBlob = this.base64toBlob(base64Data, contentType);
    // here iam mentioned this line this.file.externalRootDirectory is a native pre-defined file path storage. You can change a file path whatever pre-defined method.  
    let filePath = this.file.externalDataDirectory + folderName;

    this.file.writeFile(filePath, fileName, DataBlob, contentType).then((success) => {
      console.log("File Writed Successfully", success);
    }).catch((err) => {
      console.log("Error Occured While Writing File", err);
    })
  }
  //here is the method is used to get content type of an bas64 data  
  public getContentType(base64Data: any) {
    let block = base64Data.split(";");
    let contentType = block[0].split(":")[1];
    return contentType;
  }
  //here is the method is used to convert base64 data to blob data  
  public base64toBlob(b64Data, contentType) {
    contentType = contentType || '';
    const sliceSize = 512;
    let byteCharacters = atob(b64Data);
    let byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);
      let byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      var byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    let blob = new Blob(byteArrays, {
      type: contentType
    });
    return blob;
  }

  onClearViolationTitle(event: {
    component: IonicSelectableComponent,
    items: any[]
  }) {
    event.component.clear();
  }

  onClearSidecodeTitle(event: {
    component: IonicSelectableComponent,
    items: any[]
  }) {
    event.component.clear();
  }

  onCleardocumnetNumber(event: {
    component: IonicSelectableComponent,
    items: any[]
  }) {
    event.component.clear();
  }

  onClearlicenseNo(event: {
    component: IonicSelectableComponent,
    items: any[]
  }) {
    event.component.clear();
  }

  onClearplateNumber(event: {
    component: IonicSelectableComponent,
    items: any[]
  }) {
    event.component.clear();
  }

  onClearfineCode(event: {
    component: IonicSelectableComponent,
    items: any[]
  }) {
    event.component.clear();
  }


  async syncDocuments() {
    /* Start Violations Docs Sync */
    const documents = await this.dbservice.getviolationDocList().then(async (data) => {
      console.log("getviolationDocList", data);
      let violationdocs = data;
      let documents: any = [];
      //violationdocs.map((item) => {
      for (var i = 0; i < violationdocs.length; i++) {
        let docsList: any = violationdocs[i].violationdocs.split(',')
        // await docsList.map(async (document) => {
        for (var doc = 0; doc < docsList.length; doc++) {
          let localdocPath: any = this.file.externalDataDirectory + "ViolationDocs/" + docsList[doc];
          let directoryPath = localdocPath.substr(0, localdocPath.lastIndexOf('/'));
          let fileName = localdocPath.substr(localdocPath.lastIndexOf('/') + 1);
          await this.file.readAsArrayBuffer(directoryPath, fileName).then((result) => {
            let blob = new Blob([result], { type: "image/jpeg" });
            let blobSize = blob.size / (1024 * 1024);
            documents.push({ blob: blob, filename: fileName });
          }).catch(err => {
            console.log('file not found' + JSON.stringify(err));
          });

        }
        //})  
      }
      // })
      return documents;
    })
    const formData = new FormData();
    for (let i = 0; i < documents.length; i++) {
      console.log(documents[i]);
      //var file=new File([documents[i]],)

      formData.append("files", documents[i].blob, documents[i].filename);
    }
    this.httpobj.setDataSerializer('multipart');
    this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
    this.httpobj.sendRequest(environment.apiUrl + '/uploadoffline', {
      method: "post",
      data: formData,
      timeout: 60,
    })
      .then(response => {
        this.loaderService.loadingDismiss();

      })
      .catch(error => {
        this.loaderService.loadingDismiss();
      });

    /* End Violations Docs Sync */

    /* Start Violator's Signature Sync */
    const Signdocuments = await this.dbservice.getviolatorSignature().then(async (data) => {
      console.log("getviolatorSignature", data);
      let signaturedocs = data;
      let Signdocuments: any = [];
      for (var i = 0; i < signaturedocs.length; i++) {
        let signature: any = signaturedocs[i].violator_signature;
        let localdocPath: any = this.file.externalDataDirectory + "VIOLATORSIGNATURES/" + signature;
        let directoryPath = localdocPath.substr(0, localdocPath.lastIndexOf('/'));
        let fileName = localdocPath.substr(localdocPath.lastIndexOf('/') + 1);
        await this.file.readAsArrayBuffer(directoryPath, fileName).then((result) => {
          let blob = new Blob([result], { type: "image/png" });
          let blobSize = blob.size / (1024 * 1024);
          Signdocuments.push({ blob: blob, filename: fileName });
        }).catch(err => {
          console.log('file not found' + JSON.stringify(err));
        });

      }
      return Signdocuments;
    })
    const formSignatureData = new FormData();
    for (let i = 0; i < Signdocuments.length; i++) {
      console.log(Signdocuments[i]);
      formSignatureData.append("uploadedSign", Signdocuments[i].blob, Signdocuments[i].filename);
    }
    this.httpobj.setDataSerializer('multipart');
    this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
    this.httpobj.sendRequest(environment.apiUrl + '/uploadViolatorsignatureOffline', {
      method: "post",
      data: formSignatureData,
      timeout: 60,
    })
      .then(response => {
        this.loaderService.loadingDismiss();

      })
      .catch(error => {
        this.loaderService.loadingDismiss();
      });
    /*  End Violator's Signature Sync */

    /* Start Violation Amend  Docs */


    const amenddocs = await this.dbservice.getviolationAmenddocs().then(async (data) => {
      let violationamenddocs = data;
      let amenddocs: any = [];

      // violationVideos.map((item)=>{
      for (var i = 0; i < violationamenddocs.length; i++) {
        let amenddoc: any = violationamenddocs[i].images;
        let localamenddocPath: any = amenddoc;
        let directoryPath = localamenddocPath.substr(0, localamenddocPath.lastIndexOf('/'));
        let fileName = localamenddocPath.substr(localamenddocPath.lastIndexOf('/') + 1);
        await this.file.readAsArrayBuffer(directoryPath, fileName).then((result) => {

          let blob = new Blob([result], { type: "image/jpeg" });
          let blobSize = blob.size / (1024 * 1024);
          amenddocs.push({ blob: blob, filename: fileName });
        }).catch(err => {
          console.log('file not found' + JSON.stringify(err));
        });
      }
      return amenddocs;
    })
    const formDataamenddocs = new FormData();
    for (let i = 0; i < amenddocs.length; i++) {
      console.log(amenddocs[i]);
      //var file=new File([documents[i]],)

      formDataamenddocs.append("files", amenddocs[i].blob, amenddocs[i].filename);
    }

    this.httpobj.setDataSerializer('multipart');
    this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
    this.httpobj.sendRequest(environment.apiUrl + '/uploadmultipleamenddocs', {
      method: "post",
      data: formDataamenddocs,
      timeout: 60,
    })
      .then(response => {
        this.loaderService.loadingDismiss();

      })
      .catch(error => {
        this.loaderService.loadingDismiss();
      });

    /* End Violation Amend docs */

    /* Start Violations videos Sync */

    const videos = await this.dbservice.getviolationVideosList().then(async (data) => {
      let violationVideos = data;
      let videos: any = [];
      for (var i = 0; i < violationVideos.length; i++) {
        let video: any = violationVideos[i].violationvideos;
        let localvideoPath: any = video;
        let directoryPath = localvideoPath.substr(0, localvideoPath.lastIndexOf('/'));
        let fileName = localvideoPath.substr(localvideoPath.lastIndexOf('/') + 1);
        await this.file.readAsArrayBuffer(directoryPath, fileName).then((result) => {

          let blob = new Blob([result], { type: "video/mp4" });
          let blobSize = blob.size / (1024 * 1024);
          videos.push({ blob: blob, filename: fileName });
        }).catch(err => {
          console.log('file not found' + JSON.stringify(err));
        });
      }
      return videos;
    })
    const formDataVideos = new FormData();
    for (let i = 0; i < videos.length; i++) {
      console.log(videos[i]);
      formDataVideos.append("files", videos[i].blob, videos[i].filename);
    }


    this.httpobj.setDataSerializer('multipart');
    this.httpobj.setHeader(environment.authorizationURL, "Authorization", localStorage.getItem('hashToken'));
    this.httpobj.sendRequest(environment.apiUrl + '/uploadofflineVideos', {
      method: "post",
      data: formDataVideos,
      timeout: 60,
    })
      .then(response => {
        this.loaderService.loadingDismiss();

      })
      .catch(error => {
        this.loaderService.loadingDismiss();
      });

    /* End Violations videos Sync */
  }

  Search(searchText: any) {
    let text = searchText;
    this.licenseNumber = text;
    if (localStorage.getItem('isOnline') === "true") {
      let paramObj = {
        "licenseNo": text
      }
      this.licenseNumber = text;
      this.loaderService.loadingPresent();
      console.log(paramObj);
      this.moduleService.GetLicenseByLicenseNumber(paramObj).subscribe((res) => {
        console.log(res, "licence details with search");
        this.allowStatus = res.allowStatuses;
        console.log(this.allowStatus)
        if (res.ResponseContent) {
          if (res.ResponseContent.length > 0) {  
            this.licenseNumberList = res.ResponseContent; 
            console.log(this.licenseNumberList, "LicenceNumberList")  
            this.licenseNumberList.map(
              obj => {
                obj.license_no = obj.LicenseNumber
              }
            );
            console.log(this.licenseNumberList, "LicenceNumberList");
  
            // Check if the license status is in the allowStatuses array
            if (this.allowStatus.includes(this.licenseNumberList[0].LicenseStatusEN)) {
              this.licenseExpiryDate = this.licenseNumberList[0].ExpiryDate;
              this.licenseLocation = this.licenseNumberList[0].X + ',' + this.licenseNumberList[0].Y;
              this.license = this.licenseNumberList[0];
              let lInfo = this.licenseNumberList
              if (lInfo.length > 0) {
                console.log(lInfo);
                let rInfo = lInfo[0].Persons.filter((item: any) => { return item.RoleEN.toLowerCase().indexOf('director') >= 0 })
                // this.creatViolation.controls['sideCodeDescription'].setValue(this.setLanguage == 'ar' ? lInfo[0].NameAR : lInfo[0].NameEN);
                this.creatViolation.controls['sideCodeDescription'].setValue(lInfo[0].NameAR);
                if (rInfo.length > 0) {
                  this.creatViolation.controls['ownername'].setValue(this.setLanguage == 'ar' ? rInfo[0].NameAR : rInfo[0].NameEN);
                  this.creatViolation.controls['ownerphone'].setValue(rInfo[0].PrimaryPhoneNumber ? ((rInfo[0].PrimaryPhoneNumber[0] !== '0' ? '0' : '') + rInfo[0].PrimaryPhoneNumber) : '');
                  this.creatViolation.controls['email'].setValue(rInfo[0].Email);
                  this.name_ded_eng = lInfo[0].NameEN;
                  this.name_ded_ar = lInfo[0].NameAR;
                }
  
                rInfo = lInfo[0].Persons.filter((item: any) => { return item.RoleEN.toLowerCase().indexOf('owner') >= 0 })
                if (rInfo.length > 0) {
                  this.creatViolation.controls['ownername'].setValue(this.setLanguage == 'ar' ? rInfo[0].NameAR : rInfo[0].NameEN);
                  this.creatViolation.controls['ownerphone'].setValue(rInfo[0].PrimaryPhoneNumber ? ((rInfo[0].PrimaryPhoneNumber[0] !== '0' ? '0' : '') + rInfo[0].PrimaryPhoneNumber) : '');
                  this.creatViolation.controls['email'].setValue(rInfo[0].Email);
                  this.name_ded_eng = lInfo[0].NameEN;
                  this.name_ded_ar = lInfo[0].NameAR;
                }
  
                rInfo = lInfo[0].Persons.filter((item: any) => { return item.RoleEN.toLowerCase().indexOf('partner') >= 0 })
                if (rInfo.length > 0) {
                  this.creatViolation.controls['ownername'].setValue(this.setLanguage == 'ar' ? rInfo[0].NameAR : rInfo[0].NameEN);
                  this.creatViolation.controls['ownerphone'].setValue(rInfo[0].PrimaryPhoneNumber ? ((rInfo[0].PrimaryPhoneNumber[0] !== '0' ? '0' : '') + rInfo[0].PrimaryPhoneNumber) : '');
                  this.creatViolation.controls['email'].setValue(rInfo[0].Email);
                  this.name_ded_eng = lInfo[0].NameEN;
                  this.name_ded_ar = lInfo[0].NameAR;
                }
  
                rInfo = lInfo[0].Persons.filter((item: any) => { return item.RoleEN.toLowerCase().indexOf('individual') >= 0 })
                if (rInfo.length > 0) {
                  this.creatViolation.controls['ownername'].setValue(this.setLanguage == 'ar' ? rInfo[0].NameAR : rInfo[0].NameEN);
                  this.creatViolation.controls['ownerphone'].setValue(rInfo[0].PrimaryPhoneNumber ? ((rInfo[0].PrimaryPhoneNumber[0] !== '0' ? '0' : '') + rInfo[0].PrimaryPhoneNumber) : '');
                  this.creatViolation.controls['email'].setValue(rInfo[0].Email);
                  this.name_ded_eng = lInfo[0].NameEN;
                  this.name_ded_ar = lInfo[0].NameAR;
                }
              }
            } else {
              // Show alert if the license status is not in allowStatuses
              this.alertErrorMessage = `The license status "${this.licenseNumberList[0].LicenseStatusEN}" is not allowed.`;
              this.showAlert();
              // this.toastService.showError(`The license status "${this.licenseNumberList[0].LicenseStatusEN}" is not allowed.`, "Alert");
              this.license = {};
            }
          } else {
            this.toastService.showError("No license found with the given number.", "Alert");
          }
        } else {
          this.toastService.showError("No response content received.", "Alert");
        }
        this.loaderService.loadingDismiss();
      },
      (error) => {
        this.loaderService.loadingDismiss();
        this.toastService.showError("An error occurred while fetching the license details.", "Error");
      })
    } else {
      this.getvoilationSearchByField(text);
      this.licenseNumberComponent.showAddItemTemplate();
    }
  }

  async showAlert() {  
    const alert = await this.alertCtrl.create({  
      header: 'Alert',    
      message: this.alertErrorMessage,  
      buttons: ['OK']  
    });  
    await alert.present();  
    const result = await alert.onDidDismiss();  
    console.log(result);  
  } 

  customCounterFormatter(inputLength: number, maxLength: number) {
    return `${maxLength - inputLength} characters remaining`;
  }

  ngOnDestroy() {
    const loadingExist = document.getElementsByTagName('ion-loading')[0];
    if (loadingExist) {
      this.loaderService.loadingDismiss();
    }
  }


  getWarningSpecificatins() {
    if (localStorage.getItem('isOnline') === 'true') {
      this.moduleService.getWarningSpecifications().subscribe((response) => {
        console.log("Warning Specification Response", response.data);
        this.specificationList = response.data;
  
        // Find the ID where create_violation is "1"
        const violationItem = this.specificationList.find((item: any) => item.create_violation == "1");
        
        // Store the ID if found
        if (violationItem) {
          this.warningSpecificationId = violationItem.id;
          console.log("Stored Warning Specification ID:", this.warningSpecificationId);
        }
      });
    } else {
      console.log("App is offline");
    }
  }

  handleWarningSpecification(event: any){
    console.log(event.detail.value);
    const eventResponse = event.detail.value;
    if(eventResponse.create_violation == 1 ){
      this.warningSpecificationId = eventResponse.id;
      this.createViolation = true;
    }
    else{
      this.warningSpecificationId = eventResponse.id;
      this.createViolation = false;
    }
  }

  getWarningData(){
    this.moduleService.warningHours().subscribe((resp: any)=>{
      console.log("warning hours", resp);
      this.durationData = resp.data    
    })
  }

  durationValue(event: any){
    // let idd = id;
    // console.log("idddddddddd",idd)    
    console.log('Duration Selected',event.target.value);
    // console.log("duration id", event.detail.value);
    
    this.durationSelected = event.target.value;
    this.creatViolation.controls['warningDuration'].setValue(this.durationSelected);
  }


}
