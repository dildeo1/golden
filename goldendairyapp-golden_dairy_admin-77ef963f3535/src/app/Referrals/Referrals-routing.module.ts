import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReferralsComponent } from './Referrals.component';

const routes: Routes = [
    { path: '', component: ReferralsComponent }
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ReferralsRoutingModule {}
