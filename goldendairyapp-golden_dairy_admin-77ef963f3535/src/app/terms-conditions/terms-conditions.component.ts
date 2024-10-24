import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AppService } from '../app.service';

@Component({
  selector: 'app-terms-conditions',
  templateUrl: './terms-conditions.component.html',
  styleUrls: ['./terms-conditions.component.css']
})
export class TermsConditionsComponent implements OnInit {
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

  Link:string = ''
  Description:string = ''
  
  ckeConfig: any;
  Search = new FormControl('')

  constructor(
    private fb: FormBuilder,
    private nzMessageService: NzMessageService,
    public _appService: AppService
  ) { }

  ngOnInit() {
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
      Status: this.Status,
      Whether_Search_Filter: this.Search.value.length > 0 ? true : false,
      Search: this.Search.value,

    }
    try {

      this._appService.postMethod_admin('List_All_TC', body)
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
  onNextPage(event: number) {
    this.currentPage = event
    this.skip = (event - 1) * this.limit
    this.getTableList()
  }
  onAction(data: any) {
    let body = {}
    if (data.Status) {
      body = {
        TermsConditionsID: data.TermsConditionsID,
        Status: false

      }
    } else {
      body = {
        TermsConditionsID: data.TermsConditionsID,
        Status: true

      }
    }
    let url = 'Edit_TC'

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
    this.Link = this.selectedData.Link
    this.Description = this.selectedData.Description
  }

  onClose() {
    this.isAdding = false;
    this.isEditing = false
    this.Link = ''
    this.Description = ''
    this.isAddBtnLoading = false
  }
  onsubmit() {
    this.isAddBtnLoading = true
    let body = {}
    let url = ''
    if (this.isEditing) {
      body = {
        TermsConditionsID: this.selectedData.TermsConditionsID,
        Description: this.Description,
        Link: this.Link
      }
      url = 'Edit_TC'
    }
    else {
      body = {
        Description: this.Description,
        Link: this.Link

      }
      url = 'Create_TC'
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
}
