import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReportedUsersComponent } from './reported-users.component';

const routes: Routes = [
    { path: '', component: ReportedUsersComponent }
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ReportedUsersRoutingModule {}
