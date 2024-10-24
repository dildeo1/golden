import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  LoginForm:any= FormGroup;

  condition: boolean = false;
  constructor(private router: Router,
    private fb: FormBuilder,
    public _appService: AppService,
    private nzMessageService: NzMessageService,
    private _cookie_Service:CookieService
  ) { }

  ngOnInit() {
    this.LoginForm = this.fb.group({
      EmailID: [null, [Validators.required]],
      Password: [null, [Validators.required]],

    });
  }
  signInButton() {
    this.condition = false
  }
  signUpButton() {
    this.condition = true
  }
  submitForm() {
    for (const i in this.LoginForm.controls) {
      this.LoginForm.controls[i].markAsDirty();
      this.LoginForm.controls[i].updateValueAndValidity();
    }
    const body = {

      EmailID: this.LoginForm.value.EmailID,
      Password: this.LoginForm.value.Password,
    }

    try {

      this._appService.postMethod_admin('Login', body)
        .subscribe((resp: any) => {
          if (resp.success) {
            this._cookie_Service.set("GDairyadminData", JSON.stringify(resp.extras.AdminData))
            this.router.navigateByUrl('/dashboard')
          } else {
            this.nzMessageService.error(resp.extras.msg)
          }
        },
          resp => {
            if(resp.error.extras.code ==1 || resp.error.extras.code =='1'){
              // this.nzMessageService.error(resp.error.extras.msg);
              this._appService.sessionHandling()
            }else {
              this.nzMessageService.error(resp.error.extras.msg);

            }
            //Minor Chnages
          }
          )
    } catch (e) { }

  }

}
