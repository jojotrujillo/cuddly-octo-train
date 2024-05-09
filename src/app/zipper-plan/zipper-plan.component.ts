import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ZipperPlanService } from './zipper-plan.service';
import { IZipperPlan } from 'src/interfaces/IZipperPlan';
import { IComboBoxItem } from 'src/interfaces/IComboBoxItem';
import { FormControl, FormGroup } from '@angular/forms';
import {
  CellClickEvent,
  CellCloseEvent,
  GridComponent,
  RemoveEvent,
} from '@progress/kendo-angular-grid';
import { Keys } from '@progress/kendo-angular-common';

@Component({
  selector: 'app-zipper-plan',
  templateUrl: './zipper-plan.component.html',
  styleUrls: ['./zipper-plan.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ZipperPlanComponent implements OnInit {
  @ViewChild('grid', { static: true }) public grid: GridComponent | undefined;
  public formGroup: FormGroup | undefined;
  public roles: IComboBoxItem[] = [
    {
      display: 'Role 1',
      value: 1,
    },
    {
      display: 'Role 2',
      value: 2,
    },
    {
      display: 'Role 3',
      value: 3,
    },
    {
      display: 'External - Role 4',
      value: 4,
    },
    {
      display: 'External - Role 5',
      value: 5,
    },
  ];
  public disciplines: IComboBoxItem[] = [
    {
      display: 'Discipline 1',
      value: 1,
    },
    {
      display: 'Discipline 2',
      value: 2,
    },
    {
      display: 'Discipline 3',
      value: 3,
    },
  ];
  public zipperLevels: IComboBoxItem[] = [
    {
      display: 'Zipper Level 1',
      value: 1,
    },
    {
      display: 'Zipper Level 2',
      value: 2,
    },
    {
      display: 'Zipper Level 3',
      value: 3,
    },
  ];
  public districts: IComboBoxItem[] = [
    {
      display: 'District 1',
      value: 1,
    },
    {
      display: 'District 2',
      value: 2,
    },
    {
      display: 'District 3',
      value: 3,
    },
  ];
  public defaultDropdownValue: IComboBoxItem = {
    display: 'PLEASE SELECT',
    value: -1,
  };
  public isDisabled: boolean = true;
  private editedRowIndex: number | undefined;
  private tempResourcePlanContactId: number = 0;
  private firstRowIndex: number = 0;

  public createFormGroup = (dataItem: IZipperPlan) =>
    new FormGroup({
      resourcePlanContactId: new FormControl(dataItem.resourcePlanContactId),
      roleDropdownConfigKey: new FormControl(dataItem.roleDropdownConfigKey),
      disciplineDropdownConfigKey: new FormControl(
        dataItem.disciplineDropdownConfigKey
      ),
      zipperLevelDropdownConfigKey: new FormControl(
        dataItem.zipperLevelDropdownConfigKey
      ),
      districtKey: new FormControl(dataItem.districtKey),
      pernr: new FormControl(dataItem.pernr),
      name: new FormControl(dataItem.name),
      phoneNumber: new FormControl(dataItem.phoneNumber),
      email: new FormControl(dataItem.email),
      isNew: new FormControl(dataItem.isNew),
    });

  constructor(public zipperPlanService: ZipperPlanService) {}

  ngOnInit(): void {
    this.zipperPlanService.read();
  }

  public addHandler(): void {
    this.addZipperPlanRow();

    if (this.grid !== undefined) this.closeEditor(this.grid);

    this.tempResourcePlanContactId =
      this.findHighestResourcePlanContactId() + 1;

    this.formGroup = this.createFormGroup({
      resourcePlanContactId: this.tempResourcePlanContactId,
      roleDropdownConfigKey: 0,
      disciplineDropdownConfigKey: 0,
      zipperLevelDropdownConfigKey: 0,
      districtKey: 0,
      pernr: undefined,
      name: '',
      phoneNumber: undefined,
      email: undefined,
      isNew: true,
    });

    this.addZipperPlanRow();
    if (this.grid !== undefined) this.closeEditor(this.grid);
  }

  public cellClickHandler(args: CellClickEvent): void {
    if (!args.isEdited) {
      args.sender.editCell(
        args.rowIndex,
        args.columnIndex,
        this.createFormGroup(args.dataItem)
      );
    }
  }

  public cellCloseHandler(args: CellCloseEvent): void {
    const { column, dataItem, formGroup } = args;

    if (!formGroup.valid) {
      args.preventDefault();
    } else if (formGroup.dirty) {
      if (args.originalEvent && args.originalEvent.keyCode === Keys.Escape) {
        return;
      }

      if (column.field === 'pernr') {
        const pernrInputValue = formGroup.get('pernr')?.value;
        if (pernrInputValue) {
          this.zipperPlanService
            .getUserByPernr(pernrInputValue)
            .subscribe((user) => {
              dataItem.name = user.firstName + ' ' + user.lastName;
              dataItem.phoneNumber = user.businessPhone
                ? user.businessPhone
                : user.mobilePhone
                ? user.mobilePhone
                : '';
              dataItem.email = user.email2;
            });
        }
      }

      Object.assign(dataItem, formGroup.value);
      this.zipperPlanService.update(dataItem);
    }
  }

  public removeHandler(args: RemoveEvent): void {
    this.zipperPlanService.remove(args.dataItem);

    args.sender.cancelCell();
  }

  public saveChanges(): void {
    if (this.grid !== undefined) {
      this.grid.closeCell();
      this.grid.cancelCell();
    }

    this.zipperPlanService.saveChanges();
  }

  // #region Display text parsers for dropdowns

  public discipline(dropdownConfigKey: number): IComboBoxItem | undefined {
    return this.disciplines.find((x) => x.value === dropdownConfigKey);
  }

  public district(dropdownConfigKey: number): IComboBoxItem | undefined {
    return this.districts.find((x) => x.value === dropdownConfigKey);
  }

  public role(dropdownConfigKey: number): IComboBoxItem | undefined {
    return this.roles.find((x) => x.value === dropdownConfigKey);
  }

  public zipperLevel(dropdownConfigKey: number): IComboBoxItem | undefined {
    return this.zipperLevels.find((x) => x.value === dropdownConfigKey);
  }

  // #endregion

  private addZipperPlanRow(): void {
    if (this.formGroup) {
      const formGroupValue = this.formGroup.value as IZipperPlan;
      const rowToAdd = [formGroupValue][this.firstRowIndex];
      const index = this.zipperPlanService.data.findIndex(
        ({ resourcePlanContactId }) =>
          resourcePlanContactId === rowToAdd.resourcePlanContactId
      );

      if (index === -1) {
        this.zipperPlanService.create(rowToAdd);
      } else {
        this.zipperPlanService.data[index] = rowToAdd;
      }
    }
  }

  private closeEditor(
    grid: GridComponent,
    rowIndex = this.editedRowIndex
  ): void {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    this.formGroup = undefined;
  }

  private findHighestResourcePlanContactId(): number {
    const zipperPlans = this.zipperPlanService.data;
    let highestResourcePlanContactId = 0;
    zipperPlans.forEach((zipperPlan) => {
      if (
        zipperPlan.resourcePlanContactId &&
        zipperPlan.resourcePlanContactId > highestResourcePlanContactId
      ) {
        highestResourcePlanContactId = zipperPlan.resourcePlanContactId;
      }
    });
    return highestResourcePlanContactId;
  }
}
