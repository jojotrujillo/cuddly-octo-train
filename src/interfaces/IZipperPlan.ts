export interface IZipperPlan {
  resourcePlanContactId?: number; // Resource Plan Contact, aka Zipper Plan
  roleDropdownConfigKey: number;
  disciplineDropdownConfigKey: number;
  zipperLevelDropdownConfigKey: number;
  districtKey: number;
  pernr?: string;
  name: string;
  phoneNumber?: string;
  email?: string;
  isDisabled?: boolean;
  isNew?: boolean;
  isDirty?: boolean;
}
