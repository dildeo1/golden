import { Routes, RouterModule } from '@angular/router';
import { DistrictSectionComponent } from './District-section.component';

const routes: Routes = [
  {path:'',component:DistrictSectionComponent  },
];

export const DistrictSectionRoutes = RouterModule.forChild(routes);
