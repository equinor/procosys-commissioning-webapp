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
