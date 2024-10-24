import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AppService } from '../app.service';

@Component({
  selector: 'app-District-section',
  templateUrl: './District-section.component.html',
  styleUrls: ['./District-section.component.css']
})
export class DistrictSectionComponent implements OnInit {
  isEditing = false
  isAdding = false

  DistrictList:any=[];
  StatesList:any=[];
  Status:any;



  skip=0;
  currentPage: number = 1;

  limit = this._appService.limit;
  isTableloading: boolean=false;
  TotalItems: any;
  Count: any;
  selectedData:any
  isAddBtnLoading: boolean=false;
  addForm:any= FormGroup;

  onEditOpen = false
  StateID = new FormControl(null)
  Search = new FormControl('')


 



  constructor( private fb: FormBuilder,
    private nzMessageService: NzMessageService,
    public _appService: AppService) { }

  ngOnInit() {
    this.getStatesList()
    this.addForm = this.fb.group({
      District_Name: [null, [Validators.required]],
      State_Name: [null, [Validators.required]],

    });
    this.StateID.valueChanges.subscribe((data)=>{
      this.skip =0
      this.getDistrictList()
    })
    this.Search.valueChanges.subscribe((data)=>{
      this.skip =0
      this.getDistrictList()
    })
    this.onTabClick(true)

  }

  onAdd(){
    this.isAdding=true
    this.isEditing=false
  }

getDistrictList(){
  this.isTableloading = true
let body = {
  skip: this.skip,
  limit: this.limit,
  Whether_Search_Filter:this.Search.value.length>0?true:false,
  Search:this.Search.value,
  status:this.Status,
  Whether_State_Filter :this.StateID.value==null?false:true,
  StateID:this.StateID.value

}
try {

  this._appService.postMethod_admin('Fetch_All_Districts', body)
    .subscribe(resp => {
      if (resp.success) {
        this.isTableloading = false
        if (this.skip == 0) {
          this.currentPage = 1
          this.Count = resp.extras.Count
        }
       
        this.DistrictList = resp.extras.Data
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

onNextPage(event:number) {
  this.currentPage = event
  this.skip = (event - 1) * this.limit
  this.getDistrictList()
}

onEdit(data:any){
  this.isEditing = true
  this.isAdding = true
  this.selectedData = data
  this.addForm.patchValue({
  District_Name: data.DistrictName,
  State_Name:data.StateId
  })
}

onClose(){
  this.isAdding = false;
  this.isEditing = false
  this.addForm.reset()
  this.isAddBtnLoading=false
}

onsubmit(){
  this.isAddBtnLoading = true
  let body = {}
  let url = ''
  if (this.isEditing) {
    body = {
      DistrictName: this.addForm.value.District_Name,
      DistrictId:this.selectedData.DistrictId,
      status: this.selectedData.status

    }
    url = 'Edit_District'
  }
  else {
    body = {
      DistrictName: this.addForm.value.District_Name,
      StateId:this.addForm.value.State_Name,

    }
    url = 'Create_District'
  }
  try {

    this._appService.postMethod_admin(url, body)
      .subscribe((resp: any) => {
        if (resp.success) {
          this.onClose()
          this.getDistrictList()
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

onTabClick(tabNumber: boolean) {
  this.Status = tabNumber,
  this.skip=0
  this.getDistrictList()
  
}


getStatesList() {
  let body = {
    skip: 0,
    limit: 10000,
    Whether_Search_Filter: false,
    Search: '',
    status:true

  }
  try {

    this._appService.postMethod_admin('Fetch_All_States', body)
      .subscribe(resp => {
        if (resp.success) {
        

          this.StatesList = resp.extras.Data
         
        } else {
          this.nzMessageService.error(resp.extras.msg);
        }
      },
        error => {
          this.nzMessageService.error(error.error.extras.msg);
        })

  } catch (e) { }

}



onAction(data: any) {
  let body = {}
  if (data.status) {
    body = {
      DistrictName: data.DistrictName,
      DistrictId:data.DistrictId,
      status: false

    }
  } else {
    body = {
      DistrictId:data.DistrictId,
      DistrictName: data.DistrictName,
      status: true

    }
  }
  let url = 'Edit_District'

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
          this.getDistrictList()
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



}
