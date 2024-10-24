import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserPostsComponent } from './user-Posts.component';

const routes: Routes = [
    { path: '', component: UserPostsComponent }
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserPostsRoutingModule {}
