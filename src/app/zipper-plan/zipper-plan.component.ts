import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ZipperPlanService } from './zipper-plan.service';
import { IZipperPlan } from 'src/interfaces/IZipperPlan';
import { IComboBoxItem } from 'src/interfaces/IComboBoxItem';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-zipper-plan',
  templateUrl: './zipper-plan.component.html',
  styleUrls: ['./zipper-plan.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ZipperPlanComponent implements OnInit {
  public formGroup: FormGroup | undefined;
  public roles: IComboBoxItem[] = [];
  public disciplines: IComboBoxItem[] = [];
  public zipperLevels: IComboBoxItem[] = [];
  public districts: IComboBoxItem[] = [];
  public zipperPlans: IZipperPlan[] = [
    {
      resourcePlanContactId: 1,
      roleDropdownConfigKey: 1,
      disciplineDropdownConfigKey: 1,
      zipperLevelDropdownConfigKey: 1,
      districtKey: 1,
      pernr: '442499',
      name: 'John Doe',
      phoneNumber: '555-555-5555',
      email: 'John.Doe@example.com'
    }
  ];

  public createFormGroup = (dataItem: IZipperPlan) =>
    new FormGroup({
      resourcePlanContactId: new FormControl(dataItem.resourcePlanContactId),
      roleDropdownConfigKey: new FormControl(dataItem.roleDropdownConfigKey),
      disciplineDropdownConfigKey: new FormControl(dataItem.disciplineDropdownConfigKey),
      zipperLevelDropdownConfigKey: new FormControl(dataItem.zipperLevelDropdownConfigKey),
      districtKey: new FormControl(dataItem.districtKey),
      pernr: new FormControl(dataItem.pernr),
      name: new FormControl(dataItem.name),
      phoneNumber: new FormControl(dataItem.phoneNumber),
      email: new FormControl(dataItem.email),
      isNew: new FormControl(dataItem.isNew)
    });

  constructor(private zipperPlanService: ZipperPlanService) { }

  ngOnInit(): void {
    this.zipperPlanService.getUserByPernr('442499').subscribe((data) => {
      console.log(data);
    })
  }

  public role(dropdownConfigKey: number): IComboBoxItem | undefined {
    return this.roles.find((x) => x.value === dropdownConfigKey);
  }
}
