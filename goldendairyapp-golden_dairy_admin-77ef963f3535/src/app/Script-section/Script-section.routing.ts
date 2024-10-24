import { Routes, RouterModule } from '@angular/router';
import { ScriptSectionComponent } from './Script-section.component';

const routes: Routes = [
  {path:'',component:ScriptSectionComponent  },
];

export const ScriptSectionRoutes = RouterModule.forChild(routes);
