import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AppService } from '../app.service';

@Component({
  selector: 'app-rating-term',
  templateUrl: './rating-term.component.html',
  styleUrls: ['./rating-term.component.css']
})
export class RatingTermComponent implements OnInit {
  skip: number = 0;
  currentPage: number = 1;
  limit = this._appService.limit;
  isTableloading: boolean = false;
  TotalItems: any;
  tableList: any = []
  BusinessList: any = []

  Status: boolean = true;
  selectedData: any

  isEditing = false
  isAdding = false
  isAddBtnLoading: boolean = false;
  addForm: any = FormGroup;
  constructor(
    private fb: FormBuilder,
    private nzMessageService: NzMessageService,
    public _appService: AppService
  ) { }

  ngOnInit() {
    this.addForm = this.fb.group({
      RatingTerm: [null, [Validators.required]],
      BusinessType: [[]]

    });
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
      Status: this.Status

    }
    try {

      this._appService.postMethod_admin('List_All_Rating_Terms', body)
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
        RatingID: data.RatingID,
        Status: false

      }
    } else {
      body = {
        RatingID: data.RatingID,
        Status: true

      }
    }
    let url = 'Edit_Rating_Term'

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





  getBusinessList() {
    let body = {
      skip: 0,
      limit: 1000000,
      Whether_Search_Filter: false,
      Search: '',
      status: true
    }
    try {

      this._appService.postMethod_admin('Fetch_All_Businesses', body)
        .subscribe(resp => {
          if (resp.success) {
            this.BusinessList = resp.extras.Data
          } else {
            this.nzMessageService.error(resp.extras.msg);
          }
        },
          error => {
            this.nzMessageService.error(error.error.extras.msg);
          })

    } catch (e) { }
  }

  onDelete(data: any) {
    let body = {}
    body = {
      RatingID: data.RatingID,

    }
    let url = 'Delete_Rating_Term'

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
    this.getBusinessList()
  }

  onEdit(data: any) {
    this.isEditing = true
    this.isAdding = true
    this.selectedData = data
    this.addForm.patchValue({
      RatingTerm: data.RatingTerm,
      BusinessType: data.BusinessType
    }, { emitEvent: false })
    this.getBusinessList()
  }

  onClose() {
    this.isAdding = false;
    this.isEditing = false
    this.addForm.reset()
    this.isAddBtnLoading = false
  }
  onsubmit() {
    this.isAddBtnLoading = true
    let body = {}
    let url = ''
    if (this.isEditing) {
      body = {
        RatingTerm: this.addForm.value.RatingTerm,
        BusinessType: this.addForm.value.BusinessType,
        RatingID: this.selectedData.RatingID,
        Status: this.selectedData.Status,

      }
      url = 'Edit_Rating_Term'
    }
    else {
      body = {
        RatingTerm: this.addForm.value.RatingTerm,
        BusinessType: this.addForm.value.BusinessType,

      }
      url = 'Create_Rating_Term'
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
