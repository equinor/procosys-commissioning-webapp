import { rest } from "msw";
import { setupServer } from "msw/node";
import {
  dummyAttachmentsResponse,
  dummyChecklistResponse,
  dummyCommPkgDetailsResponse,
  dummyPermissions,
  dummyPunchCategories,
  dummyPunchItemUncleared,
  dummyPunchListResponse,
  dummyPunchOrganizations,
  dummyPunchTypes,
  dummyScopeResponse,
  dummyTaskParametersResponse,
  dummyTaskResponse,
  dummyTasksResponse,
  testCommSearch,
  testProjects,
  testTagSearch
} from "./dummyData";

export const baseURL = "https://test-url.com";
export const ENDPOINTS = {
  //General
  getCommPkgDetails: `${baseURL}/CommPkg`,
  getPermissions: `${baseURL}/Permissions`,
  getProjects: `${baseURL}/Projects`,

  // Search
  getCommSearch: `${baseURL}/CommPkg/Search`,
  getTagSearch: `${baseURL}/Tag/Search`,

  // Checklist
  putMetaTableCell: `${baseURL}/CheckList/Item/MetaTableCell`,
  getChecklist: `${baseURL}/CheckList/Comm`,
  getChecklistAttachments: `${baseURL}/CheckList/Attachments`,
  putChecklistComment: `${baseURL}/CheckList/Comm/Comment`,
  postSetNA: `${baseURL}/CheckList/Item/SetNA`,
  postSetOk: `${baseURL}/CheckList/Item/SetOk`,
  postClear: `${baseURL}/CheckList/Item/Clear`,
  postSign: `${baseURL}/CheckList/Comm/Sign`,
  postUnsign: `${baseURL}/CheckList/Comm/Unsign`,
  postVerify: `${baseURL}/CheckList/Comm/Verify`,
  postUnverify: `${baseURL}/CheckList/Comm/Unverify`,
  getScope: `${baseURL}/CommPkg/CheckLists`,
  getChecklistPunchList: `${baseURL}/CheckList/PunchList`,
  postCustomCheckItem: `${baseURL}/CheckList/CustomItem`,
  getNextCustomItemNumber: `${baseURL}/CheckList/CustomItem/NextItemNo`,
  deleteCustomCheckItem: `${baseURL}/CheckList/CustomItem`,
  postCustomClear: `${baseURL}/CheckList/CustomItem/Clear`,
  postCustomSetOk: `${baseURL}/CheckList/CustomItem/SetOk`,

  //Task
  getTasks: `${baseURL}/CommPkg/Tasks`,
  getTask: `${baseURL}/CommPkg/Task`,
  getTaskParameters: `${baseURL}/CommPkg/Task/Parameters`,
  putTaskParameter: `${baseURL}/CommPkg/Task/Parameters/Parameter`,
  getTaskAttachments: `${baseURL}/CommPkg/Task/Attachments`,
  getTaskAttachment: `${baseURL}/CommPkg/Task/Attachment`,
  putTaskComment: `${baseURL}/CommPkg/Task/Comment`,
  postTaskSign: `${baseURL}/CommPkg/Task/Sign`,
  postTaskUnsign: `${baseURL}/CommPkg/Task/Unsign`,

  //PUNCH
  getPunchList: `${baseURL}/CommPkg/PunchList`,
  getPunchAttachment: `${baseURL}/PunchListItem/Attachment`,
  deletePunchAttachment: `${baseURL}/PunchListItem/Attachment`,
  postTempPunchAttachment: `${baseURL}/PunchListItem/TempAttachment`,
  postPunchAttachment: `${baseURL}/PunchListItem/Attachment`,
  getPunchAttachments: `${baseURL}/PunchListItem/Attachments`,
  getPunchCategories: `${baseURL}/PunchListItem/Categories`,
  getPunchTypes: `${baseURL}/PunchListItem/Types`,
  getPunchOrganizations: `${baseURL}/PunchListItem/Organizations`,
  postNewPunch: `${baseURL}/PunchListItem`,
  getPunchItem: `${baseURL}/PunchListItem`,
  putPunchClearingBy: `${baseURL}/PunchListItem/SetClearingBy`,
  putPunchRaisedBy: `${baseURL}/PunchListItem/SetRaisedBy`,
  putPunchDescription: `${baseURL}/PunchListItem/SetDescription`,
  putPunchType: `${baseURL}/PunchListItem/SetType`,
  putPunchCategory: `${baseURL}/PunchListItem/SetCategory`,
  postPunchClear: `${baseURL}/PunchListItem/Clear`,
  postPunchUnclear: `${baseURL}/PunchListItem/Unclear`,
  postPunchVerify: `${baseURL}/PunchListItem/Verify`,
  postPunchUnverify: `${baseURL}/PunchListItem/Unverify`,
  postPunchReject: `${baseURL}/PunchListItem/Reject`
};

export const server = setupServer(
  //General
  rest.get(ENDPOINTS.getCommPkgDetails, (_, response, context) => {
    return response(
      context.json(dummyCommPkgDetailsResponse),
      context.status(200)
    );
  }),
  rest.get(ENDPOINTS.getProjects, (_, response, context) => {
    return response(context.json(testProjects), context.status(200));
  }),
  rest.get(ENDPOINTS.getPermissions, (_, response, context) => {
    return response(context.json(dummyPermissions), context.status(200));
  }),

  // Search
  rest.get(ENDPOINTS.getCommSearch, (_, response, context) => {
    return response(context.json(testCommSearch), context.status(200));
  }),
  rest.get(ENDPOINTS.getTagSearch, (_, response, context) => {
    return response(context.json(testTagSearch), context.status(200));
  }),

  //Checklist
  rest.put(ENDPOINTS.putMetaTableCell, (_, response, context) => {
    return response(context.status(200));
  }),
  rest.get(ENDPOINTS.getChecklist, (_, response, context) => {
    return response(context.json(dummyChecklistResponse), context.status(200));
  }),
  rest.get(ENDPOINTS.getChecklistAttachments, (_, response, context) => {
    return response(
      context.delay(10),
      context.json(dummyAttachmentsResponse),
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
  rest.post(ENDPOINTS.postVerify, (_, response, context) => {
    return response(context.status(200));
  }),
  rest.post(ENDPOINTS.postUnverify, (_, response, context) => {
    return response(context.status(200));
  }),
  rest.get(ENDPOINTS.getScope, (_, response, context) => {
    return response(context.json(dummyScopeResponse), context.status(200));
  }),
  rest.get(ENDPOINTS.getChecklistPunchList, (_, response, context) => {
    return response(context.json(dummyPunchListResponse), context.status(200));
  }),
  rest.post(ENDPOINTS.postCustomCheckItem, (_, response, context) => {
    return response(context.status(200));
  }),
  rest.post(ENDPOINTS.getNextCustomItemNumber, (_, response, context) => {
    return response(context.status(200));
  }),
  rest.post(ENDPOINTS.deleteCustomCheckItem, (_, response, context) => {
    return response(context.status(200));
  }),
  rest.post(ENDPOINTS.postCustomClear, (_, response, context) => {
    return response(context.status(200));
  }),
  rest.post(ENDPOINTS.postCustomSetOk, (_, response, context) => {
    return response(context.status(200));
  }),

  // Task
  rest.get(ENDPOINTS.getTasks, (_, response, context) => {
    return response(context.json(dummyTasksResponse), context.status(200));
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
  }),

  // PUNCH
  rest.get(ENDPOINTS.getPunchList, (_, response, context) => {
    return response(context.json(dummyPunchListResponse), context.status(200));
  }),
  rest.get(ENDPOINTS.getPunchAttachment, (_, response, context) => {
    return response(context.json(new Blob()), context.status(200));
  }),
  rest.get(ENDPOINTS.getPunchAttachments, (_, response, context) => {
    return response(
      context.json(dummyAttachmentsResponse),
      context.status(200)
    );
  }),
  rest.get(ENDPOINTS.getPunchCategories, (_, response, context) => {
    return response(context.json(dummyPunchCategories), context.status(200));
  }),
  rest.get(ENDPOINTS.getPunchOrganizations, (_, response, context) => {
    return response(context.json(dummyPunchOrganizations), context.status(200));
  }),
  rest.get(ENDPOINTS.getPunchTypes, (_, response, context) => {
    return response(context.json(dummyPunchTypes), context.status(200));
  }),
  rest.get(ENDPOINTS.getPunchItem, (_, response, context) => {
    return response(context.json(dummyPunchItemUncleared), context.status(200));
  }),
  rest.post(ENDPOINTS.postNewPunch, (_, response, context) => {
    return response(context.status(200));
  })
);

const causeApiError = (
  endpoint: string,
  method: "get" | "put" | "post" | "delete"
): void => {
  let callToIntercept = rest.get(endpoint, (_, response, context) => {
    return response(context.status(400), context.text("dummy error"));
  });
  if (method === "post") {
    callToIntercept = rest.post(endpoint, (_, response, context) => {
      return response(context.status(400), context.text("dummy error"));
    });
  }
  if (method === "put") {
    callToIntercept = rest.put(endpoint, (_, response, context) => {
      return response(context.status(400), context.text("dummy error"));
    });
  }
  if (method === "get") {
    callToIntercept = rest.get(endpoint, (_, response, context) => {
      return response(context.status(400), context.text("dummy error"));
    });
  }
  if (method === "delete") {
    callToIntercept = rest.delete(endpoint, (_, response, context) => {
      return response(context.status(400), context.text("dummy error"));
    });
  }
  return server.use(callToIntercept);
};
export { causeApiError, rest };

beforeAll(() => server.listen({ onUnhandledRequest: "warn" }));
afterAll(() => server.close());
afterEach(() => server.resetHandlers());
