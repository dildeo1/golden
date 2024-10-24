import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AppService } from '../app.service';
import { HttpRequest, HttpResponse } from '@angular/common/http';


@Component({
  selector: 'app-Commodities-section',
  templateUrl: './Commodities-section.component.html',
  styleUrls: ['./Commodities-section.component.css']
})
export class CommoditiesSectionComponent implements OnInit {
  isAdding=false
  isEditing=false
  Status:any;
  skip=0;
  CommoditieList:any=[]
  isTableloading:boolean=false
  limit = this._appService.limit;
  currentPage: number = 1;
  Count: any;
  isAddBtnLoading: boolean = false;
  TotalItems: any;
  selectedData: any
  addForm: any = FormGroup;

  Search = new FormControl('')

  isMobileImageUploading: boolean = false;
  MobileImageData: any = []
  constructor(private fb: FormBuilder,
    private nzMessageService: NzMessageService,
    public _appService: AppService) { }

  ngOnInit() {
    this.addForm = this.fb.group({
      Commoditie_Name: [null, [Validators.required]],
    })
    this.Search.valueChanges.subscribe((data) => {
      this.skip = 0
      this.getCommoditieList()
    })
    this.onTabClick(true)
  }

  onAdd(){
    this.isAdding=true
   this. isEditing=false
  }

  onTabClick(tabNumber:boolean){
    this.Status=tabNumber
    this.skip=0
    this.getCommoditieList()
  }

  getCommoditieList(){
    this.isTableloading=true
    let body = {
      skip: this.skip,
      limit: this.limit,
      Whether_Search_Filter: this.Search.value.length > 0 ? true : false,
      Search: this.Search.value,
      status:this.Status
  }
  try {
  
    this._appService.postMethod_admin('Fetch_All_Commodities', body)
      .subscribe(resp => {
        if (resp.success) {
          this.isTableloading = false
          if (this.skip == 0) {
            this.currentPage = 1
            this.Count = resp.extras.Count
          }
  
          this.CommoditieList = resp.extras.Data
          this.Count = resp.extras.Count
        } else {
          this.isTableloading = false
          this.nzMessageService.error(resp.extras.msg);
        }
      },
        resp => {
          this.isTableloading =false
          if(resp.error.extras.code ==1 || resp.error.extras.code =='1'){
            this._appService.sessionHandling()
          }else {
            this.nzMessageService.error(resp.error.extras.msg);

          }
        })
  
  } catch (e) { }
  }

  onEdit(data:any){
    this.isEditing = true
    this.isAdding = true
    this.selectedData = data
    this.addForm.patchValue({
      Commoditie_Name:data.CommodityName
    })

    if (this.selectedData.Whether_Image_Available) {
      this.MobileImageData = []
      this.MobileImageData.push(this.selectedData.Image_Information)
    }

  }

  onAction(data:any){
    let body = {}
    if (data.status) {
      body = {
        CommodityName: data.CommodityName,
        CommodityId:data.CommodityId,
        status: false
  
      }
    } else {
      body = {
        CommodityName: data.CommodityName,
        CommodityId:data.CommodityId,
        status: true
  
      }
    }
    let url = 'Edit_Commodity'
  
    try {
      this._appService.postMethod_admin(url, body)
        .subscribe(resp => {
          if (resp.success) {
            let msg;
            if (data.status) {
              msg = 'Inactivated Successfully'
            } else {
              msg = 'Activated Successfully'
            }
            this.nzMessageService.success(msg)
            this.getCommoditieList()
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


  onNextPage(event: number){
    this.currentPage = event
    this.skip = (event - 1) * this.limit
    this.getCommoditieList()
  }

  onClose(){
    this.isAdding = false;
    this.isEditing = false
    this.addForm.reset()
    this.isAddBtnLoading=false
    this.MobileImageData = []

  }

  onsubmit(){
    this.isAddBtnLoading = true
    let body = {}
    let url = ''
    if (this.isEditing) {
      body = {
        CommodityName: this.addForm.value.Commoditie_Name,
        CommodityId:this.selectedData.CommodityId,
        status: this.selectedData.status,
        Whether_Image_Available: this.MobileImageData.length > 0 ? true : false,
        ImageID: this.MobileImageData.length > 0 ? this.MobileImageData[0].ImageID : '',
  
      }
      url = 'Edit_Commodity'
    }
    else {
      body = {
        CommodityName: this.addForm.value.Commoditie_Name,
        Whether_Image_Available: this.MobileImageData.length > 0 ? true : false,
        ImageID: this.MobileImageData.length > 0 ? this.MobileImageData[0].ImageID : '',
  
      }
      url = 'Create_Commodity'
    }
    try {
  
      this._appService.postMethod_admin(url, body)
        .subscribe((resp: any) => {
          if (resp.success) {
            this.onClose()
            this.getCommoditieList()
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
    this.postMethodImage(file)
    return false;
  }
  postMethodImage(imageFile: any) {
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
              this.MobileImageData = []
              this.MobileImageData.push(event.body.extras)
              this.nzMessageService.success(' Image Upoladed Sucessfully')
              this.isMobileImageUploading = false
           
            // this.onCloseImageDrawer()

          } else if (event instanceof HttpResponse) {
            this.isMobileImageUploading = false
          }
        },
        resp => {
          this.isMobileImageUploading = false
          this.nzMessageService.error(resp.error.extras.msg);
        }

      );
  }
  onRemove() {
      this.MobileImageData = []

  }
}
