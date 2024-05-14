import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IActiveDirectoryUserClientContract } from '../../interfaces/IActiveDirectoryUserClientContract';
import { IZipperPlan } from 'src/interfaces/IZipperPlan';
import { IDropdownConfig } from 'src/interfaces/IDropdownConfig';
import { IDropdownConfigItem } from 'src/interfaces/IDropdownConfigItem';

const cloneData = (data: IZipperPlan[]): IZipperPlan[] =>
  data.map((item: IZipperPlan) => Object.assign({}, item));

const itemIndex = (item: IZipperPlan, data: IZipperPlan[]): number => {
  for (let idx = 0; idx < data.length; idx++) {
    if (data[idx].resourcePlanContactKey === item.resourcePlanContactKey) {
      return idx;
    }
  }

  return -1;
};

@Injectable({ providedIn: 'root' })
export class ZipperPlanService extends BehaviorSubject<IZipperPlan[]> {
  public data: IZipperPlan[] = [];

  private counter: number;
  private originalData: IZipperPlan[] = [];
  private createdItems: IZipperPlan[] = [];
  private updatedItems: IZipperPlan[] = [];
  private deletedItems: IZipperPlan[] = [];

  constructor(private http: HttpClient) {
    super([]);
  }

  public getDropdownConfigs(): Observable<IDropdownConfig[]> {
    return this.http.get<IDropdownConfig[]>(
      'http://localhost:3000/api/DropdownConfigs'
    );
  }

  public getLatestUserInformation(data: IZipperPlan[], roles: IDropdownConfigItem[]) {
    data.forEach((item: IZipperPlan) => {
      const userRole = roles.find((role: IDropdownConfigItem) => item.roleDropdownConfigKey === role.value)!;

      if (
        item.pernr &&
        !userRole.display.toLowerCase().includes('external')
      ) {
        this.getUserByPernr(item.pernr).subscribe({
          next: (user: IActiveDirectoryUserClientContract) => {
            if (item.name !== user.firstName + ' ' + user.lastName) {
              item.name = user.firstName + ' ' + user.lastName;
            }

            if (
              item.phoneNumber !== user.businessPhone &&
              item.phoneNumber !== user.mobilePhone &&
              (user.businessPhone || user.mobilePhone)
            ) {
              item.phoneNumber = user.businessPhone || user.mobilePhone;
            }

            if (item.email !== user.email2) {
              item.email = user.email2;
            }
          },
          error: () => {
            item.name = '';
            item.phoneNumber = '';
            item.email = '';
          }
        });
      }
    });
  }

  public getUserByPernr(
    pernr: string
  ): Observable<IActiveDirectoryUserClientContract> {
    return this.http.get<IActiveDirectoryUserClientContract>(
      `http://localhost:3000/api/Users/GetUser/${pernr}`
    );
  }

  // #region CRUD operations

  public create(item: IZipperPlan): void {
    this.createdItems.push(item);
    // this.data.unshift(item);

    super.next(this.data);
  }

  public hasChanges(): boolean {
    return Boolean(
      this.deletedItems.length ||
      this.updatedItems.length ||
      this.createdItems.length
    );
  }

  public read(roles: IDropdownConfigItem[]): void {
    if (this.data.length) {
      return super.next(this.data);
    }

    this.getZipperPlans(1).subscribe((data) => {
      this.data = data;
      this.originalData = cloneData(data);
      this.counter = data.length;
      super.next(data);

      this.getLatestUserInformation(data, roles);
    });
  }

  public remove(item: IZipperPlan): void {
    let index = itemIndex(item, this.data);
    this.data.splice(index, 1);

    index = itemIndex(item, this.createdItems);
    if (index >= 0) {
      this.createdItems.splice(index, 1);
    } else {
      this.deletedItems.push(item);
    }

    index = itemIndex(item, this.updatedItems);
    if (index >= 0) {
      this.updatedItems.splice(index, 1);
    }

    super.next(this.data);
  }

  public save(item: IZipperPlan, isNew: boolean): void {
    if (isNew) {
      item.resourcePlanContactKey = ++this.counter;
      this.data.splice(0, 0, item);
    } else {
      Object.assign(
        this.data.find(
          ({ resourcePlanContactKey }) =>
            resourcePlanContactKey === item.resourcePlanContactKey
        )!,
        item
      );
    }
  }

  public saveChanges(): void {
    if (!this.hasChanges()) {
      return;
    }

    // Logic may differ since API only accepts one item at a time
    const completed = [];

    if (this.deletedItems.length) {
      completed.push(
        this.http.post(
          'http://localhost:42069/api/ResourcePlans/Contacts/Delete',
          this.deletedItems
        )
      );
    }

    if (this.updatedItems.length) {
      completed.push(
        this.http.post(
          'http://localhost:42069/api/ResourcePlans/Contacts/Update',
          this.updatedItems
        )
      );
    }

    if (this.createdItems.length) {
      completed.push(
        this.http.post(
          'http://localhost:42069/api/ResourcePlans/Contacts/Create',
          this.createdItems
        )
      );
    }

    this.reset();
  }

  public update(item: IZipperPlan): void {
    if (!item.isNew) {
      const index = itemIndex(item, this.updatedItems);

      if (index !== -1) {
        this.updatedItems.splice(index, 1, item);
      } else {
        this.updatedItems.push(item);
      }
    } else {
      const index = this.createdItems.indexOf(item);
      this.createdItems.splice(index, 1, item);
    }
  }

  // #endregion

  // #region Private methods

  private getZipperPlans(resourcePlanKey: number): Observable<IZipperPlan[]> {
    return this.http.get<IZipperPlan[]>(
      `http://localhost:3000/api/ResourcePlans/${resourcePlanKey}/Contacts`
    );
  }

  private reset(): void {
    this.data = [];
    this.deletedItems = [];
    this.updatedItems = [];
    this.createdItems = [];
  }

  // #endregion
}
