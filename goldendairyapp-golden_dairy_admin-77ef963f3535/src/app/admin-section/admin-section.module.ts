import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminSectionComponent } from './admin-section.component';
import { AdminSectionRoutingModule } from './admin-section-routing.module';

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
    AdminSectionRoutingModule,
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
  declarations: [AdminSectionComponent]
})
export class AdminSectionModule { }
