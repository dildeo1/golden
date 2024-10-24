import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AppService } from '../app.service';

@Component({
  selector: 'app-user-Posts',
  templateUrl: './user-Posts.component.html',
  styleUrls: ['./user-Posts.component.css']
})
export class UserPostsComponent implements OnInit {
  skip: number = 0;
  currentPage: number = 1;
  limit = this._appService.limit;
  isTableloading: boolean = false;
  TotalItems: any;
  tableList: any = []
  Status: boolean = true;

  filterForm: any = FormGroup
  BusinessList: any = [];
  CommoditieList: any = [];
  detailViewIndex: any;

  selectedData:any = {}

  isPlayingAudio = true;
  audio: any;
  constructor(
    private fb: FormBuilder,
    private nzMessageService: NzMessageService,
    public _appService: AppService
  ) { }

  ngOnInit() {
    this.getBusinessList()
    this.getCommoditieList()
    this.filterForm = new FormGroup({
      BusinessId: new FormControl(null),
      PostType: new FormControl(null),
      CommoditiesId: new FormControl([]),
    })
    this.filterForm.valueChanges.subscribe((data: any) => {
      this.skip = 0
      this.getTablelist()
    })
    this.onTabClick(true)
  }
  onTabClick(tabNumber: boolean) {
    this.Status = tabNumber,
      this.skip = 0
    this.getTablelist()
  }
  getTablelist() {
    this.isTableloading = true
    let body = {
      skip: this.skip,
      limit: this.limit,
      Status: this.Status,
      Whether_Business_Filter: this.filterForm.get('BusinessId').value == null ? false : true,
      BusinessId: this.filterForm.get('BusinessId').value,
      Whether_Post_Type_Filter: this.filterForm.get('PostType').value == null ? false : true,
      PostType: this.filterForm.get('PostType').value,
      Whether_Commodity_Filter: this.filterForm.get('CommoditiesId').value.length > 0 ? true : false,
      CommoditiesId: this.filterForm.get('CommoditiesId').value,

    }
    try {

      this._appService.postMethod_admin('List_All_Posts', body)
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
            if (resp.error.extras.code == 1 || resp.error.extras.code == '1') {
              this._appService.sessionHandling()
            } else {
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

  getBusinessList() {
    let body = {
      skip: 0,
      limit: 100000,
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
  getCommoditieList() {
    let body = {
      skip: 0,
      limit: 100000,
      // Whether_Search_Filter: false,
      // Search: '',
      status: true
    }
    try {

      this._appService.postMethod_admin('Fetch_All_Commodities', body)
        .subscribe(resp => {
          if (resp.success) {
            this.CommoditieList = resp.extras.Data
          } else {

            this.nzMessageService.error(resp.extras.msg);
          }
        },
          error => {
            this.nzMessageService.error(error.error.extras.msg);
          })

    } catch (e) { }
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
      this.audio = new Audio(this.selectedData.Audio_Information.Audio_URL)
      this.audio.load();
      this.audio.play();
    }
    else {
      this.audio.pause();

    }
  }
}
