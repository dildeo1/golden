import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { LoginRoutes } from './login.routing';


import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzModalModule } from 'ng-zorro-antd/modal';




@NgModule({
  imports: [
    CommonModule,
    LoginRoutes,
    NzButtonModule,
    NzGridModule,
    NzLayoutModule,
    NzIconModule,
    NzInputModule,
    NzMessageModule,
    ReactiveFormsModule,
    NzFormModule,
    NzSelectModule,
    FormsModule,
    NzModalModule
  ],
  declarations: [LoginComponent]
})
export class LoginModule { }
