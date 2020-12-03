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

export type CommPkgPreview = {
    id: number;
    commPkgNo: string;
    description: string;
    mcStatus: string;
    commStatus: string;
    commissioningHandoverStatus: string;
    operationHandoverStatus: string;
};

export type CommPkgSearchResults = {
    maxAvailable: number;
    items: CommPkgPreview[];
};

export type CommPkg = {
    id: number;
    commPkgNo: string;
    description: string;
    commStatus: string;
    mcStatus: string;
    mcPkgCount: number;
    mcPkgsAcceptedByCommissioning: number;
    mcPkgsAcceptedByOperation: number;
    commissioningHandoverStatus: string;
    operationHandoverStatus: string;
    systemId: number;
};

export type ChecklistPreview = {
    id: number;
    tagNo: string;
    tagDescription: string;
    status: string;
    formularType: string;
    formularGroup: string;
    isRestrictedForUser: boolean;
    hasElectronicForm: boolean;
};

export type PunchPreview = {
    id: number;
    status: string;
    description: string;
    systemModule: string;
    tagDescription: string;
    tagId: number;
    tagNo: string;
    isRestrictedForUser: boolean;
    cleared: boolean;
    rejected: boolean;
    statusControlledBySwcr: boolean;
};

export type TaskPreview = {
    id: number;
    number: string;
    title: string;
    chapter: string;
    isSigned: boolean;
};
