import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AppService } from '../app.service';
import { HttpRequest, HttpResponse } from '@angular/common/http';
// import { threadId } from 'worker_threads';

declare var google: any

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  ImageData: any = []
  ImageDataMul: any = []
  isImageUploading: boolean = false
  isImageUploading1: boolean = false
  Latitude = ''
  Longitude = ''
  address_GooglePlaces: any;
  isEditing = false
  skip: number = 0;
  currentPage: number = 1;
  limit = this._appService.limit;
  isTableloading: boolean = false;
  TotalItems: any;
  tableList: any = []

  filterForm: any = FormGroup
  EditForm: any = FormGroup
  BusinessList: any = [];
  CommoditieList: any = [];

  StatesList: any = []
  AllDistrictList: any = []

  AreaList: any = []
  EditAllDistrictList: any = []
  EditCityList: any = [];

  CityList: any = [];
  detailViewIndex: any;
  selectedData: any = {};
  EsitselectedData: any = {}
  isAddBtnLoading: boolean = false;
  selectedModalData: any = {};
  isModalView: boolean = false;
  Amount = new FormControl(null)
  selectedTab: any;

  Referralskip: number = 0;
  ReferralcurrentPage: number = 1;
  isReferralTableloading: boolean = false;
  ReferralTotalItems: any;
  ReferraltableList: any = []
  AdminInfo: any = {};
  selectedUpdateModalData: any = {};
  isCoinModalView: boolean = false;
  isCoinAddBtnLoading: boolean = false;
  CoinAmount = new FormControl(null)

  Comment = new FormControl('')
  CoinComment = new FormControl('')
  Status: boolean = true;

  ValidatingStatus:string = ''
  ErrorTip:string=''

  constructor(
    private nzMessageService: NzMessageService,
    public _appService: AppService, private ngZone: NgZone,
  ) { }

  ngOnInit() {
    this.getAdminInfo()
    this.getBusinessList()
    this.getCommoditieList()
    this.getStatesList()
    this.filterForm = new FormGroup({
      BusinessId: new FormControl(null),
      StateID: new FormControl(null),
      DistrictID: new FormControl(null),
      CityID: new FormControl(null),
      CommoditiesId: new FormControl([]),
      Search: new FormControl('')
    })

    this.EditForm = new FormGroup({
      Address: new FormControl(null),
      AreaId: new FormControl(null),
      BusinessId: new FormControl(null),
      CommoditiesIDs: new FormControl([]),
      Description: new FormControl(null),
      EmailID: new FormControl(null),
      GSTNumber: new FormControl(null),
      Location: new FormControl(null),
      OwnerName: new FormControl(null),
      PhoneNumber2: new FormControl(null),
      PincodeNumber: new FormControl(null),
      ShopName: new FormControl(null),
      ShopNumber: new FormControl(null),
      // WhetherCommodityIdsExist: new FormControl(true),
      Whether_Hide_Mobile_Number: new FormControl(true),
      Whether_Hide__Secondary_Mobile_Number: new FormControl(true),
      Whether_Hide_Shop_Number: new FormControl(true),
      // ImageID:  new FormControl(null),
      // ImageID_Array: new FormControl([]),

      StateId: new FormControl(null),
      DistrictId: new FormControl(null),
      CityId: new FormControl(null),

      Search: new FormControl('')
    })

    this.filterForm.get('StateID').valueChanges.subscribe((data: any) => {
      this.filterForm.get('DistrictID').reset()
      this.getDistrcictList()
    })

    this.filterForm.get('DistrictID').valueChanges.subscribe((data: any) => {
      this.filterForm.get('CityID').reset()
      this.getCityList()
    })

    this.EditForm.get('StateId').valueChanges.subscribe((data: any) => {
      if(data != null){
        this.EditForm.get('DistrictId').reset()
        this.getEditDistrcictList()
      }else {
        this.EditForm.get('DistrictId').reset()
      }
     
    })
    this.EditForm.get('DistrictId').valueChanges.subscribe((data: any) => {
      if(data!= null){
        this.EditForm.get('CityId').reset()
        this.getEditCityList()
      }else {
        this.EditForm.get('CityId').reset()
      }
      
    })
    this.EditForm.get('CityId').valueChanges.subscribe((data: any) => {
      if(data!=null){
        this.EditForm.get('AreaId').reset()
        this.getAreaList()
      }else {
        this.EditForm.get('AreaId').reset()
      }
      
    })
    this.EditForm.get('GSTNumber').valueChanges.subscribe((data: any) => {
      if (data!=null) {
        this.checkGSTNumber(data)
      } else {
        this.ValidatingStatus = ''
      }
    })
    this.filterForm.valueChanges.subscribe((data: any) => {
      this.skip = 0
      this.getTablelist()
    })
    this.onTabClickMain(true)
  }
  onTabClickMain(tabNumber: boolean) {
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
      Whether_Commodity_Filter: this.filterForm.get('CommoditiesId').value.length > 0 ? true : false,
      CommoditiesId: this.filterForm.get('CommoditiesId').value,
      Whether_State_Filter: this.filterForm.get('StateID').value == null ? false : true,
      StateID: this.filterForm.get('StateID').value,
      Whether_District_Filter: this.filterForm.get('DistrictID').value == null ? false : true,
      DistrictID: this.filterForm.get('DistrictID').value,
      Whether_CityID_Filter: this.filterForm.get('CityID').value == null ? false : true,
      CityID: this.filterForm.get('CityID').value,

      Whether_Search_Filter: this.filterForm.get('Search').value.length > 0 ? true : false,
      Search: this.filterForm.get('Search').value,

    }
    try {

      this._appService.postMethod_admin('Filter_All_Users', body)
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
  getDistrcictList() {
    let body = {
      skip: 0,
      limit: 100000,
      Whether_Search_Filter: false,
      Search: '',
      status: true,

      Whether_State_Filter: this.filterForm.get('StateID').value == null ? false : true,
      StateID: this.filterForm.get('StateID').value

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

  getCityList() {
    let body = {
      skip: 0,
      limit: 100000,
      Whether_Search_Filter: false,
      Search: '',
      //  status:true
      status: true,
      StateId: this.filterForm.get('StateID').value,
      DistrictId: this.filterForm.get('DistrictID').value,
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


  getEditDistrcictList() {
    let body = {
      skip: 0,
      limit: 100000,
      Whether_Search_Filter: false,
      Search: '',
      status: true,
      Whether_State_Filter: true,
      StateID: this.EditForm.get('StateId').value

    }
    try {

      this._appService.postMethod_admin('Fetch_All_Districts', body)
        .subscribe(resp => {
          if (resp.success) {
            this.EditAllDistrictList = resp.extras.Data
            if (this.EditAllDistrictList.length > 0) {
              this.EditForm.patchValue({
                DistrictId: this.EsitselectedData.DistrictID,
              })

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

  getEditCityList() {
    let body = {
      skip: 0,
      limit: 100000,
      Whether_Search_Filter: false,
      Search: '',
      //  status:true
      status: true,
      StateId: this.EditForm.get('StateId').value,
      DistrictId: this.EditForm.get('DistrictId').value,
    }
    try {

      this._appService.postMethod_admin('Fetch_All_Cities', body)
        .subscribe(resp => {
          if (resp.success) {
            this.EditCityList = resp.extras.Data
            if (this.EditCityList.length > 0) {
              this.EditForm.patchValue({
                CityId: this.EsitselectedData.CityID,
              })

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

  onExpandRow(data: any, index: number) {
    if (this.detailViewIndex == index) {
      this.detailViewIndex = -1
    } else {
      this.detailViewIndex = index
      this.onTabClick(data, 1)

    }

  }
  onTabClick(data: any, tabNumber: number) {
    this.selectedData = data
    this.selectedTab = tabNumber
    if (this.selectedTab == 2) {
      this.Referralskip = 0
      this.getReferralLog()
    }
  }
  getReferralLog() {
    this.isReferralTableloading = true
    let body = {
      skip: this.Referralskip,
      limit: this.limit,
      Whether_User_Filter: true,
      USERID: this.selectedData.USERID
    }
    try {

      this._appService.postMethod_admin('List_Logs_For_Coins_Transfer', body)
        .subscribe(resp => {
          if (resp.success) {
            this.isReferralTableloading = false
            if (this.Referralskip == 0) {
              this.ReferralcurrentPage = 1
              this.ReferralTotalItems = resp.extras.Count
            }
            this.ReferralTotalItems = resp.extras.Count
            this.ReferraltableList = resp.extras.Data


          } else {
            this.isReferralTableloading = false
            this.nzMessageService.error(resp.extras.msg);
          }
        },
          resp => {
            this.isReferralTableloading = false
            if (resp.error.extras.code == 1 || resp.error.extras.code == '1') {
              this._appService.sessionHandling()
            } else {
              this.nzMessageService.error(resp.error.extras.msg);

            }
          })

    } catch (e) { }

  }

  onReferralNextPage(event: number) {
    this.ReferralcurrentPage = event
    this.Referralskip = (event - 1) * this.limit
    this.getReferralLog()
  }
  onUpdate(data: any) {
    this.selectedModalData = data
    this.isModalView = true

  }
  onCancel() {
    this.isModalView = false
    this.isAddBtnLoading = false
    this.Amount.reset()
    this.Comment.reset('')
  }
  onsubmit() {
    this.isAddBtnLoading = true
    let body = {}
    let url = ''
    body = {
      USERID: this.selectedModalData.USERID,
      Amount: +(this.Amount.value),
      Comment: this.Comment.value
    }
    url = 'Create_Log_For_Coin_Transfer'
    try {

      this._appService.postMethod_admin(url, body)
        .subscribe((resp: any) => {
          if (resp.success) {
            this.onCancel()
            this.getTablelist()
            this.nzMessageService.success(resp.extras.Status)


          } else {
            this.isAddBtnLoading = false
            this.nzMessageService.error(resp.extras.msg)
          }
        },
          resp => {
            this.isAddBtnLoading = false
            if (resp.error.extras.code == 1 || resp.error.extras.code == '1') {
              this._appService.sessionHandling()
            } else {
              this.nzMessageService.error(resp.error.extras.msg);

            }
          })
    } catch (e) { }
  }
  onUpdateCoins(data: any) {
    this.selectedUpdateModalData = data
    this.isCoinModalView = true
    this.CoinAmount.patchValue(data.Amount)
    this.CoinComment.patchValue(data.Comment)
  }
  onCancelCoins() {
    this.isCoinModalView = false
    this.isCoinAddBtnLoading = false
    this.CoinAmount.reset()
  }
  onsubmitCoins() {
    this.isCoinAddBtnLoading = true
    let body = {}
    let url = ''
    body = {
      USERID: this.selectedUpdateModalData.USERID,
      ID: this.selectedUpdateModalData.ID,
      Amount: +(this.CoinAmount.value),
      Comment: this.CoinComment.value
    }
    url = 'Update_Log_For_Coin_Transfer'
    try {

      this._appService.postMethod_admin(url, body)
        .subscribe((resp: any) => {
          if (resp.success) {
            this.onCancelCoins()
            this.getReferralLog()
            this.nzMessageService.success(resp.extras.Status)


          } else {
            this.isCoinAddBtnLoading = false
            this.nzMessageService.error(resp.extras.msg)
          }
        },
          resp => {
            this.isCoinAddBtnLoading = false
            if (resp.error.extras.code == 1 || resp.error.extras.code == '1') {
              this._appService.sessionHandling()
            } else {
              this.nzMessageService.error(resp.error.extras.msg);

            }
          })
    } catch (e) { }
  }
  getAdminInfo() {

    const body = {
    }
    try {
      this._appService.postMethod_admin('Fetch_Admin_Complete_Information', body)
        .subscribe((resp: any) => {
          if (resp.success) {
            this.AdminInfo = resp.extras.Data

          } else {
            this.nzMessageService.error(resp.extras.msg)
          }
        },
          (resp: any) => {
            if (resp.error.extras.code == 1 || resp.error.extras.code == '1') {
              this._appService.sessionHandling()
            } else {
              this.nzMessageService.error(resp.error.extras.msg);

            }
          })
    } catch (e) {

    }


  }
  onInactive(data: any) {
    const body = {
      USERID: data.USERID
    }
    try {
      this._appService.postMethod_admin('Inactivate_User', body)
        .subscribe((resp: any) => {
          if (resp.success) {
            this.nzMessageService.success(resp.extras.Status)
            this.getTablelist()
          } else {
            this.nzMessageService.error(resp.extras.msg)
          }
        },
          (resp: any) => {

            if (resp.error.extras.code == 1 || resp.error.extras.code == '1') {
              this._appService.sessionHandling()
            } else {
              this.nzMessageService.error(resp.error.extras.msg);

            }
          })
    } catch (e) {

    }

  }
  onActive(data: any) {
    const body = {
      USERID: data.USERID
    }
    try {
      this._appService.postMethod_admin('Activate_User', body)
        .subscribe((resp: any) => {
          if (resp.success) {
            this.nzMessageService.success(resp.extras.Status)
            this.getTablelist()
          } else {
            this.nzMessageService.error(resp.extras.msg)
          }
        },
          (resp: any) => {

            if (resp.error.extras.code == 1 || resp.error.extras.code == '1') {
              this._appService.sessionHandling()
            } else {
              this.nzMessageService.error(resp.error.extras.msg);

            }
          })
    } catch (e) {

    }

  }


  getAreaList() {
    let body = {
      skip: 0,
      limit: 1000000,
      Whether_Search_Filter: false,
      Search: '',
      status: true,
      Whether_State_Filter: true,
      StateID: this.EditForm.get('StateId').value,
      Whether_District_Filter: true,
      DistrictID: this.EditForm.get('DistrictId').value,
      Whether_City_Filter: true,
      CityID: this.EditForm.get('CityId').value,
    }
    try {
      this._appService.postMethod_admin('Fetch_All_Areas', body)
        .subscribe(resp => {
          if (resp.success) {
            this.AreaList = resp.extras.Data
            if (this.AreaList.length > 0) {
              this.EditForm.patchValue({
                AreaId: this.EsitselectedData.AreaID,
              })

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

  EditUserList(data: any) {

    this.isEditing = true
    this.EsitselectedData = data
    this.Longitude = this.EsitselectedData.Longitude,
      this.Latitude = this.EsitselectedData.Latitude,
      this.address_GooglePlaces = this.EsitselectedData.Location,
      console.log("data cxxxx", this.EsitselectedData)
    this.EditForm.patchValue({
      StateId: this.EsitselectedData.StateID,
      BusinessId: this.EsitselectedData.BusinessId,
      CommoditiesIDs: this.EsitselectedData.CommoditiesId,
      Address: this.EsitselectedData.Address,
      Description: this.EsitselectedData.Description,
      EmailID: this.EsitselectedData.EmailID,
      GSTNumber: this.EsitselectedData.GST,
      Location: this.EsitselectedData.Location,
      OwnerName: this.EsitselectedData.OwnerName,
      PhoneNumber2: this.EsitselectedData.PhoneNumber2,
      PincodeNumber: this.EsitselectedData.PincodeNumber,
      WhetherCommodityIdsExist: this.EsitselectedData.CommoditiesId.length > 0 ? true : false,
      Whether_Hide_Mobile_Number: this.EsitselectedData.Whether_Hide_Mobile_Number,
      Whether_Hide__Secondary_Mobile_Number: this.EsitselectedData.Whether_Hide__Secondary_Mobile_Number,
      Whether_Hide_Shop_Number: this.EsitselectedData.Whether_Hide_Shop_Number,

      ShopName: this.EsitselectedData.ShopName,
      ShopNumber: this.EsitselectedData.ShopNumber
    })
    if (this.EsitselectedData.Whether_Image_Available) {
      this.ImageData = []
      this.ImageData.push(this.EsitselectedData.Image_Information)

    }
    if (this.EsitselectedData.Whether_Shop_Gallery_Available) {
      this.ImageDataMul = []
      this.ImageDataMul = this.EsitselectedData.Gallery_Images

    }
  }
  submitForm() {
    let body = {
      USERID:this.EsitselectedData.USERID,
      AreaName: "",
      Whether_AreaName_Exists: false,
      Address: this.EditForm.value.Address,
      AreaId: this.EditForm.value.AreaId,
      BusinessId: this.EditForm.value.BusinessId,
      CityId: this.EditForm.get('CityId').value,
      CommoditiesIDs: this.EditForm.get('CommoditiesIDs').value,
      Description: this.EditForm.value.Description,
      DistrictId: this.EditForm.get('DistrictId').value,
      EmailID: this.EditForm.value.EmailID,
      GSTNumber: this.EditForm.value.GSTNumber,
      Latitude: this.Latitude,
      Longitude: this.Longitude,
      Location: this.address_GooglePlaces,
      OwnerName: this.EditForm.value.OwnerName,
      PhoneNumber2: this.EditForm.value.PhoneNumber2,
      PincodeNumber: this.EditForm.value.PincodeNumber,
      ShopName: this.EditForm.value.ShopName,
      ShopNumber: this.EditForm.value.ShopNumber,
      StateId: this.EditForm.get('StateId').value,
      WhetherCommodityIdsExist: this.EditForm.get('CommoditiesIDs').value.length > 0 ? true : false,
      Whether_Hide_Mobile_Number: this.EditForm.value.Whether_Hide_Mobile_Number,
      Whether_Hide__Secondary_Mobile_Number: this.EditForm.value.Whether_Hide__Secondary_Mobile_Number,
      Whether_Hide_Shop_Number: this.EditForm.value.Whether_Hide_Shop_Number,
      Whether_Image_Available: this.ImageData.length > 0 ? true : false,
      ImageID: this.ImageData.length > 0 ? this.ImageData[0].ImageID : '',
      Whether_ImageID_Array_Available: this.ImageDataMul.length > 0 ? true : false,
      ImageID_Array: this.ImageDataMul.length > 0 ? this.ImageDataMul.map((data: any) => data.ImageID) : [],

    }
    try {

      this._appService.postMethod_admin('Edit_User_From_Admin', body)
        .subscribe(resp => {
          if (resp.success) {
            this.nzMessageService.success(resp.extras.Status);
            this.getTablelist()
            this.CancelForm()
          } else {
            this.nzMessageService.error(resp.extras.msg);
          }
        },
          error => {
            this.nzMessageService.error(error.error.extras.msg);
          })

    } catch (e) { }
  }
  CancelForm() {
    this.isEditing = false
    this.EditForm.reset()
    this.ValidatingStatus = ''
    this.ErrorTip = ''
  }

  addresChange() {
    var autocomplete: any;
    var options = { componentRestrictions: { country: "IN" } };
    let updateBranchAddress = <HTMLInputElement>document.getElementById('addressEdit');
    autocomplete = new google.maps.places.Autocomplete(updateBranchAddress)
    google.maps.event.addListener(autocomplete, 'place_changed', () => {
      this.ngZone.run(() => {
        // this.zoom = 17;
        var place = autocomplete.getPlace();

        if (place.geometry === undefined || place.geometry === null) {
          return;
        }
        this.address_GooglePlaces = place.formatted_address
        this.Latitude = place.geometry.location.lat();
        this.Longitude = place.geometry.location.lng();
      });
    });

  }



  beforeUpload = (file: any): boolean => {
    this.isImageUploading = true
    this.postMethodImage(file, 1)
    return false;
  }
  beforeUploadMult = (file: any): boolean => {
    this.isImageUploading1 = true
    this.postMethodImage(file, 2)
    return false;
  }
  postMethodImage(imageFile: any, type: number) {
    const formData = new FormData();
    let url = 'Upload_Image'
    let key = 'image'

    formData.append(key, imageFile);
    const req = new HttpRequest('POST', this._appService.ImageUrl + url, formData, {
      reportProgress: true,
      withCredentials: false
    });
    this._appService.onUploadFile(req)
      .subscribe(
        (event: any) => {
          if (event instanceof HttpResponse) {
            if (type == 1) {
              this.ImageData = []
              this.ImageData.push(event.body.extras)
              this.nzMessageService.success(' Image Upoladed Sucessfully')
              this.isImageUploading = false
            } else if (type == 2) {
              this.ImageDataMul.push(event.body.extras)
              this.nzMessageService.success(' Image Upoladed Sucessfully')
              this.isImageUploading1 = false
            }

            // this.onCloseImageDrawer()

          } else if (event instanceof HttpResponse) {
            this.isImageUploading = false
            this.isImageUploading1 = false
          }
        },
        resp => {
          this.isImageUploading = false
          this.isImageUploading1 = false
          this.nzMessageService.error(resp.error.extras.msg);
        }

      );
  }
  onRemove() {

  }
  checkGSTNumber(CategoryNumber: string) {
    // if (CategoryNumber.length > 0) {
      // const NumberPattern = '^(0|[1-9][0-9]*)$'
        this.ValidatingStatus = 'validating'
        const body = {
          GSTNumber: CategoryNumber,
          USERID: this.isEditing ? this.EsitselectedData.USERID : ""
        }
        try {
          this._appService.postMethod_admin('Validate_GST_Admin', body)
            .subscribe(resp => {
              if (resp.success) {
                this.ValidatingStatus = 'success'
              } else {
                this.ValidatingStatus = 'error'
                this.ErrorTip = resp.extras.msg
                // this.nzMessageService.error(resp.extras.msg)

              }
            },
              resp => {
                this.ValidatingStatus = "error"
                this.ErrorTip = resp.error.extras.msg


              })
        } catch (e) {

        }
    // } else {
    //   this.ValidatingStatus = 'null'
    // }
  }
}

