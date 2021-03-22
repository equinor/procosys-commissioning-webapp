import { setupServer } from 'msw/node';
import { rest } from 'msw';
import {
    dummyChecklistResponse,
    dummyCommPkgDetailsResponse,
    dummyPunchListResponse,
    dummyScopeResponse,
    dummyTaskAttachmentsResponse,
    dummyTaskParametersResponse,
    dummyTaskResponse,
    dummyTasksResponse,
    testProjects,
} from './dummyData';
import objectToCamelCase from '../utils/objectToCamelCase';

export const baseURL = 'https://test-url.com';
export const ENDPOINTS = {
    putMetaTableCell: `${baseURL}/CheckList/Item/MetaTableCell`,
    getChecklist: `${baseURL}/CheckList/CommPkg`,
    getScope: `${baseURL}/CommPkg/CheckLists`,
    getTasks: `${baseURL}/CommPkg/Tasks`,
    getPunchList: `${baseURL}/CommPkg/PunchList`,
    getCommPkgDetails: `${baseURL}/CommPkg`,
    getPermissions: `${baseURL}/Permissions`,
    getProjects: `${baseURL}/Projects`,
    getTask: `${baseURL}/CommPkg/Task`,
    getTaskParameters: `${baseURL}/CommPkg/Task/Parameters`,
    putTaskParameter: `${baseURL}/CommPkg/Task/Parameters/Parameter`,
    getTaskAttachments: `${baseURL}/CommPkg/Task/Attachments`,
    getTaskAttachment: `${baseURL}/CommPkg/Task/Attachment`,
    putTaskComment: `${baseURL}/CommPkg/Task/Comment`,
    postTaskSign: `${baseURL}/CommPkg/Task/Sign`,
    postTaskUnsign: `${baseURL}/CommPkg/Task/Unsign`,
};

export const server = setupServer(
    rest.put(ENDPOINTS.putMetaTableCell, (request, response, context) => {
        return response(context.status(200));
    }),
    rest.get(ENDPOINTS.getChecklist, (request, response, context) => {
        return response(
            context.delay(200),
            context.json(objectToCamelCase(dummyChecklistResponse)),
            context.status(200)
        );
    }),
    rest.get(ENDPOINTS.getScope, (request, response, context) => {
        return response(
            context.delay(10),
            context.json(objectToCamelCase(dummyScopeResponse)),
            context.status(200)
        );
    }),
    rest.get(ENDPOINTS.getTasks, (request, response, context) => {
        return response(
            context.delay(10),
            context.json(objectToCamelCase(dummyTasksResponse)),
            context.status(200)
        );
    }),
    rest.get(ENDPOINTS.getPunchList, (request, response, context) => {
        return response(
            context.delay(10),
            context.json(objectToCamelCase(dummyPunchListResponse)),
            context.status(200)
        );
    }),
    rest.get(ENDPOINTS.getCommPkgDetails, (request, response, context) => {
        return response(
            context.delay(10),
            context.json(objectToCamelCase(dummyCommPkgDetailsResponse)),
            context.status(200)
        );
    }),
    rest.get(ENDPOINTS.getProjects, (request, response, context) => {
        return response(
            context.delay(10),
            context.json(testProjects),
            context.status(200)
        );
    }),
    rest.get(ENDPOINTS.getPermissions, (request, response, context) => {
        return response(
            context.delay(10),
            context.json(['COMMPKG/READ']),
            context.status(200)
        );
    }),
    rest.get(ENDPOINTS.getTask, (request, response, context) => {
        return response(
            context.delay(10),
            context.json(dummyTaskResponse),
            context.status(200)
        );
    }),
    rest.get(ENDPOINTS.getTaskAttachments, (request, response, context) => {
        return response(
            context.delay(10),
            context.json(dummyTaskAttachmentsResponse),
            context.status(200)
        );
    }),
    rest.get(ENDPOINTS.getTaskAttachment, (request, response, context) => {
        return response(
            context.delay(10),
            context.json(new Blob()),
            context.status(200)
        );
    }),
    rest.get(ENDPOINTS.getTaskParameters, (request, response, context) => {
        return response(
            context.delay(10),
            context.json(dummyTaskParametersResponse),
            context.status(200)
        );
    }),
    rest.put(ENDPOINTS.putTaskComment, (request, response, context) => {
        return response(context.delay(10), context.status(200));
    }),
    rest.post(ENDPOINTS.postTaskSign, (request, response, context) => {
        return response(context.delay(10), context.status(200));
    }),
    rest.post(ENDPOINTS.postTaskUnsign, (request, response, context) => {
        return response(context.delay(10), context.status(200));
    }),
    rest.put(ENDPOINTS.putTaskParameter, (request, response, context) => {
        return response(context.status(200));
    })
);
export { rest };

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());
