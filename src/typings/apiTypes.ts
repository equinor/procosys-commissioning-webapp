import {
  CompletionStatus,
  DocumentAttachment,
  DocumentRelationType
} from "@equinor/procosys-webapp-components";

export type Project = {
  description: string;
  id: number;
  title: string;
};

export interface Plant {
  id: string;
  title: string;
  slug: string;
  projects?: Project[];
}

//COMM PKG SEARCH
export interface CommPkgPreview {
  id: number;
  commPkgNo: string;
  description: string;
  mcStatus: CompletionStatus;
  commStatus: CompletionStatus;
  commissioningHandoverStatus: string;
  operationHandoverStatus: string;
}

export interface TagPreview {
  id: number;
  tagNo: string;
  description: string;
  registerCode: string;
  tagFunctionCode: string;
  commPkgNo: string;
  mcPkgNo: string;
  callOffNo: string;
  punchaseOrderTitle: string;
  mccrResponsibleCode: string;
}

export type SearchResults = {
  maxAvailable: number;
  items: CommPkgPreview[] | TagPreview[];
};

// COMM PKG AND LISTS

export type CommPkg = {
  id: number;
  commPkgNo: string;
  description: string;
  commStatus: CompletionStatus;
  mcStatus: CompletionStatus;
  mcPkgCount: number;
  mcPkgsAcceptedByCommissioning: number;
  mcPkgsAcceptedByOperation: number;
  commissioningHandoverStatus: string;
  operationHandoverStatus: string;
  systemId: number;
};
export interface ChecklistPreview {
  id: number;
  tagId: number;
  tagNo: string;
  tagDescription: string;
  responsibleCode: string; // not in Comm version
  status: CompletionStatus;
  formularType: string;
  formularGroup: string;
  sheetNo: number; // not in Comm version
  subSheetNo: number; // not in Comm version
  isRestrictedForUser: boolean;
  hasElectronicForm: boolean;
  attachmentCount: number; // not in Comm version
  isSigned: boolean; // not in Comm version
  isVerified: boolean; // not in Comm version
}
export interface PunchPreview {
  id: number;
  proCoSysGuid: string;
  status: CompletionStatus;
  description: string;
  systemModule: string;
  tagDescription: string;
  tagId: number;
  tagNo: string;
  formularType: string; // Not in Comm punches
  responsibleCode: string; // Not in Comm punches
  isRestrictedForUser: boolean;
  cleared: boolean;
  rejected: boolean;
  verified: boolean; // Not in Comm punches
  statusControlledBySwcr: boolean;
  attachmentCount: number; // Not in Comm punches
  callOffNo?: string; // Not in Comm punches
}

export type TaskPreview = {
  id: number;
  number: string;
  title: string;
  chapter: string;
  isSigned: boolean;
};

// CHECKLIST
export interface ChecklistDetails {
  id: number;
  tagNo: string;
  tagDescription: string;
  tagId: number;
  responsibleCode: string;
  responsibleDescription: string;
  status: CompletionStatus;
  systemModule: string;
  formularType: string;
  formularGroup: string;
  comment: string;
  signedByUser: string;
  signedByFirstName: string;
  signedByLastName: string;
  signedAt: Date;
  verifiedByUser: string;
  verifiedByFirstName: string;
  verifiedByLastName: string;
  verifiedAt: Date;
  updatedAt: Date;
  updatedByUser: string;
  updatedByFirstName: string;
  updatedByLastName: string;
  isRestrictedForUser: boolean;
  hasElectronicForm: boolean;
  attachmentCount: number;
}

export interface ColumnLabel {
  id: number;
  label: string;
}

export interface Cell {
  value: string;
  valueDate: string;
  isValueDate: boolean;
  unit: string;
  columnId: number;
}

export interface Row {
  id: number;
  label: string;
  cells: Cell[];
}

export interface MetaTable {
  info: string;
  columnLabels: ColumnLabel[];
  rows: Row[];
}

export interface CheckItem {
  id: number;
  sequenceNumber: string;
  text: string;
  detailText: string;
  isHeading: boolean;
  hasImage: boolean;
  imageFileId: number;
  hasMetaTable: boolean;
  metaTable: MetaTable;
  isOk: boolean;
  isNotApplicable: boolean;
}

export interface CustomCheckItem {
  id: number;
  itemNo: string;
  text: string;
  isOk: boolean;
}

export interface ChecklistResponse {
  checkList: ChecklistDetails;
  checkItems: CheckItem[];
  customCheckItems: CustomCheckItem[];
}

export interface PunchCategory {
  id: number;
  code: CompletionStatus;
  description: string;
}

export interface PunchType {
  id: number;
  parentId: number;
  code: string;
  description: string;
}
export interface LibrayTypes {
  guid: string;
  libraryType: string;
  code: string;
  description: string;
}
export interface PunchOrganization {
  id: number;
  parentId: number;
  code: string;
  description: string;
}

export interface PunchSort {
  id: number;
  parentId: number;
  code: string;
  description: string;
}

export interface PunchPriority {
  id: number;
  code: string;
  description: string;
}

export interface Person {
  id: number;
  azureOid: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface NewPunch {
  CheckListId: number;
  CategoryId: number;
  Description: string;
  TypeId: number;
  RaisedByOrganizationId: number;
  ClearingByOrganizationId: number;
  SortingId?: number;
  PriorityId?: number;
  ActionByPerson?: number | null;
  DueDate?: string;
  Estimate?: number;
  TemporaryFileIds: string[];
}

// export interface PunchItem {
//   id: number;
//   checklistId: number;
//   formularType: string;
//   status: CompletionStatus;
//   description: string;
//   typeCode: string;
//   typeDescription: string;
//   raisedByCode: string;
//   raisedByDescription: string;
//   clearingByCode: string;
//   clearingByDescription: string;
//   clearedAt: string | null;
//   clearedByUser: string | null;
//   clearedByFirstName: string | null;
//   clearedByLastName: string | null;
//   verifiedAt: string | null;
//   verifiedByUser: string | null;
//   verifiedByFirstName: string | null;
//   verifiedByLastName: string | null;
//   rejectedAt: string | null;
//   rejectedByUser: string | null;
//   rejectedByFirstName: string | null;
//   rejectedByLastName: string | null;
//   dueDate: string | null;
//   estimate: number | null;
//   priorityId: number | null;
//   priorityCode: string | null;
//   priorityDescription: string | null;
//   actionByPerson: number | null;
//   actionByPersonFirstName: string | null;
//   actionByPersonLastName: string | null;
//   materialRequired: boolean;
//   materialEta: string | null;
//   materialNo: string | null;
//   systemModule: string;
//   tagDescription: string;
//   tagId: number;
//   tagNo: string;
//   responsibleCode: string;
//   responsibleDescription: string;
//   sorting: string | null;
//   statusControlledBySwcr: boolean;
//   isRestrictedForUser: boolean;
//   attachmentCount: number;
// }
type Guid = string;
type DateTimeString = string; // Assuming ISO 8601 format for dates

interface User {
  id: number;
  userName: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  officePhoneNo: null;
  mobilePhoneNo: null;
  isVoided: boolean;
  nameAndUserNameAsString: string;
  fullName: string;
  fullNameFormal: string;
}

interface OrganizationDetail {
  guid: Guid;
  code: string;
  description: string;
}

interface PriorityAndSorting {
  guid: Guid;
  code: string;
  description: string;
}
export interface Document extends DocumentData {
  documentId: number;
  documentNo: string;
  title: string;
  revisionNo: string;
  revisionId: number;
  relationType: DocumentRelationType;
  attachments: DocumentAttachment[];
}
export interface DocumentData {
  guid: Guid;
  no: string;
}

export interface SWCR {
  guid: Guid;
  no: number;
}

export interface PunchItem {
  [index: string]: any;
  guid: Guid;
  projectName: string;
  itemNo: number;
  category: string;
  description: string;
  createdBy: User;
  createdAtUtc: DateTimeString;
  modifiedBy: User;
  modifiedAtUtc: DateTimeString;
  isReadyToBeCleared: boolean;
  isReadyToBeUncleared: boolean;
  clearedBy: User;
  clearedAtUtc: DateTimeString;
  isReadyToBeRejected: boolean;
  rejectedBy: User;
  rejectedAtUtc: DateTimeString;
  isReadyToBeVerified: boolean;
  isReadyToBeUnverified: boolean;
  verifiedBy: User;
  verifiedAtUtc: DateTimeString;
  raisedByOrg: OrganizationDetail;
  clearingByOrg: OrganizationDetail;
  priority: PriorityAndSorting;
  sorting: PriorityAndSorting;
  type: PriorityAndSorting;
  actionBy: User;
  dueTimeUtc: DateTimeString;
  estimate: number;
  externalItemNo: string;
  materialRequired: boolean;
  materialETAUtc: DateTimeString;
  materialExternalNo: string;
  workOrder: WorkOrder;
  originalWorkOrder: WorkOrder;
  document: Document;
  swcr: SWCR;
  rowVersion: string;
  attachments?: Attachment[];
}
export type WorkOrder = {
  no: string;
  guid: string;
};
export interface AttachmentData {
  parentGuid: string;
  guid: string;
  fullBlobPath: string;
  sasUri?: string;
  fileName: string;
  description: string;
  labels: string[];
  createdBy: {
    guid: string;
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
  } | null;
  createdAtUtc: string | null;
  modifiedBy: {
    guid: string;
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
  } | null;
  modifiedAtUtc: string | null;
  rowVersion: string;
}
interface User {
  id: number;
  userName: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  officePhoneNo: null;
  mobilePhoneNo: null;
  isVoided: boolean;
  nameAndUserNameAsString: string;
  fullName: string;
  fullNameFormal: string;
}

export interface Task {
  id: number;
  number: string;
  title: string;
  descriptionAsHtml: string;
  commentAsHtml: string;
  updatedByUser: string;
  updatedAt: Date;
  updatedByFirstName: string;
  updatedByLastName: string;
  signedByUser: string;
  signedByFirstName: string;
  signedByLastName: string;
  signedAt: Date;
  verifiedByUser: string;
  verifiedByFirstName: string;
  verifiedByLastName: string;
  verifiedAt: Date;
}

export interface TaskParameter {
  id: number;
  description: string;
  measuredValue: string;
  referenceValue: string;
  referenceUnit: string;
}

export interface Attachment extends AttachmentData {
  id: number;
  uri: string;
  title: string;
  createdAt: Date;
  classification: string;
  mimeType: string;
  thumbnailAsBase64: string;
  hasFile: boolean;
  fileName: string;
}

// TAG

export interface TagDetails {
  id: number;
  tagNo: string;
  description: string;
  registerCode: string;
  registerDescription: string;
  statusCode: string;
  statusDescription: string;
  tagFunctionCode: string;
  tagFunctionDescription: string;
  commPkgNo: string;
  mcPkgNo: string;
  purchaseOrderNo: string;
  callOffNo: string;
  purchaseOrderTitle: string;
  projectDescription: string;
  sequence: string;
  mountedOnTagNo: string;
  remark: string;
  systemCode: string;
  systemDescription: string;
  disciplineCode: string;
  disciplineDescription: string;
  areaCode: string;
  areaDescription: string;
  engineeringCodeCode: string;
  engineeringCodeDescription: string;
  contractorCode: string;
  contractorDescription: string;
  hasPreservation: boolean;
  preservationMigrated: boolean;
}

export interface AdditionalTagField {
  id: number;
  label: string;
  value: string;
  type: string;
  unit: string;
}
export interface Tag {
  tag: TagDetails;
  additionalFields: AdditionalTagField[];
}
