import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AppService } from '../app.service';
import { Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-admin-section',
  templateUrl: './admin-section.component.html',
  styleUrls: ['./admin-section.component.scss']
})
export class AdminSectionComponent implements OnInit {
  skip = 0;
  limit = this._appService.limit;
  currentPage = 1;
  TotalItems: any;
  isTableloading: boolean=false;

  adminList:any = []

  Status:any;


  updatePasswordForm:any= FormGroup
  isPasswordVisible: boolean=false;
  selectedAdminData: any={};
  isEditing: boolean=false;
  isAdding: boolean=false;

  addForm:any= FormGroup
  selectedData: any={};
  isAddBtnLoading: boolean=false;

  errorTip: any;
  passwordValidation: string='';

  validateStatusConfirmPass: string='';
  errortipValidate: any
  isRolesModal: boolean= false;
  isRolesBtnLoading: boolean=false;
  selectedRole = new FormControl(null);
  modularAccessList:any = [];
  selectedRoleData: any;
  
  constructor(
    private fb: FormBuilder,
    private nzMessageService: NzMessageService,
    public _appService: AppService
  ) { }

  ngOnInit() {
    this.onTabClick(true)
    this.addForm = this.fb.group({
      Name: [null, [Validators.required]],
      PhoneNumber: [null, [Validators.required]],
      EmailID: [null, [Validators.required]],
      Password: [null, [Validators.required]],
      Designation: [null, [Validators.required]],
      Whether_Admin_Section: [false, [Validators.required]],
    })
    this.updatePasswordForm = this.fb.group({
      Password: [null, [Validators.required]],
      Confirm_Password: [null, [Validators.required]],
    })
    this.updatePasswordForm.get('Password').valueChanges.subscribe((data:any)=>{
      if (this.passwordValidation != 'error') {
        if (this.updatePasswordForm.get('Confirm_Password').valid) {
          if (this.updatePasswordForm.get('Password').value === this.updatePasswordForm.get('Confirm_Password').value) {
            this.validateStatusConfirmPass = 'success'
          } else {
            this.validateStatusConfirmPass = 'error'
            this.errortipValidate = "Password Doesn't Match"
          }
        } else {
          this.validateStatusConfirmPass = ''
        }
      }else {
        this.validateStatusConfirmPass = ''
        // this.passwordValidation = ''
      }
    })

    this.updatePasswordForm.get('Confirm_Password').valueChanges.subscribe((data: any) => {
      if (this.passwordValidation != 'error') {
        if (this.updatePasswordForm.get('Confirm_Password').valid) {
          if (this.updatePasswordForm.get('Password').value === this.updatePasswordForm.get('Confirm_Password').value) {
            this.validateStatusConfirmPass = 'success'
          } else {
            this.validateStatusConfirmPass = 'error'
            this.errortipValidate = "Password Doesn't Match"
          }
        } else {
          this.validateStatusConfirmPass = ''
        }
      }else {
        this.validateStatusConfirmPass = ''
        // this.passwordValidation = ''
      }
    })
  }
  onTabClick(tabNumber: boolean) {
    this.Status = tabNumber,
    this.skip=0
    this.getAdminList()
  }
  getAdminList() {
    const body = {
      skip: this.skip,
      limit: this.limit,
      Whether_Status_Filter:true,
      status:this.Status
    }
    try {
      this.isTableloading = true;
      this._appService.postMethod_admin('Filter_All_Admin_Users', body)
        .subscribe(resp => {
          if (resp.success) {
            this.isTableloading = false;
            if (this.skip == 0) {
              this.currentPage = 1
              this.TotalItems = resp.extras.Count
            }
            this.TotalItems = resp.extras.Count
            this.adminList = resp.extras.Data
          } else {
            this.isTableloading = false;
            this.nzMessageService.error(resp.extras.msg)
          }
        },
          resp => {
            this.isTableloading = false;
            if(resp.error.extras.code ==1 || resp.error.extras.code =='1'){
              this._appService.sessionHandling()
            }else {
              this.nzMessageService.error(resp.error.extras.msg);

            }
          })
    } catch (e) {

    }
  }
  onNextPage(event: number) {
    this.currentPage = event
    this.skip = (event - 1) * this.limit
    this.getAdminList()
  }
  onAction(data:any) {
    let url = ''
    if (data.Status) {
      url = 'Inactivate_Admin'
    } else {
      url = 'Activate_Admin'
    }
    let body = {
      Selected_AdminID: data.AdminID,

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
            this.getAdminList()
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
  onUpdatePassword(data:any) {
    this.selectedAdminData = data
    this.isPasswordVisible = true
  }
  onCancelModal() {
    this.isPasswordVisible = false
    this.updatePasswordForm.reset()
    this.passwordValidation =''
    this.validateStatusConfirmPass = ''
  }
  onUpdatePasswordDetails() {
    if(this.passwordValidation == 'error' || this.validateStatusConfirmPass == 'error'){
    }else {
      const body = {
        Selected_AdminID: this.selectedAdminData.AdminID,
        Password: this.updatePasswordForm.value.Password
      }
      try {
        this._appService.postMethod_admin('Update_Admin_Password', body)
          .subscribe(resp => {
            if (resp.success) {
              this.nzMessageService.create('success', resp.extras.Status);
              this.onCancelModal()
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
  
  }
  onAdd(){
    this.isEditing = false
    this.isAdding = true
  }
  onEdit(data:any) {
    this.isEditing = true
    this.isAdding = true
    this.selectedData = data
    this.addForm.patchValue({
      Name: this.selectedData.Name,
      EmailID: this.selectedData.EmailID,
      PhoneNumber: this.selectedData.PhoneNumber,
      Designation: this.selectedData.Designation,
      Whether_Admin_Section: this.selectedData.Roles.Whether_Admin_Section,
    }, { emitEvent: false })
  }
  onClose(){
    this.isEditing = false
    this.isAdding = false
    this.isAddBtnLoading = false
    this.addForm.reset()

  }
  onsubmit() {
    this.isAddBtnLoading = true
    let body = {}
    let url = ''
    if (this.isEditing) {
      body = {
        Selected_AdminID: this.selectedData.AdminID,
        Name: this.addForm.value.Name,
        EmailID: this.addForm.value.EmailID,
        PhoneNumber: this.addForm.value.PhoneNumber,
        Designation: this.addForm.value.Designation,
        Roles: {
          Whether_Admin_Section:this.addForm.value.Whether_Admin_Section
        }
      }
      url = 'Update_Admin_Information'
    }
    else {
      body = {
        Name: this.addForm.value.Name,
        EmailID: this.addForm.value.EmailID,
        Password: this.addForm.value.Password,
        PhoneNumber: this.addForm.value.PhoneNumber,
        Designation: this.addForm.value.Designation,
        Roles: {
          Whether_Admin_Section:this.addForm.value.Whether_Admin_Section
        }
      }
      url = 'Create_Admin_User'
    }
    try {

      this._appService.postMethod_admin(url, body)
        .subscribe((resp: any) => {
          if (resp.success) {
            this.onClose()
            this.getAdminList()
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
  checkPassword() {
    if (this.updatePasswordForm.value.Password.length > 0) {
      this.passwordValidation = "validating"
      let body = {
        Password: this.updatePasswordForm.value.Password,
      }
      try {
        this._appService.postMethod_admin('Common_Password_Validation', body)

          .subscribe(resp => {
            if (resp.success) {
              this.updatePasswordForm.get('Password').setErrors(null)
              this.passwordValidation = 'success'
            } else {

            }
          },
            resp => {
              this.updatePasswordForm.get('Password').setErrors({pattern:true})
              this.passwordValidation = 'error'
              this.errorTip = resp.error.extras.msg
            })
      } catch (e) { }
    } else {
      this.passwordValidation = 'null'
    }


  }
  // onLinkRoleModal(data:any) {
  //   this.selectedRoleData = data
  //   this.isRolesModal = true
  //   this.isRolesBtnLoading = false
  //   this.getModularAccessList()
   
  // }
  getModularAccessList() {
    const body = {
      Whether_Search_Filter: false,
      Whether_Status_Filter: true,
      Status:true,
      skip: 0,
      limit: 100000
    }
    try {
      this._appService.postMethod_admin('List_all_ModularAccess', body)
        .subscribe(resp => {
          if (resp.success) {
            this.modularAccessList = resp.extras.Data


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
  onCancelRolesModal() {
    this.isRolesModal = false
    this.isRolesBtnLoading = false
    this.selectedRole.reset({
      Whether_Admin_Section:false
    })
  }
  onSubmitModularAccess() {
    this.isRolesBtnLoading = true
    const body = {
      Modular_ID: this.selectedRole.value,
      Apply_AdminID: this.selectedRoleData.AdminID,
    }
    try {
      this._appService.postMethod_admin('Apply_Admin_ModularAccess', body)
        .subscribe(resp => {
          if (resp.success) {
            this.nzMessageService.success(resp.extras.Status)
            this.modularAccessList = resp.extras.Data
            this.onCancelRolesModal()


          } else {
            this.isRolesBtnLoading = false
            this.nzMessageService.error(resp.extras.msg)
          }
        },
          resp => {
            this.isRolesBtnLoading = false
            if(resp.error.extras.code ==1 || resp.error.extras.code =='1'){
              this._appService.sessionHandling()
            }else {
              this.nzMessageService.error(resp.error.extras.msg);

            }
          })
    } catch (e) {

    }
  }
}
