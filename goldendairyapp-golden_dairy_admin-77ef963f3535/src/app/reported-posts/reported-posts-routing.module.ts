import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReportedPostsComponent } from './reported-posts.component';

const routes: Routes = [
    { path: '', component: ReportedPostsComponent }
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ReportedPostsRoutingModule {}
