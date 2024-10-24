import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AppService } from '../app.service';

@Component({
  selector: 'app-reported-posts',
  templateUrl: './reported-posts.component.html',
  styleUrls: ['./reported-posts.component.css']
})
export class ReportedPostsComponent implements OnInit {
  skip: number = 0;
  currentPage: number = 1;
  limit = this._appService.limit;
  isTableloading: boolean = false;
  TotalItems: any;
  tableList: any = []
  Report_Status = new FormControl(null)
  isPlayingAudio = true;
  audio: any;

  detailViewIndex: any;

  selectedData:any = {}
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

      this._appService.postMethod_admin('List_All_Reported_Posts', body)
        .subscribe(resp => {
          if (resp.success) {
            this.isTableloading = false
            if (this.skip == 0) {
              this.currentPage = 1
              this.TotalItems = resp.extras.Count
            }
            this.TotalItems = resp.extras.Count
            this.tableList = resp.extras.Data
            this.detailViewIndex = -1


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
      Reported_PostID: data.Reported_PostID,
    }
    try {
      this._appService.postMethod_admin(type==1?'Approve_Reported_Post':type==2?'Reject_Reported_Post':'', body)
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
  onExpandRow(data: any, index: number) {
    if (this.detailViewIndex == index) {
      this.detailViewIndex = -1
    } else {
      this.detailViewIndex = index
      this.selectedData = data
    }

  }
  onPlayAudio() {
    this.isPlayingAudio = !this.isPlayingAudio
    if (this.isPlayingAudio == false) {
      this.audio = new Audio(this.selectedData.Post_Data?.Audio_Information.Audio_URL)
      this.audio.load();
      this.audio.play();
    }
    else {
      this.audio.pause();

    }
  }
}
