import { setupServer } from 'msw/node';
import { rest } from 'msw';
import {
    dummyChecklistResponse,
    dummyCommPkgDetailsResponse,
    dummyPunchListResponse,
    dummyScopeResponse,
    dummyTasksResponse,
} from './dummyData';
import objectToCamelCase from '../utils/objectToCamelCase';

export const baseURL = 'https://dummy-url.com';
export const putMetaTableCellURL = `${baseURL}/CheckList/Item/MetaTableCell*`;
export const getChecklistURL = `${baseURL}/CheckList/Comm*`;
export const getScopeURL = `${baseURL}/CommPkg/CheckLists*`;
export const getTasksURL = `${baseURL}/CommPkg/Tasks*`;
export const getPunchListURL = `${baseURL}/CommPkg/PunchList*`;
export const getCommPkgDetailsURL = `*`;

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
    }),
    rest.get(getScopeURL, (request, response, context) => {
        return response(
            context.delay(10),
            context.json(objectToCamelCase(dummyScopeResponse)),
            context.status(200)
        );
    }),
    rest.get(getTasksURL, (request, response, context) => {
        return response(
            context.delay(10),
            context.json(objectToCamelCase(dummyTasksResponse)),
            context.status(200)
        );
    }),
    rest.get(getPunchListURL, (request, response, context) => {
        return response(
            context.delay(10),
            context.json(objectToCamelCase(dummyPunchListResponse)),
            context.status(200)
        );
    }),
    rest.get(getCommPkgDetailsURL, (request, response, context) => {
        return response(
            context.delay(10),
            context.json(objectToCamelCase(dummyCommPkgDetailsResponse)),
            context.status(200)
        );
    })
);
export { rest };

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());
