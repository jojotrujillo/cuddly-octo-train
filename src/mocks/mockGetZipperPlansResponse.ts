import { IZipperPlan } from 'src/interfaces/IZipperPlan';

export const mockGetZipperPlansResponse: IZipperPlan[] = [
  {
    resourcePlanContactId: 1,
    roleDropdownConfigKey: 1,
    disciplineDropdownConfigKey: 1,
    zipperLevelDropdownConfigKey: 1,
    districtKey: 1,
    pernr: '442499',
    name: 'John Doe',
  },
  {
    resourcePlanContactId: 2,
    roleDropdownConfigKey: 2,
    disciplineDropdownConfigKey: 2,
    zipperLevelDropdownConfigKey: 2,
    districtKey: 2,
    pernr: '442500',
    name: 'Jane Doe',
  },
  {
    resourcePlanContactId: 3,
    roleDropdownConfigKey: 3,
    disciplineDropdownConfigKey: 3,
    zipperLevelDropdownConfigKey: 3,
    districtKey: 3,
    pernr: '442501',
    name: 'John Smith',
  },
];
