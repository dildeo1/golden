import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';

import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDropDownModule, } from 'ng-zorro-antd/dropdown';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule, } from 'ng-zorro-antd/form';
import { NzInputModule, } from 'ng-zorro-antd/input';
import { ReactiveFormsModule } from '@angular/forms';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzProgressModule } from 'ng-zorro-antd/progress';

@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,

    NzMenuModule,
    NzAvatarModule,
    NzGridModule,
    NzLayoutModule,
    NzDividerModule,
    NzIconModule,
    NzDropDownModule,
    NzModalModule,
    NzFormModule,
    ReactiveFormsModule,
    NzInputModule,
    NzProgressModule,
    NzMessageModule,

  ],
  declarations: [DashboardComponent]
})
export class DashboardModule { }
