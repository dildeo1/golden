import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SubscriptionsComponent } from './subscriptions.component';

const routes: Routes = [
    { path: '', component: SubscriptionsComponent }
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SubscriptionsRoutingModule {}
