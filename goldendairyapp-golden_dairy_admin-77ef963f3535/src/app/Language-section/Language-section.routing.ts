import { Routes, RouterModule } from '@angular/router';
import { LanguageSectionComponent } from './Language-section.component';

const routes: Routes = [
  {path:'',component:LanguageSectionComponent  },
];

export const LanguageSectionRoutes = RouterModule.forChild(routes);
