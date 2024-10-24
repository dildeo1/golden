import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AppService } from '../app.service';

@Component({
  selector: 'app-City-section',
  templateUrl: './City-section.component.html',
  styleUrls: ['./City-section.component.css']
})
export class CitySectionComponent implements OnInit {
  isAdding = false
  isEditing = false

  CityList: any = []
  StatesList: any = []
  DistrictList: any = []
  limit = this._appService.limit;
  isTableloading: boolean = false;
  TotalItems: any;
  Count: any;
  selectedData: any
  isAddBtnLoading: boolean = false;
  addForm: any = FormGroup;
  onEditOpen = false
  Status: any;
  skip = 0;
  currentPage: number = 1;

  StateID = new FormControl(null)

  DistrictID = new FormControl(null)

  AllDistrictList: any = []
  Search = new FormControl('')




  constructor(private fb: FormBuilder,
    private nzMessageService: NzMessageService,
    public _appService: AppService) { }

  ngOnInit() {
    this.getStatesList()
    this.addForm = this.fb.group({
      District_Name: [null, [Validators.required]],
      State_Name: [null, [Validators.required]],
      City_Name: [null, [Validators.required]],

    });
    this.addForm.get('State_Name').valueChanges.subscribe((data: any) => {
      this.addForm.get('District_Name').reset()
      this.getDistrictList()
    })
    this.StateID.valueChanges.subscribe((data: any) => {
      this.DistrictID.reset()
      this.getDistrcictList()
      this.skip = 0
      this.getCityList()
    })
    this.DistrictID.valueChanges.subscribe((data: any) => {
      this.skip = 0
      this.getCityList()
    })
    this.Search.valueChanges.subscribe((data) => {
      this.skip = 0
      this.getCityList()
    })
    this.onTabClick(true)
  }

  onAdd() {
    this.isAdding = true
    this.isEditing = false
  }

  getCityList() {
    this.isTableloading = true
    let body = {
      skip: this.skip,
      limit: this.limit,
      Whether_Search_Filter: this.Search.value.length > 0 ? true : false,
      Search: this.Search.value,
      //  status:true
      status: this.Status,
      Whether_State_Filter: this.StateID.value == null ? false : true,
      StateID: this.StateID.value,
      Whether_District_Filter: this.DistrictID.value == null ? false : true,
      DistrictID: this.DistrictID.value,
      // StateId: this.StateID.value,
      //   DistrictId: this.DistrictID.value
    }
    try {

      this._appService.postMethod_admin('Fetch_All_Cities', body)
        .subscribe(resp => {
          if (resp.success) {
            this.isTableloading = false
            if (this.skip == 0) {
              this.currentPage = 1
              this.Count = resp.extras.Count
            }

            this.CityList = resp.extras.Data
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
    this.Status = tabNumber
    this.skip = 0
    this.getCityList()
  }

  onEdit(data: any) {
    this.isEditing = true
    this.isAdding = true
    this.selectedData = data
    this.addForm.patchValue({
      State_Name: data.StateId,
      City_Name: data.CityName
    })
  }


  onNextPage(event: number) {
    this.currentPage = event
    this.skip = (event - 1) * this.limit
    this.getCityList()
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
        StateId: this.addForm.value.State_Name,
        DistrictId: this.addForm.value.District_Name,
        CityName: this.addForm.value.City_Name,
        CityId: this.selectedData.CityId,
        status: this.selectedData.status

      }
      url = 'Edit_City'
    }
    else {
      body = {
        StateId: this.addForm.value.State_Name,
        DistrictId: this.addForm.value.District_Name,
        CityName: this.addForm.value.City_Name,

      }
      url = 'Create_City'
    }
    try {

      this._appService.postMethod_admin(url, body)
        .subscribe((resp: any) => {
          if (resp.success) {
            this.onClose()
            this.getCityList()
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

  onAction(data: any) {
    let body = {}
    if (data.status) {
      body = {
        CityName: data.CityName,
        CityId: data.CityId,
        status: false

      }
    } else {
      body = {
        CityName: data.CityName,
        CityId: data.CityId,
        status: true

      }
    }
    let url = 'Edit_City'

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
            this.getCityList()
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

  getStatesList() {
    let body = {
      skip: 0,
      limit: 1000000,
      Whether_Search_Filter: false,
      Search: '',
      status: true

    }
    try {

      this._appService.postMethod_admin('Fetch_All_States', body)
        .subscribe(resp => {
          if (resp.success) {


            this.StatesList = resp.extras.Data

          } else {
            this.nzMessageService.error(resp.extras.msg);
          }
        },
          error => {
            this.nzMessageService.error(error.error.extras.msg);
          })

    } catch (e) { }

  }
  getDistrictList() {
    let body = {
      skip: 0,
      limit: 100000,
      Whether_Search_Filter: false,
      Search: '',
      status: true,

      Whether_State_Filter: this.addForm.get('State_Name').value == null ? false : true,
      StateID: this.addForm.get('State_Name').value

    }
    try {

      this._appService.postMethod_admin('Fetch_All_Districts', body)
        .subscribe(resp => {
          if (resp.success) {


            this.DistrictList = resp.extras.Data
            if(this.DistrictList.length>0){
              this.addForm.patchValue({
                District_Name: this.selectedData.DistrictId,

              },{emitEvent:false})
            }
          } else {
            this.nzMessageService.error(resp.extras.msg);
          }
        },
          error => {
            this.nzMessageService.error(error.error.extras.msg);
          })

    } catch (e) { }

  }
  getDistrcictList() {
    let body = {
      skip: 0,
      limit: 100000,
      Whether_Search_Filter: false,
      Search: '',
      status: true,

      Whether_State_Filter: this.StateID.value== null ? false : true,
      StateID: this.StateID.value

    }
    try {

      this._appService.postMethod_admin('Fetch_All_Districts', body)
        .subscribe(resp => {
          if (resp.success) {


            this.AllDistrictList = resp.extras.Data
          } else {
            this.nzMessageService.error(resp.extras.msg);
          }
        },
          error => {
            this.nzMessageService.error(error.error.extras.msg);
          })

    } catch (e) { }

  }

}
