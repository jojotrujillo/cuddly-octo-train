import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from "@angular/forms";
import { IconModule } from '@progress/kendo-angular-icons';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ZipperPlanComponent } from './zipper-plan/zipper-plan.component';
import { GridModule } from '@progress/kendo-angular-grid';
import { ZipperPlanService } from './zipper-plan/zipper-plan.service';

@NgModule({
  declarations: [
    AppComponent,
    ZipperPlanComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GridModule,
    HttpClientModule,
    IconModule,
    DropDownsModule,
    ReactiveFormsModule
  ],
  providers: [ZipperPlanService],
  bootstrap: [AppComponent]
})
export class AppModule { }
