import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AppService } from '../app.service';

@Component({
  selector: 'app-Script-section',
  templateUrl: './Script-section.component.html',
  styleUrls: ['./Script-section.component.css']
})
export class ScriptSectionComponent implements OnInit {
  isAdding = false
  isEditing = false
  Status: any;
  skip = 0;
  ScriptList: any = []
  LanguageList: any = []
  isTableloading: boolean = false
  limit = this._appService.limit;
  currentPage: number = 1;
  Count: any;
  isAddBtnLoading: boolean = false;
  TotalItems: any;
  selectedData: any;
  addForm: any = FormGroup;
  type = 1;
  StateList: any = []
  DistrictList: any = []
  CityList: any = []
  AreaList: any = []
  BusinessList: any = []
  CommoditieList: any = []
  SubscriptionLists: any = []
  bannersList: any = []
  termsConditionList: any = []
  ReferralsList: any = []

  ScriptType = [
    {
      id: 1,
      name: 'Language'
    },
    {
      id: 2,
      name: 'State'
    },
    {
      id: 3,
      name: 'District'
    },
    {
      id: 4,
      name: 'City'
    },
    {
      id: 5,
      name: 'Area'
    },
    {
      id: 6,
      name: 'Business type'
    },
    {
      id: 7,
      name: 'Commodity'
    },
    {
      id: 8,
      name: 'Subscription'
    },
    {
      id: 9,
      name: 'Banner'
    },
    {
      id: 10,
      name: 'Terms and condition'
    },
    {
      id: 11,
      name: 'Referrals'
    },
  ]

  constructor(private fb: FormBuilder,
    private nzMessageService: NzMessageService,
    public _appService: AppService) { }

  ngOnInit() {
    this.getLanguageList()
    this.addForm = this.fb.group({
      ScriptName: [null, [Validators.required]],
      ScriptKey: [null, [Validators.required]],
      LanguageID: [null, [Validators.required]],
      type: [1, [Validators.required]],
      StateId: [null],
      DistrictId: [null],
      CityId: [null],
      AreaId: [null],
      BusinessId: [null],
      CommodityId: [null],
      SubscriptionID: [null],
      BannerID: [null],
      TermsConditionsID: [null],
      ReferralID: [null],
    })
    this.addForm.get('type').valueChanges.subscribe((data: number) => {
      this.addForm.get('StateId').reset()
      this.addForm.get('DistrictId').reset()
      this.addForm.get('CityId').reset()
      this.addForm.get('AreaId').reset()
      this.addForm.get('BusinessId').reset()
      this.addForm.get('CommodityId').reset()
      this.addForm.get('SubscriptionID').reset()
      this.addForm.get('BannerID').reset()
      this.addForm.get('TermsConditionsID').reset()
      this.addForm.get('ReferralID').reset()
      if (data == 2) {
        this.getStateList()
      } else if (data == 3) {
        this.getDistrictList()
      } else if (data == 4) {
        this.getCityList()
      } else if (data == 5) {
        this.getAreaList()
      } else if (data == 6) {
        this.getBusinessList()
      } else if (data == 7) {
        this.getCommoditieList()
      } else if (data == 8) {
        this.getSubscriptionsList()
      } else if (data == 9) {
        this.getBannersList()
      } else if (data == 10) {
        this.getTCList()
      } else if (data == 11) {
        this.getreferrals()
      }
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
    this.getScriptList()

  }

  getScriptList() {
    this.isTableloading = true
    let body = {
      skip: this.skip,
      limit: this.limit,
      // Whether_Search_Filter: false,
      // Search: '',
      type: this.type,
      status: true
    }
    try {

      this._appService.postMethod_admin('Fetch_All_Scripts', body)
        .subscribe(resp => {
          if (resp.success) {
            this.isTableloading = false
            if (this.skip == 0) {
              this.currentPage = 1
              this.Count = resp.extras.Count
            }

            this.ScriptList = resp.extras.Data
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
    this.isEditing = true
    this.isAdding = true
    this.selectedData = data
    this.addForm.patchValue({
      ScriptName: data.ScriptName,
      LanguageID: data.LanguageID,
      type: data.type,
      ScriptKey: data.ScriptKey,
      StateId: data.type == 2 ? data.SupportingId : '',
      DistrictId: data.type == 3 ? data.SupportingId : '',
      CityId: data.type == 4 ? data.SupportingId : '',
      AreaId: data.type == 5 ? data.SupportingId : '',
      BusinessId: data.type == 6 ? data.SupportingId : '',
      CommodityId: data.type == 7 ? data.SupportingId : '',
      SubscriptionID: data.type == 8 ? data.SupportingId : '',
      BannerID: data.type == 9 ? data.SupportingId : '',
      TermsConditionsID: data.type == 9 ? data.SupportingId : '',
      ReferralID: data.type == 9 ? data.SupportingId : '',
    })
  }




  onAction(data: any) {
    let body = {}
    if (data.status) {
      body = {
        ScriptId: data.ScriptId,
        status: false
      }
    } else {
      body = {
        ScriptId: data.ScriptId,
        status: true
      }
    }
    let url = 'Edit_Script'

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
            this.getScriptList()
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
    this.getScriptList()
  }

  onClose() {
    this.isAdding = false;
    this.isEditing = false
    this.addForm.reset({
      type: 1
    })
    this.isAddBtnLoading = false
  }

  onsubmit() {
    this.isAddBtnLoading = true
    let body = {}
    let url = ''
    if (this.isEditing) {
      body = {
        ScriptName: this.addForm.value.ScriptName,
        LanguageID: this.addForm.get('LanguageID').value,
        ScriptId: this.selectedData.ScriptId,
        ScriptKey: this.addForm.value.ScriptKey,
        type: this.addForm.get('type').value,
        status:this.selectedData.status,

        SupportingId: this.addForm.get('type').value == 1 ? this.addForm.get('LanguageID').value :
          this.addForm.get('type').value == 2 ? this.addForm.get('StateId').value :
            this.addForm.get('type').value == 3 ? this.addForm.get('DistrictId').value :
              this.addForm.get('type').value == 4 ? this.addForm.get('CityId').value :
                this.addForm.get('type').value == 5 ? this.addForm.get('AreaId').value :
                  this.addForm.get('type').value == 6 ? this.addForm.get('BusinessId').value :
                    this.addForm.get('type').value == 7 ? this.addForm.get('CommodityId').value :
                      this.addForm.get('type').value == 8 ? this.addForm.get('SubscriptionID').value :
                        this.addForm.get('type').value == 9 ? this.addForm.get('BannerID').value :
                          this.addForm.get('type').value == 10 ? this.addForm.get('TermsConditionsID').value :
                            this.addForm.get('type').value == 11 ? this.addForm.get('ReferralID').value : ''
      }
      url = 'Edit_Script'
    }
    else {
      body = {
        type: this.addForm.get('type').value,
        ScriptName: this.addForm.value.ScriptName,
        LanguageID: this.addForm.get('LanguageID').value,
        ScriptKey: this.addForm.value.ScriptKey,

        SupportingId: this.addForm.get('type').value == 1 ? this.addForm.get('LanguageID').value :
          this.addForm.get('type').value == 2 ? this.addForm.get('StateId').value :
            this.addForm.get('type').value == 3 ? this.addForm.get('DistrictId').value :
              this.addForm.get('type').value == 4 ? this.addForm.get('CityId').value :
                this.addForm.get('type').value == 5 ? this.addForm.get('AreaId').value :
                  this.addForm.get('type').value == 6 ? this.addForm.get('BusinessId').value :
                    this.addForm.get('type').value == 7 ? this.addForm.get('CommodityId').value :
                      this.addForm.get('type').value == 8 ? this.addForm.get('SubscriptionID').value :
                        this.addForm.get('type').value == 9 ? this.addForm.get('BannerID').value :
                          this.addForm.get('type').value == 10 ? this.addForm.get('TermsConditionsID').value :
                            this.addForm.get('type').value == 11 ? this.addForm.get('ReferralID').value : ''
      }
      url = 'Create_Script'
    }
    try {

      this._appService.postMethod_admin(url, body)
        .subscribe((resp: any) => {
          if (resp.success) {
            this.onClose()
            this.getScriptList()
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


  getLanguageList() {
    let body = {
      skip: 0,
      limit: 10000000,
      status: true
    }
    try {

      this._appService.postMethod_admin('Fetch_All_Languages', body)
        .subscribe(resp => {
          if (resp.success) {

            this.LanguageList = resp.extras.Data
          } else {
            this.nzMessageService.error(resp.extras.msg);
          }
        },
          error => {
            this.nzMessageService.error(error.error.extras.msg);
          })

    } catch (e) { }
  }
  getStateList() {
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
            this.StateList = resp.extras.Data
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
      limit: 1000000,
      Whether_Search_Filter: false,
      Search: '',
      status: true,
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
      limit: 1000000,
      Whether_Search_Filter: false,
      Search: '',
      status: true,
    }
    try {

      this._appService.postMethod_admin('Fetch_All_Cities', body)
        .subscribe(resp => {
          if (resp.success) {
            this.CityList = resp.extras.Data
          } else {
            this.nzMessageService.error(resp.extras.msg);
          }
        },
          error => {
            this.nzMessageService.error(error.error.extras.msg);
          })

    } catch (e) { }
  }
  getAreaList() {
    let body = {
      skip: 0,
      limit: 1000000,
      Whether_Search_Filter: false,
      Search: '',
      status: true
    }
    try {
      this._appService.postMethod_admin('Fetch_All_Areas', body)
        .subscribe(resp => {
          if (resp.success) {
            this.AreaList = resp.extras.Data
          } else {
            this.nzMessageService.error(resp.extras.msg);
          }
        },
          error => {
            this.nzMessageService.error(error.error.extras.msg);

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
  getCommoditieList() {
    let body = {
      skip: 0,
      limit: 100000,
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
  getSubscriptionsList() {
    let body = {
      skip: 0,
      limit: 1000000,
      Status: true

    }
    try {

      this._appService.postMethod_admin('List_All_Subscriptions', body)
        .subscribe(resp => {
          if (resp.success) {
            this.SubscriptionLists = resp.extras.Data

          } else {
            this.nzMessageService.error(resp.extras.msg);
          }
        },
          error => {
            this.nzMessageService.error(error.error.extras.msg);
          })

    } catch (e) { }

  }
  getBannersList() {
    let body = {
      skip: 0,
      limit: 1000000,
      Whether_Status_Filter: true,
      Status: true

    }
    try {

      this._appService.postMethod_admin('List_All_Banners', body)
        .subscribe(resp => {
          if (resp.success) {
            this.bannersList = resp.extras.Data

          } else {
            this.nzMessageService.error(resp.extras.msg);
          }
        },
          error => {
            this.nzMessageService.error(error.error.extras.msg);
          })

    } catch (e) { }

  }
  getTCList() {
    let body = {
      skip: 0,
      limit: 1000000,
      Status: true

    }
    try {

      this._appService.postMethod_admin('List_All_TC', body)
        .subscribe(resp => {
          if (resp.success) {
            this.termsConditionList = resp.extras.Data
          } else {
            this.nzMessageService.error(resp.extras.msg);
          }
        },
          error => {
            this.nzMessageService.error(error.error.extras.msg);
          })

    } catch (e) { }

  }
  getreferrals() {
    let body = {
      skip: 0,
      limit: 1000000,
      Status: true

    }
    try {

      this._appService.postMethod_admin('List_All_Referrals', body)
        .subscribe(resp => {
          if (resp.success) {
            this.ReferralsList = resp.extras.Data
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
