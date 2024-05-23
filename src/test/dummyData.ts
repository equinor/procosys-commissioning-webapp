import {
  ChecklistPreview,
  ColumnLabel,
  CommPkg,
  CommPkgPreview,
  Plant,
  Project,
  PunchPreview,
  Row,
  SearchResults,
  TaskPreview
} from "../typings/apiTypes";

enum CompletionStatus {
  OS = "OS",
  PA = "PA",
  PB = "PB",
  OK = "OK"
}
type DummyMetatableData = {
  rows: Row[];
  labels: ColumnLabel[];
};

export const dummyMetatableData: DummyMetatableData = {
  rows: [
    {
      id: 0,
      label: "dummy-row-label",
      cells: [
        {
          value: "dummy-cell-value",
          unit: "dummy-unit",
          columnId: 0,
          valueDate: "",
          isValueDate: false
        },
        {
          value: "dummy-cell-value-2",
          unit: "dummy-unit-2",
          columnId: 2,
          valueDate: "",
          isValueDate: false
        }
      ]
    },
    {
      id: 1,
      label: "dummy-row-label-2",
      cells: [
        {
          value: "dummy-cell-value-3",
          unit: "dummy-unit-3",
          columnId: 3,
          valueDate: "",
          isValueDate: false
        },
        {
          value: "dummy-cell-value-4",
          unit: "dummy-unit-4",
          columnId: 4,
          valueDate: "",
          isValueDate: false
        }
      ]
    }
  ],
  labels: [
    { id: 0, label: "dummy-column-label" },
    { id: 1, label: "dummy-column-label-2" }
  ]
};

export const testPlants: Plant[] = [
  { id: "One", title: "Test plant 1", slug: "this-is-a-slug" },
  { id: "Two", title: "Test plant 2", slug: "yet-another-slug" }
];

export const dummyPermissions: string[] = [
  "COMMPKG/READ",
  "CPCL/READ",
  "PUNCHLISTITEM/READ",
  "CPCL/SIGN",
  "CPCL/VERIFY"
];

export const testProjects: Project[] = [
  {
    id: 1,
    title: "Test project 1",
    description: "this-is-a-description",
    proCoSysGuid: ""
  },
  {
    id: 2,
    title: "Test project 2",
    description: "yet-another-description",
    proCoSysGuid: ""
  }
];

export const testDetails: CommPkg = {
  id: 1,
  commPkgNo: "dummy-commpkg-no",
  description: "dummy-commpkg-description",
  commStatus: CompletionStatus.OK,
  mcStatus: CompletionStatus.OK,
  mcPkgCount: 1,
  mcPkgsAcceptedByCommissioning: 1,
  mcPkgsAcceptedByOperation: 1,
  commissioningHandoverStatus: "Test commissioningHandoverStatus",
  operationHandoverStatus: "Test operationHandoverStatus",
  systemId: 1
};

export const testTasks: TaskPreview[] = [
  {
    id: 1,
    number: "Test task number",
    title: "Test task title",
    chapter: "Test task chapter",
    isSigned: true
  },
  {
    id: 2,
    number: "Test task number 2",
    title: "Test task title 2",
    chapter: "Test task chapter 2",
    isSigned: false
  }
];

export const testCommPkgPreview: CommPkgPreview[] = [
  {
    id: 1,
    commPkgNo: "Test comm pkg number",
    description: "Test description",
    mcStatus: CompletionStatus.OK,
    commStatus: CompletionStatus.OK,
    commissioningHandoverStatus: "OK",
    operationHandoverStatus: "OK"
  }
];

export const testScope: ChecklistPreview[] = [
  {
    id: 1,
    tagNo: "Test tag number",
    tagDescription: "Test tag description",
    status: CompletionStatus.OK,
    formularGroup: "Test formular group",
    formularType: "Test formular type",
    isRestrictedForUser: false,
    hasElectronicForm: true,
    tagId: 1,
    responsibleCode: "code",
    sheetNo: 3,
    subSheetNo: 4,
    attachmentCount: 2,
    isSigned: true,
    isVerified: false,
    proCoSysGuid: ""
  }
];

export const testPunchList: PunchPreview[] = [
  {
    id: 1,
    status: CompletionStatus.OK,
    description: "Test punch description",
    systemModule: "Test punch system module",
    tagId: 1,
    tagNo: "Test tag number",
    tagDescription: "Test tag description",
    isRestrictedForUser: false,
    cleared: true,
    rejected: false,
    statusControlledBySwcr: true,
    formularType: "ff",
    responsibleCode: "code",
    verified: false,
    attachmentCount: 0,
    proCoSysGuid: ""
  }
];

export const testCommSearch: SearchResults = {
  maxAvailable: testCommPkgPreview.length,
  items: testCommPkgPreview
};

export const testTagSearch: SearchResults = {
  maxAvailable: 1,
  items: [
    {
      id: 1,
      tagNo: "#432",
      description: "test tag description",
      registerCode: "tagCode",
      tagFunctionCode: "tagFunctionCode",
      commPkgNo: "123-D01",
      mcPkgNo: "123-C001",
      callOffNo: "C05",
      punchaseOrderTitle: "PO title",
      mccrResponsibleCode: "mccrRespCode"
    }
  ]
};

export const dummyChecklistResponse = {
  checkList: {
    od: 321421,
    tagNo: "dummy-tag-no",
    tagDescription: "dummy-tag-description",
    responsibleCode: "dummy-responsible-code",
    responsibleDescription: "dummy-responsible-description",
    status: "OS",
    systemModule: "COMM",
    formularType: "dummy-formular-type",
    formularGroup: "dummy-formular-group",
    comment: "",
    signedByUser: null,
    signedByFirstName: null,
    signedByLastName: null,
    signedAt: null,
    verifiedByUser: null,
    verifiedByFirstName: null,
    verifiedByLastName: null,
    verifiedAt: null,
    updatedAt: "2021-02-05T09:05:09Z",
    updatedByUser: "dummy-updated-user",
    updatedByFirstName: "dummy-update-first-name",
    updatedByLastName: "dummy-updated-last-name",
    isRestrictedForUser: false,
    hasElectronicForm: true
  },
  checkItems: [
    {
      id: 1,
      sequenceNumber: "1",
      text: "dummy-check-item-header-text",
      detailText: null,
      isHeading: true,
      hasImage: false,
      imageFileId: 0,
      hasMetaTable: false,
      metaTable: null,
      isOk: false,
      isNotApplicable: true
    },
    {
      id: 2,
      sequenceNumber: "1",
      text: "dummy-check-item-1",
      detailText: null,
      isHeading: false,
      hasImage: false,
      imageFileId: 0,
      hasMetaTable: false,
      metaTable: null,
      isOk: false,
      isNotApplicable: true
    },
    {
      id: 3,
      sequenceNumber: "01",
      text: "dimmy-check-item-2",
      detailText: "dummy-details-text",
      isHeading: false,
      hasImage: false,
      imageFileId: 0,
      hHasMetaTable: false,
      metaTable: null,
      isOk: false,
      isNotApplicable: false
    }
  ],
  customCheckItems: [
    {
      id: 4,
      itemNo: "4",
      text: "dummy-custom-check-item-1",
      isOk: true
    },
    {
      id: 5,
      itemNo: "5",
      text: "dummy-custom-check-item-2",
      isOk: true
    }
  ]
};

export const dummySignedChecklistResponse = {
  CheckList: {
    Id: 321421,
    TagNo: "dummy-tag-no",
    TagDescription: "dummy-tag-description",
    ResponsibleCode: "dummy-responsible-code",
    ResponsibleDescription: "dummy-responsible-description",
    Status: "OS",
    SystemModule: "COMM",
    FormularType: "dummy-formular-type",
    FormularGroup: "dummy-formular-group",
    Comment: "",
    SignedByUser: "dummy-user",
    SignedByFirstName: "dummy-user",
    SignedByLastName: "dummy-user",
    SignedAt: "2021-02-05T09:05:09Z",
    VerifiedByUser: null,
    VerifiedByFirstName: null,
    VerifiedByLastName: null,
    VerifiedAt: null,
    UpdatedAt: "2021-02-05T09:05:09Z",
    UpdatedByUser: "dummy-updated-user",
    UpdatedByFirstName: "dummy-update-first-name",
    UpdatedByLastName: "dummy-updated-last-name",
    IsRestrictedForUser: false,
    HasElectronicForm: true
  },
  CheckItems: [],
  CustomCheckItems: []
};

export const dummyVerifiedChecklistResponse = {
  CheckList: {
    Id: 321421,
    TagNo: "dummy-tag-no",
    TagDescription: "dummy-tag-description",
    ResponsibleCode: "dummy-responsible-code",
    ResponsibleDescription: "dummy-responsible-description",
    Status: "OS",
    SystemModule: "COMM",
    FormularType: "dummy-formular-type",
    FormularGroup: "dummy-formular-group",
    Comment: "",
    SignedByUser: "dummy-user",
    SignedByFirstName: "dummy-user",
    SignedByLastName: "dummy-user",
    SignedAt: "2021-02-05T09:05:09Z",
    VerifiedByUser: "dummy-user",
    VerifiedByFirstName: "dummy-user",
    VerifiedByLastName: "dummy-user",
    VerifiedAt: "2021-02-05T09:05:09Z",
    UpdatedAt: "2021-02-05T09:05:09Z",
    UpdatedByUser: "dummy-updated-user",
    UpdatedByFirstName: "dummy-update-first-name",
    UpdatedByLastName: "dummy-updated-last-name",
    IsRestrictedForUser: false,
    HasElectronicForm: true
  },
  CheckItems: [],
  CustomCheckItems: []
};

export const dummyScopeResponse = [
  {
    id: 321,
    tagNo: "scope-dummy-tag-no",
    tagDescription: "scope-dummy-tag-description",
    status: "PB",
    formularType: "scope-dummy-formular-type",
    formularGroup: "scope-dummy-formular-group",
    isRestrictedForUser: false,
    hasElectronicForm: true
  }
];

export const dummyTasksResponse = [
  {
    Id: 43242,
    Number: "dummy-task-number",
    Title: "dummy-task-title",
    Chapter: "dummy-task-chapter",
    IsSigned: true
  }
];

export const dummyPunchListResponse = [
  {
    id: 645645,
    status: "PB",
    description: "dummy-punch-item-description",
    systemModule: "dummy-punch-system-module",
    tagDescription: "dummy-punch-task-description",
    tagId: 123,
    tagNo: "dummy-punch-tag-no",
    isRestrictedForUser: false,
    cleared: false,
    rejected: false,
    statusControlledBySwcr: false
  }
];

export const dummyPunchItemUncleared = {
  Id: 1,
  ChecklistId: 2,
  FormularType: "E-65",
  Status: "PB",
  Description: "dummy-punch-description",
  TypeCode: "1",
  TypeDescription: "dummy-type-1",
  RaisedByCode: "ENG",
  RaisedByDescription: "ENGINEERING",
  ClearingByCode: "CON",
  ClearingByDescription: "CONTRACTOR",
  ClearedAt: null,
  ClearedByUser: null,
  ClearedByFirstName: null,
  ClearedByLastName: null,
  VerifiedAt: null,
  VerifiedByUser: null,
  VerifiedByFirstName: null,
  VerifiedByLastName: null,
  RejectedAt: null,
  RejectedByUser: null,
  RejectedByFirstName: null,
  RejectedByLastName: null,
  DueDate: null,
  Estimate: null,
  PriorityId: null,
  PriorityCode: null,
  PriorityDescription: null,
  ActionByPerson: 0,
  ActionByPersonFirstName: null,
  ActionByPersonLastName: null,
  MaterialRequired: false,
  MaterialEta: null,
  MaterialNo: null,
  SystemModule: "COMM",
  TagDescription: "For testing purposes (test 37221)",
  TagId: 2,
  TagNo: "dummy-tag-no",
  ResponsibleCode: "dummy-res-code",
  ResponsibleDescription: "dummy-res-description",
  Sorting: null,
  StatusControlledBySwcr: false,
  IsRestrictedForUser: false,
  AttachmentCount: 1
};
export const dummyPunchItemCleared = {
  ...dummyPunchItemUncleared,
  ClearedAt: "2021-02-05T09:05:09Z",
  ClearedByUser: "dummy-user",
  ClearedByFirstName: "dummy-first-name",
  ClearedByLastName: "dummy-last-name"
};

export const dummyCommPkgDetailsResponse = {
  id: 42323,
  commPkgNo: "dummy-commPkg-no",
  description: "dummy-commPkg-description",
  commStatus: "PB",
  mcStatus: "PB",
  bluelineStatus: null,
  yellowlineStatus: null,
  mcPkgCount: 15,
  mcPkgsAcceptedByCommissioning: 15,
  mcPkgsAcceptedByOperation: 15,
  commissioningHandoverStatus: "ACCEPTED",
  operationHandoverStatus: "ACCEPTED",
  systemId: 9780741,
  system: "10|04",
  isVoided: false
};

export const dummyTaskResponse = {
  Id: 111,
  Number: "1.2-3",
  Title: "dummy-task-title",
  DescriptionAsHtml: "<p>dummy-task-description</p>",
  CommentAsHtml: "<p>dummy-task-comment</p>",
  UpdatedByUser: "dummy-task-user",
  UpdatedAt: "2021-03-04T10:53:25Z",
  UpdatedByFirstName: "dummy-task-first-name",
  UpdatedByLastName: "dummy-task-last-name",
  SignedByUser: null,
  SignedByFirstName: null,
  SignedByLastName: null,
  SignedAt: null,
  VerifiedByUser: null,
  VerifiedByFirstName: null,
  VerifiedByLastName: null,
  VerifiedAt: null
};

export const dummySignedTaskResponse = {
  Id: 111,
  Number: "1.2-3",
  Title: "dummy-task-title",
  DescriptionAsHtml: "<p>dummy-task-description</p>",
  CommentAsHtml: "<p>dummy-task-comment</p>",
  UpdatedByUser: "dummy-task-user",
  UpdatedAt: "2021-03-04T10:53:25Z",
  UpdatedByFirstName: "dummy-task-first-name",
  UpdatedByLastName: "dummy-task-last-name",
  SignedByUser: "i82084",
  SignedByFirstName: "Jane",
  SignedByLastName: "Doe",
  SignedAt: "2021-02-05T09:05:09Z",
  VerifiedByUser: null,
  VerifiedByFirstName: null,
  VerifiedByLastName: null,
  VerifiedAt: null
};

export const dummyTaskParametersResponse = [
  {
    Id: 123,
    Description: "dummy-parameter-description",
    MeasuredValue: "123",
    ReferenceValue: "123",
    ReferenceUnit: "V"
  },
  {
    Id: 124,
    Description: "dummy-parameter-description-2",
    MeasuredValue: "123",
    ReferenceValue: "123",
    ReferenceUnit: "Ohm"
  }
];

export const dummyAttachmentsResponse = [
  {
    id: 123,
    fileName: "960x0.jpg",
    uri: null,
    title: "Dummy image",
    createdAt: "2021-02-15T14:20:28Z",
    classification: "Attachment",
    mimeType: "image/jpeg",
    thumbnailAsBase64:
      "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",
    hasFile: true
  },
  {
    id: 124,
    fileName: "README.md",
    uri: null,
    title: "Readme",
    createdAt: "2021-02-19T09:12:08Z",
    classification: "Attachment",
    mimeType: "application/octet-stream",
    thumbnailAsBase64: null,
    hasFile: true
  }
];

export const dummyPunchOrganizations = [
  { Id: 1, ParentId: null, Code: "ENG", Description: "dummy-org-1" },
  { Id: 2, ParentId: null, Code: "CON", Description: "dummy-org-2" }
];

export const dummyPunchCategories = [
  { Id: 1, Code: "PA", Description: "dummy-category-1" },
  { Id: 2, Code: "PB", Description: "dummy-category-2" }
];

export const dummyPunchTypes = [
  { Id: 1, ParentId: null, Code: "1", Description: "dummy-type-1" },
  { Id: 2, ParentId: null, Code: "2", Description: "dummy-type-2" }
];
