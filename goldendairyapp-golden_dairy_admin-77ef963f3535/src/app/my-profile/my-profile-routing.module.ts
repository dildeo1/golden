import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MyProfileComponent } from './my-profile.component';

const routes: Routes = [
    { path: '', component: MyProfileComponent }
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MyProfileRoutingModule {}
