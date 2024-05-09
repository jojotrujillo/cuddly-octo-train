import { rest } from 'msw';
import { mockGetUserResponse } from './mockGetUserResponse';
import { mockGetZipperPlansResponse } from './mockGetZipperPlansResponse';

export const handlers = [
  rest.get(
    'http://localhost:42069/api/Users/GetUser/:pernr',
    (req, res, ctx) => {
      return res(ctx.json(mockGetUserResponse));
    }
  ),
  rest.get(
    'http://localhost:42069/api/ResourcePlans/:resourcePlanKey/Contacts',
    (req, res, ctx) => {
      return res(ctx.json(mockGetZipperPlansResponse));
    }
  ),
];
