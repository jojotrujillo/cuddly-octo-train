import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ZipperPlanComponent } from './zipper-plan/zipper-plan.component';

const routes: Routes = [
  { path: 'contacts', component: ZipperPlanComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
