import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BulkNotificationsComponent } from './bulk-notifications.component';

const routes: Routes = [
    { path: '', component: BulkNotificationsComponent }
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BulkNotificationsRoutingModule {}
