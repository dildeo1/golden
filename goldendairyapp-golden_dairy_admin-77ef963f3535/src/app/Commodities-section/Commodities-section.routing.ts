import { Routes, RouterModule } from '@angular/router';
import { CommoditiesSectionComponent } from './Commodities-section.component';

const routes: Routes = [
  {path:'',component:CommoditiesSectionComponent  },
];

export const CommoditiesSectionRoutes = RouterModule.forChild(routes);
