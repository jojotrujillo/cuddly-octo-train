import {
  Component,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ZipperPlanService } from './zipper-plan.service';
import { IZipperPlan } from 'src/interfaces/IZipperPlan';
import { IDropdownConfig } from 'src/interfaces/IDropdownConfig';
import { IDropdownConfigItem } from 'src/interfaces/IDropdownConfigItem';
import { FormControl, FormGroup } from '@angular/forms';
import {
  CellClickEvent,
  GridComponent,
  RemoveEvent,
} from '@progress/kendo-angular-grid';
import { Subscription } from 'rxjs';
import { IActiveDirectoryUserClientContract } from 'src/interfaces/IActiveDirectoryUserClientContract';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-zipper-plan',
  templateUrl: './zipper-plan.component.html',
  styleUrls: ['./zipper-plan.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ZipperPlanComponent implements OnInit, OnDestroy {
  @ViewChild(GridComponent)
  private grid: GridComponent; // Note: This has to be instantiated before formGroup or else formGroup will take on GridComponent type

  public formGroup: FormGroup | undefined;
  public roles: IDropdownConfigItem[];
  public disciplines: IDropdownConfigItem[];
  public zipperLevels: IDropdownConfigItem[];
  public districts: IDropdownConfigItem[];
  public defaultDropdownValue: IDropdownConfigItem = {
    display: 'PLEASE SELECT',
    value: -1,
  };
  public isDisabled: boolean = true;

  private docClickSubscription: Subscription = new Subscription();
  private editedRowIndex: number | undefined;
  private firstRowIndex: number = 0;
  private isNew: boolean;

  constructor(
    private renderer: Renderer2,
    public zipperPlanService: ZipperPlanService
  ) { }

  // #region Lifecycle hooks

  public ngOnDestroy(): void {
    this.docClickSubscription.unsubscribe();
  }

  public ngOnInit(): void {
    this.docClickSubscription.add(
      this.renderer.listen('document', 'click', this.onDocumentClick.bind(this))
    );

    this.zipperPlanService.getDropdownConfigs().subscribe({
      next: (data: IDropdownConfig[]) => {
        this.roles = data.find((x) => x.categoryName === 'Role')?.dropdownItems ?? [];
        this.disciplines = data.find((x) => x.categoryName === 'Discipline')?.dropdownItems ?? [];
        this.zipperLevels = data.find((x) => x.categoryName === 'ZipperLevel')?.dropdownItems ?? [];
        this.districts = data.find((x) => x.categoryName === 'District')?.dropdownItems ?? [];

        this.zipperPlanService.read(this.roles);
      },
    });

  }

  // #endregion

  public addHandler(): void {
    // this.addZipperPlanRow();

    this.closeEditor();

    this.formGroup = this.createFormGroup({
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
    this.isNew = true;

    // this.addZipperPlanRow();
    this.grid.addRow(this.formGroup);
  }

  public cellClickHandler(args: CellClickEvent): void {
    if (args.isEdited || (this.formGroup && !this.formGroup.valid)) {
      return;
    }

    if (this.isNew) {
      args.rowIndex += 1;
    }

    this.saveCurrent();

    this.formGroup = this.createFormGroup(args.dataItem);
    this.editedRowIndex = args.rowIndex;

    this.grid.editRow(args.rowIndex, this.formGroup);
  }

  // public cellCloseHandler(args: CellCloseEvent): void {
  //   const { column, dataItem, formGroup } = args;

  //   if (!formGroup.valid) {
  //     args.preventDefault();
  //   } else if (formGroup.dirty) {
  //     if (args.originalEvent && args.originalEvent.keyCode === Keys.Escape) {
  //       return;
  //     }
  //
  //     Object.assign(dataItem, formGroup.value);
  //     this.zipperPlanService.update(dataItem);
  //   }
  // }

  public createFormGroup = (dataItem: IZipperPlan) =>
    new FormGroup({
      resourcePlanContactKey: new FormControl(dataItem.resourcePlanContactKey),
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

  matches = (el: any, selector: string) =>
    (el.matches || el.msMatchesSelector).call(el, selector);

  public onPernrTextboxBlur(): void {
    const pernrInputValue = this.formGroup?.get('pernr')?.value as number;

    if (pernrInputValue) {
      this.zipperPlanService
        .getUserByPernr(pernrInputValue.toString())
        .subscribe({
          next: (user: IActiveDirectoryUserClientContract) => {
            this.setUserInfoValues(
              user.firstName + ' ' + user.lastName,
              user.businessPhone
                ? user.businessPhone
                : user.mobilePhone
                  ? user.mobilePhone
                  : '',
              user.email2
            );
          },
          error: (error: HttpErrorResponse) => {
            this.setUserInfoValues();

            switch (error.status) {
              case 400:
                alert('Validation error');
                break;
              case 404:
                alert('User not found');
                break;
              default:
                alert('Internal server error');
                break;
            }
          },
        });
    }

    this.setUserInfoValues();
  }

  public onRoleValueChange(newValue: number): void {
    const roleDropdownConfig: IDropdownConfigItem = this.roles.find(
      (role: IDropdownConfigItem) => role.value === newValue
    ) ?? {
      value: 0,
      display: '',
    };

    if (roleDropdownConfig.display.toLowerCase().includes('external')) {
      this.isDisabled = false;
      this.formGroup?.get('pernr')?.setValue('TBD');
      this.setUserInfoValues();
    } else {
      this.isDisabled = true;
      this.formGroup?.get('pernr')?.setValue('');
      this.setUserInfoValues();
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

  public discipline(dropdownConfigKey: number): IDropdownConfigItem | undefined {
    return this.disciplines.find((x) => x.value === dropdownConfigKey);
  }

  public district(dropdownConfigKey: number): IDropdownConfigItem | undefined {
    return this.districts.find((x) => x.value === dropdownConfigKey);
  }

  public role(dropdownConfigKey: number): IDropdownConfigItem | undefined {
    return this.roles.find((x) => x.value === dropdownConfigKey);
  }

  public zipperLevel(dropdownConfigKey: number): IDropdownConfigItem | undefined {
    return this.zipperLevels.find((x) => x.value === dropdownConfigKey);
  }

  // #endregion

  // #region Private methods

  private addZipperPlanRow(): void {
    if (this.formGroup) {
      const formGroupValue = this.formGroup.value as IZipperPlan;
      const rowToAdd = [formGroupValue][this.firstRowIndex];
      const index = this.zipperPlanService.data.findIndex(
        ({ resourcePlanContactKey }) =>
          resourcePlanContactKey === rowToAdd.resourcePlanContactKey
      );

      if (index === -1) {
        this.zipperPlanService.create(rowToAdd);
      } else {
        this.zipperPlanService.data[index] = rowToAdd;
      }
    }
  }

  private closeEditor(): void {
    this.grid.closeRow(this.editedRowIndex);

    this.isNew = false;
    this.editedRowIndex = undefined;
    this.formGroup = undefined;
  }

  private onDocumentClick(e: Event): void {
    if (
      this.formGroup &&
      this.formGroup.valid &&
      !this.matches(
        e.target,
        '#zipperPlanGrid tbody *, #zipperPlanGrid .k-grid-toolbar .k-button'
      )
    ) {
      this.saveCurrent();
    }
  }

  private saveCurrent(): void {
    if (this.formGroup) {
      this.zipperPlanService.save(this.formGroup.value, this.isNew);
      this.closeEditor();
    }
  }

  private setUserInfoValues(
    nameValue: string = '',
    phoneNumberValue: string = '',
    emailValue: string = ''
  ): void {
    this.formGroup?.get('name')?.setValue(nameValue);
    this.formGroup?.get('phoneNumber')?.setValue(phoneNumberValue);
    this.formGroup?.get('email')?.setValue(emailValue);
  }

  // #endregion
}
