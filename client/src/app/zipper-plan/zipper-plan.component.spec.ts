import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZipperPlanComponent } from './zipper-plan.component';

describe('ZipperPlanComponent', () => {
  let component: ZipperPlanComponent;
  let fixture: ComponentFixture<ZipperPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZipperPlanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ZipperPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
