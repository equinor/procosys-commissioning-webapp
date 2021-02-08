import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { dummyChecklistResponse } from './dummyData';
import objectToCamelCase from '../utils/objectToCamelCase';

export const baseURL = 'https://dummy-url.com';
export const putMetaTableCellURL = `${baseURL}/CheckList/Item/MetaTableCell*`;
export const getChecklistURL = `${baseURL}/CheckList/Comm*`;

export const server = setupServer(
    rest.put(putMetaTableCellURL, (request, response, context) => {
        return response(context.status(200));
    }),
    rest.get(getChecklistURL, (request, response, context) => {
        return response(
            context.delay(200),
            context.json(objectToCamelCase(dummyChecklistResponse)),
            context.status(200)
        );
    })
);
export { rest };

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());
