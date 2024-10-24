import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AppService } from '../app.service';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.css']
})
export class SubscriptionsComponent implements OnInit {
  skip: number = 0;
  currentPage: number = 1;
  limit = this._appService.limit;
  isTableloading: boolean = false;
  TotalItems: any;
  tableList: any = []

  Status: boolean = true;
  selectedData: any

  isEditing = false
  isAdding = false
  isAddBtnLoading: boolean = false;
  addForm: any = FormGroup;
  Search = new FormControl('')

  constructor(
    private fb: FormBuilder,
    private nzMessageService: NzMessageService,
    public _appService: AppService
  ) { }

  ngOnInit() {
    this.addForm = this.fb.group({
      SNo: [null, [Validators.required]],
      Subscription_Name: [null, [Validators.required]],
      // Description: [null, [Validators.required]],
      IsRecommended: [false, [Validators.required]],
      IsFreePlan: [false, [Validators.required]],
      Duration: [null, [Validators.required]],
      Amount: [null, [Validators.required]],
      Plan_Details: [null, [Validators.required]],
      // Benefits: [[], [Validators.required]],
      // Benefits: new FormArray([], [Validators.required]),
      No_of_Photos: [null, [Validators.required]],
    });
    this.Search.valueChanges.subscribe((data) => {
      this.skip = 0
      this.getTableList()
    })
    this.onTabClick(true)
  }
  onTabClick(tabNumber: boolean) {
    this.Status = tabNumber,
      this.skip = 0
    this.getTableList()

  }
  getTableList() {
    this.isTableloading = true
    let body = {
      skip: this.skip,
      limit: this.limit,
      Status: this.Status,
      Whether_Search_Filter: this.Search.value.length > 0 ? true : false,
      Search: this.Search.value,

    }
    try {

      this._appService.postMethod_admin('List_All_Subscriptions', body)
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
    this.getTableList()
  }
  onAction(data: any) {
    let body = {}
    let url =''
    if (data.Status) {
      body = {
        SubscriptionID: data.SubscriptionID,
      }
      url = 'Remove_Subscription'

    } else {
      body = {
        SubscriptionID: data.SubscriptionID,
      }
      url = 'Active_Subscription'
    }

    try {
      this._appService.postMethod_admin(url, body)
        .subscribe(resp => {
          if (resp.success) {
            let msg;
            if (data.Status) {
              msg = 'Inactivated Successfully'
            } else {
              msg = 'Activated Successfully'
            }
            this.nzMessageService.success(msg)
            this.getTableList()
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

  onAdd() {
    this.isAdding = true
    this.isEditing = false
  }

  onEdit(data: any) {
    this.isEditing = true
    this.isAdding = true
    this.selectedData = data
    // let BenefitsArray = this.selectedData.Benefits
    // for (let i = 0; i < BenefitsArray.length; i++) {
    //   this.addControls()
    // }
    // let Benefits = []
    // Benefits = this.selectedData.Benefits
    // let numbers: any = []
    // Benefits.forEach((item: any) => {
    //   numbers.push({
    //     Benefit: item
    //   })
    // })
    this.addForm.patchValue({
      Subscription_Name: data.Subscription_Name,
      // Description: data.Description,
      IsRecommended: data.IsRecommended,
      IsFreePlan: data.IsFreePlan,
      SNo: data.SNo,
      Duration: data.Duration,
      Amount: data.Amount,
      Plan_Details: data.Plan_Details,
      // Benefits: numbers,
      No_of_Photos: data.Max_Photos,
    }, { emitEvent: false })
  }

  onClose() {
    this.isAdding = false;
    this.isEditing = false
    this.addForm.reset({
      IsRecommended: false,
      IsFreePlan: false,
    })
    this.isAddBtnLoading = false

    // const control = this.addForm.controls.Benefits as FormArray;
    // control.clear()
  }
  onsubmit() {
    this.isAddBtnLoading = true
    let body = {}
    let url = ''
    // if (this.addForm.value.Benefits.length > 0) {
    //   let selectedBenefits = []
    //   selectedBenefits = this.addForm.value.Benefits
    //   var backendNumbers: any = []
    //   selectedBenefits.forEach((item: any) => {
    //     backendNumbers.push(item.Benefit)
    //   })
    // }


    if (this.isEditing) {
      body = {
        SubscriptionID: this.selectedData.SubscriptionID,
        SNo: +this.addForm.value.SNo,
        Subscription_Name: this.addForm.value.Subscription_Name,
        Subscription_Type: 1,
        Duration_Type: 3,
        // Description: this.addForm.value.Description,
        IsRecommended: this.addForm.value.IsRecommended,
        // IsRecommended: this.addForm.value.IsRecommended,
        // IsRecommended: this.addForm.value.IsRecommended,
        IsFreePlan: this.addForm.value.IsFreePlan,
        Duration: +this.addForm.value.Duration,

        Amount: +this.addForm.value.Amount,
        Plan_Details: this.addForm.value.Plan_Details,
        // Benefits: backendNumbers,
        No_of_Photos: +this.addForm.value.No_of_Photos,

      }
      url = 'Edit_Subscription'
    }
    else {
      body = {
        SNo: +this.addForm.value.SNo,
        Subscription_Name: this.addForm.value.Subscription_Name,
        Subscription_Type: 1,
        Duration_Type: 3,
        // Description: this.addForm.value.Description,
        IsRecommended: this.addForm.value.IsRecommended,
        IsFreePlan: this.addForm.value.IsFreePlan,
        Duration: +this.addForm.value.Duration,

        Amount: +this.addForm.value.Amount,
        Plan_Details: this.addForm.value.Plan_Details,
        // Benefits: backendNumbers,
        No_of_Photos: +this.addForm.value.No_of_Photos,

      }
      url = 'Create_Subscription'
    }
    try {

      this._appService.postMethod_admin(url, body)
        .subscribe((resp: any) => {
          if (resp.success) {
            this.onClose()
            this.getTableList()
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
  addControls() {
    const control = <FormArray>this.addForm.controls['Benefits'];
    control.push(this.onPushArrayControls());
  }
  onRemoveControls(j: number) {
    const control = <FormArray>this.addForm.controls['Benefits'];
    control.removeAt(j);
  }
  onPushArrayControls() {
    return new FormGroup({
      Benefit: new FormControl(null, [Validators.required]),
    });

  }
  get arrayControls() {
    return this.addForm.get('Benefits');
  }
}
