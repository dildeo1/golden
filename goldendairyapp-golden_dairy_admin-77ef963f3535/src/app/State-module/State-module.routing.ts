import { Routes, RouterModule } from '@angular/router';
import { StateModuleComponent } from './State-module.component';

const routes: Routes = [
  {path:'',component:StateModuleComponent  },
];

export const StateModuleRoutes = RouterModule.forChild(routes);
