import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { ModalController, Platform  } from '@ionic/angular';
import { ViewmapmodalPage } from '../modalpopup/viewmapmodal/viewmapmodal.page';
import { ViewerModalComponent } from 'ngx-ionic-image-viewer';
//import { Base64ToGallery } from '@ionic-native/base64-to-gallery/ngx';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModuleService } from 'src/app/shared/services/module.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions, CaptureVideoOptions } from '@ionic-native/media-capture/ngx';
import { File as NativeFile, FileEntry } from '@ionic-native/File/ngx';

import { ToastService } from 'src/app/shared/services/toast.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { VideoEditor } from '@ionic-native/video-editor/ngx';
import { DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { TranslateService } from '@ngx-translate/core';
import { IonicSelectableComponent } from 'ionic-selectable'; 
import { ChangeDetectorRef } from '@angular/core'; 
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-raisecomplaint',
  templateUrl: './raisecomplaint.page.html',
  styleUrls: ['./raisecomplaint.page.scss'],
})
export class RaisecomplaintPage implements OnInit {
  svtSelected: any;
  modelDataSig: any;
  submitted = true;
  raisecomplaint: FormGroup;
  listAgencies: any;
  listPriorities:any;
  listComplaintAreas: any;
  listComplaintTypes: any;
  listComplaintSubTypes: any;
  setLanguage: any;
  complaintsubtypeselectItem:any;
  areaSector:any;
  complaintImages=[];
  complaintVideo:any;
  file = new NativeFile();  
  curLatLong:any;
  complaintImagesUrl=[];
  videoObject:any={};
  latlng:any;
  vthumbnail:any="";
  isDisabled: boolean=false;
  defaultArea: any;
  defaultComplaintType:any;
  defaultpriority:any;
  selectedAgency:any;
  areasRequired:any;
  videoData: any ='';
  @ViewChild('areaChangeComponent') areaChangeComponent : IonicSelectableComponent;
  isvideoCaptured: boolean;
  showText: boolean = false ;
  complaintImg: any;
  imageBase = environment.complaintimgurl;

  constructor(
    private modalController: ModalController,
    private elementRef: ElementRef,
    //private base64ToGallery: Base64ToGallery,
    public routerServices: Router,
    private fb: FormBuilder,
    private mService: ModuleService,
    private camera: Camera,
    private loaderService: LoaderService,
    private translateService: TranslateService,
    public toastService: ToastService,
    private mediaCapture: MediaCapture,
    public geolocation: Geolocation,
    public videoEditor : VideoEditor,
    private sanitizer: DomSanitizer,
    private androidPermissions: AndroidPermissions,
    private locationAccuracy: LocationAccuracy,
    private zone: NgZone,
    private cdr: ChangeDetectorRef,
    private platform: Platform,
  ) {
    this.setLanguage = window.localStorage.getItem('language');
    this.translateService.use(this.setLanguage);
    this.raisecomplaint = this.fb.group({
      agency: ['', [Validators.required]],
      areaname: ['', [Validators.required]],
      areasector:[''],
      priority: ['', [Validators.required]],
      complainttype: ['', [Validators.required]],
      complaintsubtype: [''],
      description: ['', [Validators.required]],
    });
    console.log("show",this.showText);
    

  }

  get form() { return this.raisecomplaint.controls; }

  ngOnInit() {
    this.showText = false;

    this.getAgencies();
    this.getPriorities();


    this.mService.languageEvent.subscribe((result: any) => {
      this.translateService.use(result);
    }),
      (error) => {
        console.log(error)
      };
    console.log('Form Status:', this.raisecomplaint.status);
    console.log('Form Errors:', this.raisecomplaint.errors);

  }

  async onSubmit() {
    console.log(this.raisecomplaint)
    console.log('Form Status:', this.raisecomplaint.status);
    console.log('Form Errors:', this.raisecomplaint.errors);
    this.loaderService.loadingPresent();
    this.submitted = true;
    if (this.raisecomplaint.invalid) {
      this.submitted = false;
      this.loaderService.loadingDismiss();
      return;
    }

    if(this.complaintImages.length == 0 && !this.videoData) {
        this.toastService.showError(
          this.setLanguage == "ar" ? "المستندات المطلوبة" : "Documents are Required", 
          this.setLanguage == "ar" ? "تنبيه " : "Alert"
        );
        this.submitted = false;
        this.loaderService.loadingDismiss();
        return;
    }


 
    let options = {
      timeout: 10000,
      enableHighAccuracy: true,
      maximumAge: 3600
    };
    this.geolocation.getCurrentPosition(options).then((position) => {
      this.latlng = position.coords.latitude + ',' + position.coords.longitude;
      console.log("area_name", this.raisecomplaint.value['areaname'].id);
      console.log("complaint_type", this.raisecomplaint.value['complainttype'])
      let payload = {
        "area_name":this.raisecomplaint.value['areaname'].id,
        "complaint_type":this.raisecomplaint.value['complainttype'],
        "agency_name":this.raisecomplaint.value['agency'],
        "sector":this.areaSector,
        "priority":  this.raisecomplaint.value['priority'],
        "complaint_subtype":this.raisecomplaint.value['complaintsubtype'],
        "complaint_lat_lang":this.latlng,
        "description":this.raisecomplaint.value['description'],
        "proof_image": this.complaintImages.join(','),
        "proof_video":this.videoData,
        "created_by": localStorage.getItem('user_id')
      }
      console.log(payload);
      this.mService.CreateComplaint(payload).subscribe((res) => {
        console.log(payload);
        this.loaderService.loadingDismiss()
        console.log(res);
        if(res.statusCode === 200 || res.status === 200){
          this.toastService.showSuccess('Complaint Successfully Registered', 'Thank You');
          this.raisecomplaint.reset();
          this.raisecomplaint.setErrors(null); 
          this.raisecomplaint.updateValueAndValidity();
          this.showText = false;
          this.complaintImagesUrl = [];
          this.complaintImages = [];
          this.videoObject = {};
          this.vthumbnail = "";
          this.routerServices.navigate(['/viewcomplaints'], { replaceUrl: true });
        }
      }, error => { // (**)
        console.log(error);
        this.loaderService.loadingDismiss()
        this.toastService.showError(`The unknown error has occurred: ${error}`, 'Alert');
      });
    });
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
      },
      error => {
        localStorage.setItem("locationserviceenabled", "false");
      }
    );
  }

  svtypeValue(event) {
    console.log('svtSelected', event.target.value);
    this.svtSelected = event.target.value;
  }

  async viewMapModal() {
    const modal = await this.modalController.create({
      component: ViewmapmodalPage,
      swipeToClose: true,
      cssClass: 'viewMapCreatev'
    });
    return await modal.present();
  }

  async openViewer() {
    const modal = await this.modalController.create({
      component: ViewerModalComponent,
      cssClass: 'ion-image-viewers',
      keyboardClose: true,
      showBackdrop: true
    });
    return await modal.present();
  }

  getAgencies() {
    this.mService.getAgencies().subscribe((res: any) => {
      if (res.statusCode == 200) {
        this.listAgencies = res.data;
      }
      else {
        this.listAgencies = [];
      }
    })
  }

  getPriorities() {
    this.mService.getPriorities().subscribe((res: any) => {
      if (res.statusCode == 200) {
        this.listPriorities = res.data;
      }
      else {
        this.listPriorities = [];
      }
    })
  }

  getComplaintAreas() {
    console.log("this.areaRequired", this.areasRequired);
    this.mService.getComplaintAreas().subscribe((res: any) => {
      if (res.statusCode == 200) {
        if (this.areasRequired=="1") {
          this.listComplaintAreas = res.data;
        }
        else
        {
          let gpsObject = [{
            "id": "0",
            "sector": "0",
            "customer_area": "0",
            "description_en": "GPS",
            "description_ar": "GPS"
          }]
  
          this.listComplaintAreas = gpsObject;
        }
        console.log(this.listComplaintAreas)
      }
      else {
        this.listComplaintAreas = [];
      }
    })
  }

  getComplaintTypes(agency_id: any) {
    let body = {
      "agency_id": agency_id
    }
    this.mService.getComplaintTypes(body).subscribe((res: any) => {
      if (res.statusCode == 200) {
        this.listComplaintTypes = res.data;
      }
      else {
        this.listComplaintTypes = [];
      }
    })
  }

  selectcomplainttype(event:any)
  {
    this.raisecomplaint.controls['areaname'].setValue('');
    console.log(event);
    let agency = event.target.value;
    console.log(agency);
    this.getComplaintTypes(agency);

    let agencyInfo:any = this.listAgencies.filter((item:any)=>{
      return item.id == agency;//item.areas_required
    })
    console.log("agencyInfo", agencyInfo);
    this.areasRequired = agencyInfo[0].areas_required;
    this.getComplaintAreas();
  }

  selectArea(event: {
    component: IonicSelectableComponent,
    value: any,
  })
  {
    console.log(event.value.id)
    if(event.value.id=='0')
    {
     this.areaSector = '0'
    }
    else
    {
      if (this.listComplaintAreas && this.listComplaintAreas.length > 0) {
        this.areaSector = this.listComplaintAreas.find(item => item.id == event.value.id).sector;
        console.log("this.areaSector",this.areaSector);
      }
      // this.areaSector = this.listComplaintAreas.find(item => item.id == event.target.value).sector;

      
    }
    
  }

  onClearArea(event: {
    component: IonicSelectableComponent,
    items: any[]
  }) {
    event.component.clear();
  }


  async complaintImageCapture(){
    this.loaderService.loadingPresent();
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
        console.log(compressedBlob,"compressedBlob");
        const random = Math.floor(Math.random() * (999999 - 100000)) + 100000000000000000;
        const imageFile = random + '.jpg';
        const formData = new FormData();
        formData.append('complaint_proof_image', compressedBlob, imageFile);
        this.mService.complaintsImgUpload(formData).subscribe((resp: any)=>{
          if(resp.statusCode === 200){
            this.loaderService.loadingDismiss();
            console.log('resp', resp);
            this.complaintImg = resp.data;
            this.complaintImages.push(this.complaintImg);
            console.log(this.complaintImages,"Complaint Images");
          }
          else{
            this.toastService.showError('Something went wrong', 'Error')
          }
        })
      }).catch((error)=>{
        console.error("Error compressing image:", error);
        this.toastService.showError("Error compressing image. Please try again.", "Error");
      })
      // const blob = this.b64toBlob(realData, 'image/jpeg');
    }, (err) => {
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




  b64toBlob(b64Data, contentType) {
    contentType = contentType || '';
    let sliceSize = 512;
    let byteCharacters = atob(b64Data);
    let byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);

      let byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      let byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    let blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }


  // upload video

  // videoRecord() {
  
  //   this.androidPermissions.hasPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
  //      .then(status => {
  //        if (status.hasPermission) {
  //          this.captureVideo();
  //        } else {
  //          this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
  //            .then(status => {
  //              if (status.hasPermission) this.captureVideo();
  //            });
  //        }
  //      });
  //  }
 
  //   captureVideo() {
  //    this.loaderService.loadingPresent();
  //    let options: CaptureVideoOptions = { limit: 1, duration: 20, quality: 0.5 };
  //    this.mediaCapture.captureVideo(options)
  //      .then(
  //        (data: any) => {
  //          this.isvideoCaptured = true;
  //          this.toastService.showSuccess("Video upload in process......","Please Wait");
  //          let capturedVid = data[0];
  //          console.log("1 video data",capturedVid);
  //          let localVideoPath = capturedVid.fullPath;
  //          console.log("2 video path",localVideoPath);
  //          let directoryPath = localVideoPath.substr(0, localVideoPath.lastIndexOf('/'));
  //          let fileName = localVideoPath.substr(localVideoPath.lastIndexOf('/') + 1).replace(/[^a-zA-Z0-9-_\.]/g, '');
  //          this.uploadPhoto(localVideoPath);
  //        },
  //        (err: CaptureError) => {
  //          console.error(err);
  //          this.toastService.showError(err, "Alert");
  //          this.loaderService.loadingDismiss();
  //        }
  //       );
  //   }

  //   private uploadPhoto(imageFileUri: any): void{
   
  //     this.file.resolveLocalFilesystemUrl(imageFileUri).then((entry) => (<FileEntry>entry).file(file => this.readFile(file)))
  //     .catch(err => console.log(err)
  //     );
  //   }
  
  //   private readFile(file: any){
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       const formData = new FormData();
  //       const imgBlob = new Blob([reader.result], {type:file.type});
  //       formData.append('file', imgBlob, file.name);
  //       this.saveStandard(formData);
  //     }
  //     reader.readAsArrayBuffer(file);
  //   }
  
  //    saveStandard(receivedStandardInfo:any){
  //     return new Promise((resolve, reject) => {
  //      this.mService.complaintVideo(receivedStandardInfo).subscribe((resp: any)=>{    
  //         console.log("video resp", resp.data);
  //         if(resp.statusCode === 200){
  //           console.log("video resp", resp.data[0]);
  //           this.videoData = resp.data[0];
  //           this.toastService.showSuccess("Success","Video Uploaded Successfully");
  //           this.zone.run(() => {
  //               this.showText = true;
  //               console.log("showText",this.showText);
  //           })
  //           this.loaderService.loadingDismiss();
  //           console.log("this.videoData",this.videoData);
            
  //         }
  //         else{
  //           this.toastService.showError("Video Not Uploaded","Error");
  //           this.loaderService.loadingDismiss();
  //         }
  //         resolve(resp);
  //       }, (err) => {
  //         this.toastService.showError("Video Not Uploaded","Error");
  //         this.loaderService.loadingDismiss();
  //             console.log(err);
  //             reject(err);
  //           });
  //     }).catch(error => { this.loaderService.loadingDismiss();console.log('caught', error.message); });
  //   }

  videoRecord() {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
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
    let options: CaptureVideoOptions = { limit: 1, duration: 20, quality: 0.5 };
    this.mediaCapture.captureVideo(options)
      .then(
        (data: MediaFile[]) => {
          this.isvideoCaptured = true;
          this.toastService.showSuccess("Video upload in process......", "Please Wait");
          let capturedVid = data[0];
          console.log("1 video data", capturedVid);
          let localVideoPath =  capturedVid.fullPath;
          console.log("2 video path", localVideoPath);
          this.compressAndUploadVideo(localVideoPath);
          // this.uploadVideo(localVideoPath);
        },
        (err: CaptureError) => {
          console.error(err);
          this.toastService.showError("Video not uploaded", "Alert");
          this.loaderService.loadingDismiss();
        }
      );
  }

  private compressAndUploadVideo(videoUri: string): void {
    this.getFileSize(videoUri).then(originalSize => {
      console.log("Original video size (in bytes):", originalSize);
      if(localStorage.getItem('isOnline') != "true"){
        this.storeVideoInMobileStorage(videoUri);
      }
      else{
              // Compress video
      this.videoEditor.transcodeVideo({
        fileUri: videoUri,
        outputFileName: 'compressed_' + new Date().getTime(),
        outputFileType: this.videoEditor.OutputFileType.MPEG4,
        saveToLibrary: true,
        width: 1280,  // Optional: Set a width for resizing
        height: 720,  // Optional: Set a height for resizing
        // Optional: Restrict video duration (in seconds)
      }).then((compressedUri: any) => {
        console.log("video uri", videoUri);
        console.log("compressesdurl", compressedUri);
        
        // Ensure the compressedUri has the 'file://' prefix
        const formattedCompressedUri = compressedUri.startsWith('file://') ? compressedUri : 'file://' + compressedUri;
        console.log("Compressed video URI:", formattedCompressedUri);
  
        this.getFileSize(formattedCompressedUri).then(compressedSize => {
          console.log("Compressed video size (in bytes):", compressedSize);
  
          // Proceed with uploading the compressed video
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
      }
    }).catch(err => {
      console.error("Error retrieving original video size", err);
    });
  }

  private getFileSize(fileUri: string): Promise<number> {
    return this.file.resolveLocalFilesystemUrl(fileUri)
      .then((entry: FileEntry) => new Promise<number>((resolve, reject) => {
        entry.file(file => resolve(file.size), err => reject(err));
      }));
  }

  private storeVideoInMobileStorage(imageFileUri: any): void {
    /* specify the directory and filename where you want to save the video */
    console.log(imageFileUri);
    let filePath = this.file.externalDataDirectory + "complaintDocs";
    const random = Math.floor(Math.random() * (999999 - 100000)) + 100000000000000000;
      const imageFle = random + '.mp4';
    this.file.writeFile(filePath,imageFle,'video.mp4', { replace: true })
        .then((success) => {
            this.loaderService.loadingDismiss();
            this.toastService.showSuccess("Video Stored in Mobile Storage Successfully", "success");
            this.zone.run(() => {
              this.showText = true;
              console.log("showText",this.showText);
          })
          this.videoData.push(imageFle);
        })
        .catch((err) => {
            this.loaderService.loadingDismiss();
            console.log("Error Occurred While Storing Video in Mobile Storage", err);
        });
    }


  // private uploadVideo(videoPath: string) {
  //   this.file.resolveLocalFilesystemUrl(videoPath)
  //     .then((entry: FileEntry) => {
  //       entry.file(file => this.readFile(file));
  //     })
  //     .catch(err => {
  //       console.error("Error resolving filesystem URL:", err);
  //       this.toastService.showError("Error preparing video for upload", "Error");
  //       this.loaderService.loadingDismiss();
  //     });
  // }

  private readFile(file: any) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const blob = new Blob([reader.result], { type: file.type });
      this.uploadBlob(blob, file.name);
    };
    reader.onerror = (error) => {
      console.error("Error reading file:", error);
      this.toastService.showError("Error preparing video for upload", "Error");
      this.loaderService.loadingDismiss();
    };
    reader.readAsArrayBuffer(file);
  }

  private uploadBlob(blob: Blob, fileName: string) {
    const formData = new FormData();
    formData.append('file', blob, fileName);
    
    this.mService.complaintVideo(formData).subscribe(
      (resp: any) => {
        console.log("video resp", resp);
        if (resp.statusCode === 200) {
          this.videoData = resp.data[0];
          this.toastService.showSuccess("Video Uploaded Successfully", "Success");
          this.zone.run(() => {
            this.showText = true;
          });
        } else {
          this.toastService.showError("Video Not Uploaded", "Error");
        }
        this.loaderService.loadingDismiss();
      },
      (err) => {
        console.error("Upload error:", err);
        this.toastService.showError("Video Upload Failed", "Error");
        this.loaderService.loadingDismiss();
      }
    );
  }


    onDelete(data: any){
      console.log("data",data);
      let payload = {
        imagename : data
      }
      this.mService.deleteComplaintImage(payload).subscribe((resp : any)=>{
        console.log(resp.data, "deleted");
          let indexToDelete= this.complaintImages.findIndex((each)=>{
            console.log(each[0]);
            return each[0] === data;
            })
            if (indexToDelete !== -1) {
              
              this.complaintImages.splice(indexToDelete, 1);
              console.log("Image deleted from array");
            } else {
              console.log("Image not found in array");
            }
            console.log(indexToDelete); 
      })
    }

  
}
