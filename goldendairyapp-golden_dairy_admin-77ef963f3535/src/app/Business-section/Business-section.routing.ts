import { Routes, RouterModule } from '@angular/router';
import { BusinessSectionComponent } from './Business-section.component';

const routes: Routes = [
  {path:'',component:BusinessSectionComponent  },
];

export const BusinessSectionRoutes = RouterModule.forChild(routes);
