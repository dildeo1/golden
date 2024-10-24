import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminSectionComponent } from './admin-section.component';

const routes: Routes = [
    { path: '', component: AdminSectionComponent }
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminSectionRoutingModule {}
