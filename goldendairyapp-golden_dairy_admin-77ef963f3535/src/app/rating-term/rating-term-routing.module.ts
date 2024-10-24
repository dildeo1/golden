import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RatingTermComponent } from './rating-term.component';

const routes: Routes = [
    { path: '', component: RatingTermComponent }
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RatingTermRoutingModule {}
