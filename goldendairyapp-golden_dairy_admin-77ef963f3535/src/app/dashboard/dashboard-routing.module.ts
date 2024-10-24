import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
  {
    path: '', component: DashboardComponent,
    children: [
      {
        path: 'admin-section',
        loadChildren: () => import('../admin-section/admin-section.module').then(m => m.AdminSectionModule)
      },
      {
        path:'State-module',
        loadChildren: () =>import('../State-module/State-module.module').then(m=>m.StateModuleModule)
      },
      {
        path:'District-section',
        loadChildren: () =>import('../District-section/District-section.module').then(m=>m.DistrictSectionModule)
      },
      {
        path:'City-section',
        loadChildren: () =>import('../City-section/City-section.module').then(m=>m.CitySectionModule)
      },
     
      
      {
        path:'Area-section',
        loadChildren: () =>import('../Area-section/Area-section.module').then(m=>m.AreaSectionModule)
      },
      {
        path:'Pincode-section',
        loadChildren: () =>import('../pincode-section/pincode-section.module').then(m=>m.PincodeSectionModule)
      },
      {
        path:'Business-section',
        loadChildren: () =>import('../Business-section/Business-section.module').then(m=>m.BusinessSectionModule)
      },
      {
        path:'Commodities-section',
        loadChildren: () =>import('../Commodities-section/Commodities-section.module').then(m=>m.CommoditiesSectionModule)
      },
      {
        path:'Language-section',
        loadChildren: () =>import('../Language-section/Language-section.module').then(m=>m.LanguageSectionModule)
      },
      {
        path:'Script-section',
        loadChildren: () =>import('../Script-section/Script-section.module').then(m=>m.ScriptSectionModule)
      },
      {
        path:'ratings',
        loadChildren: () =>import('../rating-term/rating-term.module').then(m=>m.RatingTermModule)
      },
      {
        path:'user-posts',
        loadChildren: () =>import('../user-Posts/user-Posts.module').then(m=>m.UserPostsModule)
      },
      {
        path:'subscription',
        loadChildren: () =>import('../subscriptions/subscriptions.module').then(m=>m.SubscriptionsModule)
      },
      {
        path:'banners',
        loadChildren: () =>import('../banners/banners.module').then(m=>m.BannersModule)
      },
      {
        path:'terms-conditions',
        loadChildren: () =>import('../terms-conditions/terms-conditions.module').then(m=>m.TermsConditionsModule)
      },
      {
        path:'Referrals',
        loadChildren: () =>import('../Referrals/Referrals.module').then(m=>m.ReferralsModule)
      },
      {
        path:'bulk-notifications',
        loadChildren: () =>import('../bulk-notifications/bulk-notifications.module').then(m=>m.BulkNotificationsModule)
      },
      {
        path:'users',
        loadChildren: () =>import('../users/users.module').then(m=>m.UsersModule)
      },
      {
        path:'reported-posts',
        loadChildren: () =>import('../reported-posts/reported-posts.module').then(m=>m.ReportedPostsModule)
      },
      {
        path:'reported-users',
        loadChildren: () =>import('../reported-users/reported-users.module').then(m=>m.ReportedUsersModule)
      },
      {
        path:'my-profile',
        loadChildren: () =>import('../my-profile/my-profile.module').then(m=>m.MyProfileModule)
      },
     
     
      {
        path: '', redirectTo: 'my-profile', pathMatch: 'prefix'
      },
    ]
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
