import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AppService } from '../app.service';

@Component({
  selector: 'app-Business-section',
  templateUrl: './Business-section.component.html',
  styleUrls: ['./Business-section.component.css']
})
export class BusinessSectionComponent implements OnInit {
  isAdding=false
  isEditing=false
  Status:any;
  skip=0
  BusinessList:any=[]
  isTableloading:boolean=false
  limit = this._appService.limit;
  currentPage: number = 1;
  Count: any;
  isAddBtnLoading: boolean = false;
  TotalItems: any;
  selectedData: any
  addForm: any = FormGroup;

  Search = new FormControl('')




  constructor(private fb: FormBuilder,
    private nzMessageService: NzMessageService,
    public _appService: AppService) { }

  ngOnInit() {
    this.addForm = this.fb.group({
      Business_Name: [null, [Validators.required]],
      isSubscriptionAllowed: [null, [Validators.required]],
    })
    this.Search.valueChanges.subscribe((data) => {
      this.skip = 0
      this.getBusinessList()
    })
    this.onTabClick(true)
  }

  onAdd(){
    this.isAdding=true
    this.isEditing=false
  }

  onTabClick(tabNumber:boolean){
    this.Status=tabNumber
    this.skip=0
    this.getBusinessList()

  }

  getBusinessList(){
    this.isTableloading=true
    let body = {
      skip: this.skip,
      limit: this.limit,
      Whether_Search_Filter: this.Search.value.length > 0 ? true : false,
      Search: this.Search.value,
      status:this.Status
  }
  try {
  
    this._appService.postMethod_admin('Fetch_All_Businesses', body)
      .subscribe(resp => {
        if (resp.success) {
          this.isTableloading = false
          if (this.skip == 0) {
            this.currentPage = 1
            this.Count = resp.extras.Count
          }
  
          this.BusinessList = resp.extras.Data
          this.Count = resp.extras.Count
        } else {
          this.isTableloading = false
          this.nzMessageService.error(resp.extras.msg);
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

  onEdit(data:any){
    this.isEditing = true
    this.isAdding = true
    this.selectedData = data
    this.addForm.patchValue({
    Business_Name:data.BusinessName,
    isSubscriptionAllowed:data.isSubscriptionAllowed,
    })
  }


  onAction(data: any) {
    let body = {}
    if (data.status) {
      body = {
        BusinessName: data.BusinessName,
        BusinessId:data.BusinessId,
        status: false
  
      }
    } else {
      body = {
        BusinessName: data.BusinessName,
        BusinessId:data.BusinessId,
        status: true
  
      }
    }
    let url = 'Edit_Business'
  
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
            this.getBusinessList()
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
    this.getBusinessList()
  }

  onClose(){
    this.isAdding = false;
    this.isEditing = false
    this.addForm.reset({
      isSubscriptionAllowed:false
    })
    this.isAddBtnLoading=false
  }

  onsubmit(){
    this.isAddBtnLoading = true
    let body = {}
    let url = ''
    if (this.isEditing) {
      body = {
        BusinessName: this.addForm.value.Business_Name,
        isSubscriptionAllowed: this.addForm.value.isSubscriptionAllowed,
        BusinessId:this.selectedData.BusinessId,
        status: this.selectedData.status
  
      }
      url = 'Edit_Business'
    }
    else {
      body = {
        BusinessName: this.addForm.value.Business_Name,
        isSubscriptionAllowed: this.addForm.value.isSubscriptionAllowed,
        // status:true,
  
      }
      url = 'Create_Business'
    }
    try {
  
      this._appService.postMethod_admin(url, body)
        .subscribe((resp: any) => {
          if (resp.success) {
            this.onClose()
            this.getBusinessList()
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


}
