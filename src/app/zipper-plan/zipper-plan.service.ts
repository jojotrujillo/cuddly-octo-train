import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IActiveDirectoryUserClientContract } from '../../interfaces/IActiveDirectoryUserClientContract';
import { IZipperPlan } from 'src/interfaces/IZipperPlan';

const itemIndex = (item: IZipperPlan, data: IZipperPlan[]): number => {
  for (let idx = 0; idx < data.length; idx++) {
    if (data[idx].resourcePlanContactId === item.resourcePlanContactId) {
      return idx;
    }
  }

  return -1;
};

const cloneData = (data: IZipperPlan[]) =>
  data.map((item) => Object.assign({}, item));

@Injectable({ providedIn: 'root' })
export class ZipperPlanService extends BehaviorSubject<IZipperPlan[]> {
  public data: IZipperPlan[] = [];
  private originalData: IZipperPlan[] = [];
  private createdItems: IZipperPlan[] = [];
  private updatedItems: IZipperPlan[] = [];
  private deletedItems: IZipperPlan[] = [];

  constructor(private http: HttpClient) {
    super([]);
  }

  public getUserByPernr(
    pernr: string
  ): Observable<IActiveDirectoryUserClientContract> {
    return this.http.get<IActiveDirectoryUserClientContract>(
      `http://localhost:42069/api/Users/GetUser/${pernr}`
    );
  }

  private getZipperPlans(resourcePlanKey: number): Observable<IZipperPlan[]> {
    return this.http.get<IZipperPlan[]>(
      `http://localhost:42069/api/ResourcePlans/${resourcePlanKey}/Contacts`
    );
  }

  // #region CRUD operations

  public create(item: IZipperPlan): void {
    this.createdItems.push(item);
    this.data.unshift(item);

    super.next(this.data);
  }

  public read(): void {
    if (this.data.length) {
      return super.next(this.data);
    }

    this.getZipperPlans(1).subscribe((data) => {
      this.data = data;
      this.originalData = cloneData(data);
      super.next(data);
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

  private hasChanges(): boolean {
    return Boolean(
      this.deletedItems.length ||
        this.updatedItems.length ||
        this.createdItems.length
    );
  }

  private reset(): void {
    this.data = [];
    this.deletedItems = [];
    this.updatedItems = [];
    this.createdItems = [];
  }
}
