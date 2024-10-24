import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DistrictSectionComponent } from './District-section.component';
import { DistrictSectionRoutes } from './District-section.routing';

import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
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
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  imports: [
    CommonModule,
    DistrictSectionRoutes,
    ReactiveFormsModule,
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
    NzSwitchModule
  ],
  declarations: [DistrictSectionComponent]
})
export class DistrictSectionModule { }
