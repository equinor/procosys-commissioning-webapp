import { Row, ColumnLabel } from '../services/apiTypes';

type DummyData = {
    rows: Row[];
    labels: ColumnLabel[];
};

const dummyData: DummyData = {
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

export default dummyData;
