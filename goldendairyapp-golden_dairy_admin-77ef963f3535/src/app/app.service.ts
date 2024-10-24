import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';


// import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  limit = 10
  Upload_Url =  `https://api.goldendiaryapp.com/upload/`
  constructor(private httpService: HttpClient,
    private _cookie_Service: CookieService,
    public nzMessageService: NzMessageService,
    private router: Router


  ) { }
  public readonly admin_Url = `https://api.goldendiaryapp.com/admin/`
  public readonly ImageUrl = `https://api.goldendiaryapp.com/upload/`

  postMethod_admin(posturl: string, body: any): Observable<any> {
    if (this._cookie_Service.check('GDairyadminData')) {
      let data = JSON.parse(this._cookie_Service.get('GDairyadminData'))
      body.AdminID = data.AdminID,
        body.SessionID = data.SessionID
    }
    return this.httpService.post(this.admin_Url + posturl, body)
  }
  postMethodImage(posturl: string, body: any): any {
    return this.httpService.post(this.ImageUrl + posturl, body)
  }

  onUploadFile(req: any): Observable<any> {
    return this.httpService.request(req)
  }
  sessionHandling(){
    this.nzMessageService.success("Logged Out Pls Login Again")
    this.router.navigateByUrl('/login');;
    this._cookie_Service.deleteAll()
  }
}