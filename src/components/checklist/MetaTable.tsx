import React, { useState } from 'react';
import { ColumnLabel, Row } from '../../services/apiTypes';
import styled from 'styled-components';
import MetaTableCell from './MetaTableCell';

const MetaTableWrapper = styled.table`
    border-spacing: 4px;
    margin-left: auto;
    & > p {
        margin: 0;
        padding-bottom: 12px;
    }
    & thead {
        & p {
            margin: 0;
            text-align: center;
        }
    }

    & tbody {
        vertical-align: bottom;
        & th {
            min-width: 100px;
            padding-right: 10px;
            & > p {
                margin: 0;
                padding-bottom: 22px;
                float: right;
            }
        }
        & tr {
            & td {
                padding: 0;
                margin: 0;
            }
        }
    }
`;

const HorizontalScroll = styled.div<{ multipleColumns: boolean }>`
    overflow: scroll;
    padding: 0 18px 16px 24px;
    margin-bottom: 24px;
    border-left: 1px solid #007079;
    border-bottom: 1px solid #007079;
    border-color: #000 transparent transparent transparent;
`;

type MetaTableProps = {
    labels: ColumnLabel[];
    rows: Row[];
    isSigned: boolean;
    checkItemId: number;
};

const MetaTable = ({ labels, rows, isSigned, checkItemId }: MetaTableProps) => {
    const headers = labels.map((label) => (
        <React.Fragment key={label.id}>
            {label && (
                <th>
                    <p>{label.label}</p>
                </th>
            )}
        </React.Fragment>
    ));
    const rowsToDisplay = rows.map((row) => {
        const cells = row.cells.map((cell) => {
            return (
                <MetaTableCell
                    key={cell.columnId.toString() + row.id.toString()}
                    isSigned={isSigned}
                    checkItemId={checkItemId}
                    rowId={row.id}
                    columnId={cell.columnId}
                    unit={cell.unit}
                    value={cell.value}
                />
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
        <HorizontalScroll multipleColumns={labels.length > 2}>
            <MetaTableWrapper>
                {headers.length > 1 && (
                    <thead>
                        <tr>
                            <th />
                            {headers}
                        </tr>
                    </thead>
                )}

                <tbody>{rowsToDisplay}</tbody>
            </MetaTableWrapper>
        </HorizontalScroll>
    );
};

export default MetaTable;
