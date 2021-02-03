import {
    Row,
    ColumnLabel,
    ChecklistPreview,
    CommPkg,
    CompletionStatus,
    Plant,
    Project,
    PunchPreview,
    TaskPreview,
    CommPkgPreview,
} from '../services/apiTypes';

type DummyMetatableData = {
    rows: Row[];
    labels: ColumnLabel[];
};

export const dummyMetatableData: DummyMetatableData = {
    rows: [
        {
            id: 0,
            label: 'dummy-row-label',
            cells: [
                { value: 'dummy-cell-value', unit: 'dummy-unit', columnId: 0 },
                {
                    value: 'dummy-cell-value-2',
                    unit: 'dummy-unit-2',
                    columnId: 2,
                },
            ],
        },
        {
            id: 1,
            label: 'dummy-row-label-2',
            cells: [
                {
                    value: 'dummy-cell-value-3',
                    unit: 'dummy-unit-3',
                    columnId: 3,
                },
                {
                    value: 'dummy-cell-value-4',
                    unit: 'dummy-unit-4',
                    columnId: 4,
                },
            ],
        },
    ],
    labels: [
        { id: 0, label: 'dummy-column-label' },
        { id: 1, label: 'dummy-column-label-2' },
    ],
};

export const testPlants: Plant[] = [
    { id: 'One', title: 'Test plant 1', slug: 'this-is-a-slug' },
    { id: 'Two', title: 'Test plant 2', slug: 'yet-another-slug' },
];

export const testProjects: Project[] = [
    { id: 1, title: 'Test project 1', description: 'this-is-a-description' },
    { id: 2, title: 'Test project 2', description: 'yet-another-description' },
];

export const testDetails: CommPkg = {
    id: 1,
    commPkgNo: 'Test commPkgNo',
    description: 'Test commPkg description',
    commStatus: CompletionStatus.OK,
    mcStatus: CompletionStatus.OK,
    mcPkgCount: 1,
    mcPkgsAcceptedByCommissioning: 1,
    mcPkgsAcceptedByOperation: 1,
    commissioningHandoverStatus: 'Test commissioningHandoverStatus',
    operationHandoverStatus: 'Test operationHandoverStatus',
    systemId: 1,
};

export const testTasks: TaskPreview[] = [
    {
        id: 1,
        number: 'Test task number',
        title: 'Test task title',
        chapter: 'Test task chapter',
        isSigned: true,
    },
    {
        id: 2,
        number: 'Test task number 2',
        title: 'Test task title 2',
        chapter: 'Test task chapter 2',
        isSigned: false,
    },
];

export const testCommPkgPreview: CommPkgPreview[] = [
    {
        id: 1,
        commPkgNo: 'Test comm pkg number',
        description: 'Test description',
        mcStatus: CompletionStatus.OK,
        commStatus: CompletionStatus.OK,
        commissioningHandoverStatus: 'OK',
        operationHandoverStatus: 'OK',
    },
];

export const testScope: ChecklistPreview[] = [
    {
        id: 1,
        tagNo: 'Test tag number',
        tagDescription: 'Test tag description',
        status: CompletionStatus.OK,
        formularGroup: 'Test formular group',
        formularType: 'Test formular type',
        isRestrictedForUser: false,
        hasElectronicForm: true,
    },
];

export const testPunchList: PunchPreview[] = [
    {
        id: 1,
        status: CompletionStatus.OK,
        description: 'Test punch description',
        systemModule: 'Test punch system module',
        tagId: 1,
        tagNo: 'Test tag number',
        tagDescription: 'Test tag description',
        isRestrictedForUser: false,
        cleared: true,
        rejected: false,
        statusControlledBySwcr: true,
    },
];

export default dummyMetatableData;
