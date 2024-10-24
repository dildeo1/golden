import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TermsConditionsComponent } from './terms-conditions.component';
import { TermsConditionsRoutingModule } from './terms-conditions-routing.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CKEditorModule } from 'ngx-ckeditor';

@NgModule({
  imports: [
    CommonModule,
    TermsConditionsRoutingModule,

    
    ReactiveFormsModule,
    FormsModule,
    NzFormModule,
    NzCardModule,
    NzTableModule,
    NzButtonModule,
    NzModalModule,
    NzTabsModule,
    NzSelectModule,
    NzIconModule,
    NzInputModule,
    NzDropDownModule,
    NzPopconfirmModule,
    NzPaginationModule,
    NzSwitchModule,
    CKEditorModule
  ],
  declarations: [TermsConditionsComponent]
})
export class TermsConditionsModule { }
