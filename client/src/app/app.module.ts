import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ZipperPlanComponent } from './zipper-plan/zipper-plan.component';
import { GridModule } from '@progress/kendo-angular-grid';
import { ZipperPlanService } from './zipper-plan/zipper-plan.service';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DialogsModule } from "@progress/kendo-angular-dialog";

@NgModule({
  declarations: [AppComponent, ZipperPlanComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    GridModule,
    HttpClientModule,
    ButtonsModule,
    InputsModule,
    LayoutModule,
    DropDownsModule,
    ReactiveFormsModule,
    DialogsModule,
  ],
  providers: [ZipperPlanService],
  bootstrap: [AppComponent],
})
export class AppModule { }
