import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AppService } from '../app.service';

@Component({
  selector: 'app-State-module',
  templateUrl: './State-module.component.html',
  styleUrls: ['./State-module.component.css']
})
export class StateModuleComponent implements OnInit {
  isEditing = false
  isAdding = false

  skip = 0;
  StateList: any = [];
  currentPage: number = 1;

  limit = this._appService.limit;
  isTableloading: boolean = false;
  TotalItems: any;
  Count: any;
  selectedData: any
  isAddBtnLoading: boolean = false;
  addForm: any = FormGroup;
  onEditOpen = false
  Status: any;

  Search = new FormControl('')




  constructor(private fb: FormBuilder,
    private nzMessageService: NzMessageService,
    public _appService: AppService) { }

  ngOnInit() {
    this.addForm = this.fb.group({
      State_Name: [null, [Validators.required]],
    });
    this.Search.valueChanges.subscribe((data) => {
      this.skip = 0
      this.getStateList()
    })
    this.onTabClick(true)
  }

  onAdd() {
    this.isAdding = true
    this.isEditing = false
  }

  getStateList() {
    this.isTableloading = true
    let body = {
      skip: this.skip,
      limit: this.limit,
      Whether_Search_Filter: this.Search.value.length > 0 ? true : false,
      Search: this.Search.value,
      status: this.Status

    }
    try {

      this._appService.postMethod_admin('Fetch_All_States', body)
        .subscribe(resp => {
          if (resp.success) {
            this.isTableloading = false
            if (this.skip == 0) {
              this.currentPage = 1
              this.Count = resp.extras.Count
            }

            this.StateList = resp.extras.Data
            this.Count = resp.extras.Count
          } else {
            this.isTableloading = false
            this.nzMessageService.error(resp.extras.msg);
          }
        },
          resp => {
            this.isTableloading = false
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
      this.skip = 0
    this.getStateList()
  }


  onNextPage(event: number) {
    this.currentPage = event
    this.skip = (event - 1) * this.limit
    this.getStateList()
  }

  onEdit(data: any) {
    this.isEditing = true
    this.isAdding = true
    this.selectedData = data
    this.addForm.patchValue({
      State_Name: data.StateName,
    })
  }

  onsubmit() {
    this.isAddBtnLoading = true
    let body = {}
    let url = ''
    if (this.isEditing) {
      body = {
        StateName: this.addForm.value.State_Name,
        StateId: this.selectedData.StateId,
        status: this.selectedData.status

      }
      url = 'Edit_State'
    }
    else {
      body = {
        StateName: this.addForm.value.State_Name,

      }
      url = 'Create_State'
    }
    try {

      this._appService.postMethod_admin(url, body)
        .subscribe((resp: any) => {
          if (resp.success) {
            this.onClose()
            this.getStateList()
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



  onClose() {
    this.isAdding = false;
    this.isEditing = false
    this.addForm.reset()
    this.isAddBtnLoading = false
  }

  onAction(data: any) {
    let body = {}
    if (data.status) {
      body = {
        StateName: data.StateName,
        StateId: data.StateId,
        status: false

      }
    } else {
      body = {
        StateId: data.StateId,
        StateName: data.StateName,
        status: true

      }
    }
    let url = 'Edit_State'

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
            this.getStateList()
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

