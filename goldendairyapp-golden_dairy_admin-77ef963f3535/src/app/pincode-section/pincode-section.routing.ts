import { Routes, RouterModule } from '@angular/router';
import { PincodeSectionComponent } from './pincode-section.component';
import { PincodeSectionModule } from './pincode-section.module';

const routes: Routes = [
  {path:'',component:PincodeSectionComponent  },
];

export const PincodeSectionRoutes = RouterModule.forChild(routes);
