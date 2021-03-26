import { setupServer } from 'msw/node';
import { DefaultRequestBody, MockedRequest, rest, RestHandler } from 'msw';
import {
    dummyChecklistResponse,
    dummyCommPkgDetailsResponse,
    dummyPunchListResponse,
    dummyScopeResponse,
    dummyAttachmentsResponse,
    dummyTaskParametersResponse,
    dummyTaskResponse,
    dummyTasksResponse,
    testProjects,
} from './dummyData';
import objectToCamelCase from '../utils/objectToCamelCase';

export const baseURL = 'https://test-url.com';
export const ENDPOINTS = {
    putMetaTableCell: `${baseURL}/CheckList/Item/MetaTableCell`,
    getChecklist: `${baseURL}/CheckList/Comm`,
    getChecklistAttachments: `${baseURL}/CheckList/Attachments`,
    putChecklistComment: `${baseURL}/CheckList/Comm/Comment`,
    postSetNA: `${baseURL}/CheckList/Item/SetNA`,
    postSetOk: `${baseURL}/CheckList/Item/SetOk`,
    postClear: `${baseURL}/CheckList/Item/Clear`,
    postSign: `${baseURL}/CheckList/Comm/Sign`,
    postUnsign: `${baseURL}/CheckList/Comm/Unsign`,
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
    rest.put(ENDPOINTS.putMetaTableCell, (_, response, context) => {
        return response(context.status(200));
    }),
    rest.get(ENDPOINTS.getChecklist, (_, response, context) => {
        return response(
            context.json(objectToCamelCase(dummyChecklistResponse)),
            context.status(200)
        );
    }),
    rest.get(ENDPOINTS.getChecklistAttachments, (_, response, context) => {
        return response(
            context.delay(10),
            context.json(objectToCamelCase(dummyAttachmentsResponse)),
            context.status(200)
        );
    }),
    rest.post(ENDPOINTS.postSetNA, (_, response, context) => {
        return response(context.status(200));
    }),
    rest.post(ENDPOINTS.postSetOk, (_, response, context) => {
        return response(context.status(200));
    }),
    rest.post(ENDPOINTS.postClear, (_, response, context) => {
        return response(context.status(200));
    }),
    rest.put(ENDPOINTS.putChecklistComment, (_, response, context) => {
        return response(context.status(200));
    }),
    rest.post(ENDPOINTS.postSign, (_, response, context) => {
        return response(context.status(200));
    }),
    rest.post(ENDPOINTS.postUnsign, (_, response, context) => {
        return response(context.status(200));
    }),
    rest.get(ENDPOINTS.getScope, (_, response, context) => {
        return response(
            context.json(objectToCamelCase(dummyScopeResponse)),
            context.status(200)
        );
    }),
    rest.get(ENDPOINTS.getTasks, (_, response, context) => {
        return response(
            context.json(objectToCamelCase(dummyTasksResponse)),
            context.status(200)
        );
    }),
    rest.get(ENDPOINTS.getPunchList, (_, response, context) => {
        return response(
            context.json(objectToCamelCase(dummyPunchListResponse)),
            context.status(200)
        );
    }),
    rest.get(ENDPOINTS.getCommPkgDetails, (_, response, context) => {
        return response(
            context.json(objectToCamelCase(dummyCommPkgDetailsResponse)),
            context.status(200)
        );
    }),
    rest.get(ENDPOINTS.getProjects, (_, response, context) => {
        return response(context.json(testProjects), context.status(200));
    }),
    rest.get(ENDPOINTS.getPermissions, (_, response, context) => {
        return response(context.json(['COMMPKG/READ']), context.status(200));
    }),
    rest.get(ENDPOINTS.getTask, (_, response, context) => {
        return response(context.json(dummyTaskResponse), context.status(200));
    }),
    rest.get(ENDPOINTS.getTaskAttachments, (_, response, context) => {
        return response(
            context.json(dummyAttachmentsResponse),
            context.status(200)
        );
    }),
    rest.get(ENDPOINTS.getTaskAttachment, (_, response, context) => {
        return response(context.json(new Blob()), context.status(200));
    }),
    rest.get(ENDPOINTS.getTaskParameters, (_, response, context) => {
        return response(
            context.json(dummyTaskParametersResponse),
            context.status(200)
        );
    }),
    rest.put(ENDPOINTS.putTaskComment, (_, response, context) => {
        return response(context.status(200));
    }),
    rest.post(ENDPOINTS.postTaskSign, (_, response, context) => {
        return response(context.status(200));
    }),
    rest.post(ENDPOINTS.postTaskUnsign, (_, response, context) => {
        return response(context.status(200));
    }),
    rest.put(ENDPOINTS.putTaskParameter, (_, response, context) => {
        return response(context.status(200));
    })
);

const causeApiError = (
    endpoint: string,
    method: 'get' | 'put' | 'post' | 'delete'
): void => {
    let callToIntercept = rest.get(endpoint, (_, response, context) => {
        return response(context.status(400), context.text('dummy error'));
    });
    if (method === 'post') {
        callToIntercept = rest.post(endpoint, (_, response, context) => {
            return response(context.status(400), context.text('dummy error'));
        });
    }
    if (method === 'put') {
        callToIntercept = rest.put(endpoint, (_, response, context) => {
            return response(context.status(400), context.text('dummy error'));
        });
    }
    if (method === 'get') {
        callToIntercept = rest.get(endpoint, (_, response, context) => {
            return response(context.status(400), context.text('dummy error'));
        });
    }
    if (method === 'delete') {
        callToIntercept = rest.delete(endpoint, (_, response, context) => {
            return response(context.status(400), context.text('dummy error'));
        });
    }
    return server.use(callToIntercept);
};
export { rest, causeApiError };

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());
