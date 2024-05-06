import { rest } from 'msw';
import { mockGetUserResponse } from './mockGetUserResponse';

export const handlers = [
    rest.get('http://localhost:42069/api/Users/GetUser/:pernr', (req, res, ctx) => {
        return res(ctx.json({ ...mockGetUserResponse }))
    })
]
