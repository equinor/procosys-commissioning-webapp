import { setupServer } from 'msw/node';
import { rest } from 'msw';

export const baseURL = 'https://dummy-url.com';
export const putMetaTableCellURL = `*`;
//${baseURL}/CheckList/Item/MetaTableCell*
export const server = setupServer(
    rest.put(putMetaTableCellURL, (request, response, context) => {
        return response(context.status(200));
    })
);
export { rest };

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());
