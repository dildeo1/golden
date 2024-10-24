import { Routes, RouterModule } from '@angular/router';
import { CitySectionComponent } from './City-section.component';

const routes: Routes = [
  {path:'',component:CitySectionComponent  },
];

export const CitySectionRoutes = RouterModule.forChild(routes);
