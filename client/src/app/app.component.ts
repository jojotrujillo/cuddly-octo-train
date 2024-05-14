import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'kendo-grid-poc';

  public showZipperPlanDialog = false;

  public showZipperPlanDialogHandler = () => {
    this.showZipperPlanDialog = true;
  }
}
