import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AppService } from '../app.service';

@Component({
  selector: 'app-pincode-section',
  templateUrl: './pincode-section.component.html',
  styleUrls: ['./pincode-section.component.css']
})
export class PincodeSectionComponent implements OnInit {
  isAdding = false
  isEditing = false
  Status: any;
  skip = 0
  limit = this._appService.limit;
  PincodeList: any = []
  isTableloading: boolean = false
  TotalItems: any;
  isAddBtnLoading: boolean = false;
  currentPage: number = 1;
  Count: any;
  selectedData: any
  addForm: any = FormGroup;
  StatesList: any = []
  DistrictList: any = []
  CityList: any = []

  StateID = new FormControl(null)

  DistrictID = new FormControl(null)
  CityID = new FormControl(null)

  AllDistrictList: any = []
  allCityList: any = []
  Search = new FormControl('')

  constructor(private fb: FormBuilder,
    private nzMessageService: NzMessageService,
    public _appService: AppService) { }

  ngOnInit() {
    this.getStatesList()
    // this.getCityList()
    // this.getDistrictList()
    this.addForm = this.fb.group({
      District_Name: [null, [Validators.required]],
      State_Name: [null, [Validators.required]],
      City_Name: [null, [Validators.required]],
      Pincode_Number: [null, [Validators.required]],

    });
    this.addForm.get('State_Name').valueChanges.subscribe((data: any) => {
      this.addForm.get('District_Name').reset()
      this.getDistrictList()
    })
    this.addForm.get('District_Name').valueChanges.subscribe((data: any) => {
      this.addForm.get('City_Name').reset()
      this.getCityList()
    })
    this.StateID.valueChanges.subscribe((data: any) => {
      this.DistrictID.reset()
      this.getDistrcictList()
      this.skip = 0
      this.getPincodeList()
    })
    this.DistrictID.valueChanges.subscribe((data: any) => {
      this.CityID.reset()
      this.getCitiesList()
      this.skip = 0
      this.getPincodeList()
    })
    this.CityID.valueChanges.subscribe((data: any) => {
      this.skip = 0
      this.getPincodeList()
    })
    this.Search.valueChanges.subscribe((data) => {
      this.skip = 0
      this.getPincodeList()
    })
    this.onTabClick(true)
  }

  onAdd() {
    this.isAdding = true
    this.isEditing = false
  }

  onTabClick(tabNumber: boolean) {
    this.Status = tabNumber
    this.skip = 0
    this.getPincodeList()

  }

  getPincodeList() {
    this.isTableloading = true
    let body = {
      skip: this.skip,
      limit: this.limit,
      Whether_Search_Filter: this.Search.value.length > 0 ? true : false,
      Search: this.Search.value,
      status: this.Status,

      Whether_State_Filter: this.StateID.value == null ? false : true,
      StateID: this.StateID.value,
      Whether_District_Filter: this.DistrictID.value == null ? false : true,
      DistrictID: this.DistrictID.value,
      Whether_City_Filter: this.CityID.value == null ? false : true,
      CityID: this.CityID.value,
    }
    try {

      this._appService.postMethod_admin('Fetch_All_Pincodes', body)
        .subscribe(resp => {
          if (resp.success) {
            this.isTableloading = false
            if (this.skip == 0) {
              this.currentPage = 1
              this.Count = resp.extras.Count
            }

            this.PincodeList = resp.extras.Data
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

  onEdit(data: any) {
    this.addForm.get('State_Name').disable()
    this.addForm.get('District_Name').disable()
    this.addForm.get('City_Name').disable()
    this.isEditing = true
    this.isAdding = true
    this.selectedData = data
    this.addForm.patchValue({
      State_Name: data.StateId,
      District_Name: data.DistrictId,
      City_Name: data.CityId,
      Pincode_Number: data.PincodeNumber
    })
  }

  onAction(data: any) {
    let body = {}
    if (data.status) {
      body = {
        PincodeId: data.PincodeId,
        status: false

      }
    } else {
      body = {
        PincodeId: data.PincodeId,
        status: true

      }
    }
    let url = 'Edit_Pincode'

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
            this.getPincodeList()
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

  onNextPage(event: number) {
    this.currentPage = event
    this.skip = (event - 1) * this.limit
    this.getPincodeList()
  }

  onClose() {
    this.isAdding = false;
    this.isEditing = false
    this.addForm.reset()
    this.isAddBtnLoading = false
    this.addForm.get('State_Name').enable()
    this.addForm.get('District_Name').enable()
    this.addForm.get('City_Name').enable()
  }

  onsubmit() {
    this.isAddBtnLoading = true
    let body = {}
    let url = ''
    if (this.isEditing) {
      body = {
        PincodeNumber: this.addForm.value.Pincode_Number,
        PincodeId: this.selectedData.PincodeId,
        status: this.selectedData.status

      }
      url = 'Edit_Pincode'
    }
    else {
      body = {
        StateId: this.addForm.value.State_Name,
        DistrictId: this.addForm.value.District_Name,
        CityId: this.addForm.value.City_Name,
        PincodeNumber: this.addForm.value.Pincode_Number,
        // status:true,

      }
      url = 'Create_Pincode'
    }
    try {

      this._appService.postMethod_admin(url, body)
        .subscribe((resp: any) => {
          if (resp.success) {
            this.onClose()
            this.getPincodeList()
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


  getStatesList() {
    let body = {
      skip: 0,
      limit: 100000,
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
          } else {
            this.nzMessageService.error(resp.extras.msg);
          }
        },
          error => {
            this.nzMessageService.error(error.error.extras.msg);
          })

    } catch (e) { }

  }


  getCityList() {
    let body = {
      skip: 0,
      limit: 100000,
      Whether_Search_Filter: false,
      Search: '',
      //  status:true
      status: true,

      Whether_State_Filter: false,
      StateID: '',
      Whether_District_Filter: this.addForm.get('District_Name').value == null ? false : true,
      DistrictID: this.addForm.get('District_Name').value,
    }
    try {

      this._appService.postMethod_admin('Fetch_All_Cities', body)
        .subscribe(resp => {
          if (resp.success) {


            this.CityList = resp.extras.Data
            // this.Count = resp.extras.Count
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

      Whether_State_Filter: this.StateID.value == null ? false : true,
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
  getCitiesList() {
    let body = {
      skip: 0,
      limit: 100000,
      Whether_Search_Filter: false,
      Search: '',
      status: true,
      // status:this.Status
      Whether_State_Filter: false,
      StateID: '',
      Whether_District_Filter: this.DistrictID.value == null ? false : true,
      DistrictID: this.DistrictID.value,
    }
    try {

      this._appService.postMethod_admin('Fetch_All_Cities', body)
        .subscribe(resp => {
          if (resp.success) {


            this.allCityList = resp.extras.Data
            // this.Count = resp.extras.Count
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
