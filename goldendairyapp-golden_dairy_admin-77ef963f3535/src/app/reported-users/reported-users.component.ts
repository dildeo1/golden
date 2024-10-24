import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AppService } from '../app.service';

@Component({
  selector: 'app-reported-users',
  templateUrl: './reported-users.component.html',
  styleUrls: ['./reported-users.component.css']
})
export class ReportedUsersComponent implements OnInit {
  skip: number = 0;
  currentPage: number = 1;
  limit = this._appService.limit;
  isTableloading: boolean = false;
  TotalItems: any;
  tableList: any = []
  Report_Status = new FormControl(null)
  constructor(
    private nzMessageService: NzMessageService,
    public _appService: AppService
  ) { }

  ngOnInit() {
    this.Report_Status.valueChanges.subscribe((data:any)=>{
      this.skip =0
      this.getTablelist()
    })
    this.getTablelist()
  }
  getTablelist() {
    this.isTableloading = true
    let body = {
      skip: this.skip,
      limit: this.limit,
      Whether_Report_Filter:this.Report_Status.value == null?false:true,
      Report_Status:this.Report_Status.value

    }
    try {

      this._appService.postMethod_admin('List_All_Reported_Users', body)
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
    this.getTablelist()
  }
  onChangeStatus(data:any,type:number) {
    const body = {
      Reported_USERID: data.Reported_USERID,
    }
    try {
      this._appService.postMethod_admin(type==1?'Approve_Reported_User':type==2?'Reject_Reported_User':'', body)
        .subscribe(resp => {
          if (resp.success) {
            this.nzMessageService.success(resp.extras.Status)
            this.skip = 0
            this.getTablelist()
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
    } catch (e) {

    }
  }
}
