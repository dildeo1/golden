import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AppService } from '../app.service';
import { HttpRequest, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-banners',
  templateUrl: './banners.component.html',
  styleUrls: ['./banners.component.css']
})
export class BannersComponent implements OnInit {
  skip: number = 0;
  currentPage: number = 1;
  limit = this._appService.limit;
  isTableloading: boolean = false;
  TotalItems: any;
  tableList: any = []

  Status: boolean = true;
  selectedData: any

  isEditing = false
  isAdding = false
  isAddBtnLoading: boolean = false;
  addForm: any = FormGroup;
  isMobileImageUploading: boolean = false;
  MobileImageData: any = []

  isWebImageUploading: boolean = false;
  WebImageData: any = []

  Search = new FormControl('')

  constructor(
    private fb: FormBuilder,
    private nzMessageService: NzMessageService,
    public _appService: AppService
  ) { }

  ngOnInit() {
    this.addForm = this.fb.group({
      SNO: [null, [Validators.required]],
      Description: [null, [Validators.required]],

    });
    this.Search.valueChanges.subscribe((data) => {
      this.skip = 0
      this.getTableList()
    })
    this.onTabClick(true)
  }
  onTabClick(tabNumber: boolean) {
    this.Status = tabNumber,
      this.skip = 0
    this.getTableList()

  }
  getTableList() {
    this.isTableloading = true
    let body = {
      skip: this.skip,
      limit: this.limit,
      Whether_Status_Filter: true,
      Status: this.Status,
      Whether_Search_Filter: this.Search.value.length > 0 ? true : false,
      Search: this.Search.value,

    }
    try {

      this._appService.postMethod_admin('List_All_Banners', body)
        .subscribe(resp => {
          if (resp.success) {
            this.isTableloading = false
            if (this.skip == 0) {
              this.currentPage = 1
              this.TotalItems = resp.extras.Count
            }
            this.TotalItems = resp.extras.Count
            this.tableList = resp.extras.Data

          } else {
            this.isTableloading = false
            this.nzMessageService.error(resp.extras.msg);
          }
        },
          (resp) => {
            this.isTableloading = false
            if(resp.error.extras.code ==1 || resp.error.extras.code =='1'){
              this._appService.sessionHandling()
            }else {
              this.nzMessageService.error(resp.error.extras.msg);

            }
          })

    } catch (e) { }

  }
  onNextPage(event: number) {
    this.currentPage = event
    this.skip = (event - 1) * this.limit
    this.getTableList()
  }
  onAction(data: any) {
    let body = {}
    if (data.Status) {
      body = {
        BannerID: data.BannerID,
        Status: false

      }
    } else {
      body = {
        BannerID: data.BannerID,
        Status: true

      }
    }
    let url = 'Edit_Banner'

    try {
      this._appService.postMethod_admin(url, body)
        .subscribe(resp => {
          if (resp.success) {
            let msg;
            if (data.Status) {
              msg = 'Inactivated Successfully'
            } else {
              msg = 'Activated Successfully'
            }
            this.nzMessageService.success(msg)
            this.getTableList()
          } else {
            this.nzMessageService.error(resp.extras.msg)

          }
        },
          resp => {

            if(resp.error.extras.code ==1 || resp.error.extras.code =='1'){
              this._appService.sessionHandling()
            }else {
              this.nzMessageService.error(resp.error.extras.msg);

            }
          })
    } catch (e) { }


  }

  onAdd() {
    this.isAdding = true
    this.isEditing = false
  }

  onEdit(data: any) {
    this.isEditing = true
    this.isAdding = true
    this.selectedData = data
    this.addForm.patchValue({
      SNO: data.SNO,
      Description: data.Description
    }, { emitEvent: false })

    if (this.selectedData.Whether_Mobile_Image_Available) {
      this.MobileImageData = []
      this.MobileImageData.push(this.selectedData.Mobile_Image_Data)
    }
    if (this.selectedData.Whether_Web_Image_Available) {
      this.WebImageData = []
      this.WebImageData.push(this.selectedData.WebImageData)
    }
  }

  onClose() {
    this.isAdding = false;
    this.isEditing = false
    this.addForm.reset()
    this.isAddBtnLoading = false
    this.isMobileImageUploading = false
    this.MobileImageData = []
    this.isWebImageUploading = false
    this.WebImageData = []
  }
  onsubmit() {
    this.isAddBtnLoading = true
    let body = {}
    let url = ''
    if (this.isEditing) {
      body = {
        SNO: +this.addForm.value.SNO,
        Description: this.addForm.value.Description,
        BannerID: this.selectedData.BannerID,

        Whether_Mobile_Image_Available: this.MobileImageData.length > 0 ? true : false,
        Mobile_ImageID: this.MobileImageData.length > 0 ? this.MobileImageData[0].ImageID : '',

        Whether_Web_Image_Available: this.WebImageData.length > 0 ? true : false,
        Web_ImageID: this.WebImageData.length > 0 ? this.WebImageData[0].ImageID : ''

      }
      url = 'Edit_Banner'
    }
    else {
      body = {
        SNO: +this.addForm.value.SNO,
        Description: this.addForm.value.Description,

        Whether_Mobile_Image_Available: this.MobileImageData.length > 0 ? true : false,
        Mobile_ImageID: this.MobileImageData.length > 0 ? this.MobileImageData[0].ImageID : '',

        Whether_Web_Image_Available: this.WebImageData.length > 0 ? true : false,
        Web_ImageID: this.WebImageData.length > 0 ? this.WebImageData[0].ImageID : ''

      }
      url = 'Create_Banner'
    }
    try {

      this._appService.postMethod_admin(url, body)
        .subscribe((resp: any) => {
          if (resp.success) {
            this.onClose()
            this.getTableList()
            this.nzMessageService.success(resp.extras.Status)


          } else {
            this.isAddBtnLoading = false
            this.nzMessageService.error(resp.extras.msg)
          }
        },
          resp => {
            this.isAddBtnLoading = false
            if(resp.error.extras.code ==1 || resp.error.extras.code =='1'){
              this._appService.sessionHandling()
            }else {
              this.nzMessageService.error(resp.error.extras.msg);

            }
          })
    } catch (e) { }
  }


  beforeUploadMobile = (file: any): boolean => {
    this.isMobileImageUploading = true
    this.postMethodImage(file,1)
    return false;
  }
  beforeUploadWeb = (file: any): boolean => {
    this.isWebImageUploading = true
    this.postMethodImage(file,2)
    return false;
  }
  postMethodImage(imageFile: any,type:number) {
    const formData = new FormData();
    let url = 'Upload_Image'
    let key = 'image'

    formData.append(key, imageFile);
    const req = new HttpRequest('POST', this._appService.ImageUrl + url, formData, {
      reportProgress: true,
      withCredentials: false
    });
    this._appService.onUploadFile(req)
      .subscribe(
        (event: any) => {
          if (event instanceof HttpResponse) {
            if(type ==1){
              this.MobileImageData = []
              this.MobileImageData.push(event.body.extras)
              this.nzMessageService.success(' Image Upoladed Sucessfully')
              this.isMobileImageUploading = false
            }else if(type ==2){
              this.WebImageData = []
              this.WebImageData.push(event.body.extras)
              this.nzMessageService.success(' Image Upoladed Sucessfully')
              this.isWebImageUploading = false
            }
           
            // this.onCloseImageDrawer()

          } else if (event instanceof HttpResponse) {
            this.isMobileImageUploading = false
            this.isWebImageUploading = false
          }
        },
        resp => {
          this.isMobileImageUploading = false
          this.isWebImageUploading = false
          this.nzMessageService.error(resp.error.extras.msg);
        }

      );
  }
  onRemove(type: number) {
    if (type == 1) {
      this.MobileImageData = []
    } else if (type == 2) {
      this.WebImageData = []
    }

  }
}
