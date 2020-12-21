import React from 'react';
import { ColumnLabel, Row } from '../../services/apiTypes';
import { TextField } from '@equinor/eds-core-react';
import styled from 'styled-components';

const MetaTableWrapper = styled.table`
    margin-bottom: 25px;
    margin-top: -15px;
    margin-left: auto;
    padding-right: 20px;
    & p {
        float: right;
        margin-bottom: auto;
    }
    & tr {
        height: 60px;
    }
    & th {
    }
`;

type MetaTableProps = {
    labels: ColumnLabel[];
    rows: Row[];
};

const MetaTable = ({ labels, rows }: MetaTableProps) => {
    const headers = labels.map((label) => {
        if (label) return <th key={label.id}>{label.label}</th>;
        return <></>;
    });
    const rowsToDisplay = rows.map((row) => {
        const cells = row.cells.map((cell) => {
            return (
                <td>
                    <TextField meta={cell.unit} value={cell.value} />
                </td>
            );
        });
        return (
            <tr key={row.id}>
                <th>
                    <p>{row.label}</p>
                </th>
                {cells}
            </tr>
        );
    });

    return (
        <MetaTableWrapper>
            {headers.length > 1 && <tr>{headers}</tr>}
            {rowsToDisplay}
        </MetaTableWrapper>
    );
};

export default MetaTable;
