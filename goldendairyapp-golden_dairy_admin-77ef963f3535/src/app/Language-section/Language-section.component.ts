import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AppService } from '../app.service';

@Component({
  selector: 'app-Language-section',
  templateUrl: './Language-section.component.html',
  styleUrls: ['./Language-section.component.css']
})
export class LanguageSectionComponent implements OnInit {
  isAdding=false
  isEditing=false
  Status:any;
  skip=0;
  LanguageList:any=[]
  isTableloading:boolean=false
  limit = this._appService.limit;
  currentPage: number = 1;
  Count: any;
  isAddBtnLoading: boolean = false;
  TotalItems: any;
  selectedData: any;
  addForm: any = FormGroup;
  type=1;

  constructor(private fb: FormBuilder,
    private nzMessageService: NzMessageService,
    public _appService: AppService) { }

  ngOnInit() {
    this.addForm = this.fb.group({
      Language_Name: [null, [Validators.required]],
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
    this.getLanguageList()

  }

getLanguageList(){
  this.isTableloading=true
  let body = {
    skip: this.skip,
    limit: this.limit,
    status:this.Status

    // Whether_Search_Filter: false,
    // Search: '',
    // type:this.type
}
try {

  this._appService.postMethod_admin('Fetch_All_Languages', body)
    .subscribe(resp => {
      if (resp.success) {
        this.isTableloading = false
        if (this.skip == 0) {
          this.currentPage = 1
          this.Count = resp.extras.Count
        }
        this.Count = resp.extras.Count
        this.LanguageList = resp.extras.Data
 
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
    Language_Name:data.language,
  })
}
// onAction(data:any){

// }

onAction(data:any){
  let body = {}
  if (data.status) {
    body = {
      language: data.language,
      LanguageId:data.LanguageID,
      status: false

    }
  } else {
    body = {
      language: data.language,
      LanguageId:data.LanguageID,
      status: true


    }
  }
  let url = 'Edit_Language'

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
          this.getLanguageList()
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
  this.getLanguageList()
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
      language: this.addForm.value.Language_Name,
      LanguageId:this.selectedData.LanguageID,
      status: this.selectedData.status

    }
    url = 'Edit_Language'
  }
  else {
    body = {
      language: this.addForm.value.Language_Name,
      // status:true,

    }
    url = 'Create_Language'
  }
  try {

    this._appService.postMethod_admin(url, body)
      .subscribe((resp: any) => {
        if (resp.success) {
          this.onClose()
          this.getLanguageList()
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
