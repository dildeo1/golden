import { Routes, RouterModule } from '@angular/router';
import { AreaSectionComponent } from './Area-section.component';

const routes: Routes = [
  {path:'',component:AreaSectionComponent  },
];

export const AreaSectionRoutes = RouterModule.forChild(routes);
