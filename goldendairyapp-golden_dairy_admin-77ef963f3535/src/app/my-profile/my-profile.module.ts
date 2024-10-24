import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyProfileComponent } from './my-profile.component';
import { MyProfileRoutingModule } from './my-profile-routing.module';


import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTabsModule } from 'ng-zorro-antd/tabs';

@NgModule({
  imports: [
    CommonModule,
    MyProfileRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NzCardModule,
    NzSwitchModule,
    NzTableModule,
    NzPaginationModule,
    NzPopconfirmModule,
    NzDropDownModule,
    NzFormModule,
    NzButtonModule,
    NzInputModule,
    NzIconModule,
    NzModalModule,
    NzSelectModule,
    NzTabsModule
  ],
  declarations: [MyProfileComponent]
})
export class MyProfileModule { }
