import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {
  isCardLoading: boolean=false;
  AdminInfo: any={};

  constructor(
    private nzMessageService: NzMessageService,
    public _appService: AppService
  ) { }

  ngOnInit() {
    this.getAdminInfo()
  }
  getAdminInfo() {
    this.isCardLoading = true
    const body = {};
    try {
      this._appService
        .postMethod_admin('Fetch_Admin_Complete_Information', body)
        .subscribe(
          (resp) => {
            if (resp.success) {
              this.isCardLoading = false
              this.AdminInfo = resp.extras.Data;              
            } else {
              this.isCardLoading = false
              this.nzMessageService.error(resp.extras.msg);
            }
          },
          (resp) => {
            this.isCardLoading = false
            if(resp.error.extras.code ==1 || resp.error.extras.code =='1'){
              this._appService.sessionHandling()
            }else {
              this.nzMessageService.error(resp.error.extras.msg);

            }
          }
        );
    } catch (e) {}
  }
}
