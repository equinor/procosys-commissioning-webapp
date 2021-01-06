import React, { useEffect, useRef, useState } from 'react';
import { ColumnLabel, Row } from '../../services/apiTypes';
import styled from 'styled-components';
import MetaTableCell from './MetaTableCell';
import EdsIcon from '../EdsIcon';

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

const HorizontalScroll = styled.div`
    overflow-x: scroll;
    padding: 0px 10px 0px 24px;
    /* border-left: 4px solid #007079; */
    margin: 0px 0 0px 0;
    & > div {
        & > p {
            margin: 0 4px 0 0;
        }
        background-color: #deecee;
        padding: 4px 4px 4px 8px;
        margin-bottom: 12px;
        display: flex;
        align-items: center;
        width: fit-content;
    }
`;

type MetaTableProps = {
    labels: ColumnLabel[];
    rows: Row[];
    isSigned: boolean;
    checkItemId: number;
    disabled: boolean;
};

const MetaTable = ({ labels, rows, disabled, checkItemId }: MetaTableProps) => {
    const [tableIsScrollable, setTableIsScrollable] = useState(false);
    const tableContainerRef = useRef<HTMLDivElement>(
        document.createElement('div')
    );
    useEffect(() => {
        setTableIsScrollable(
            tableContainerRef.current.scrollWidth >
                tableContainerRef.current.clientWidth
        );
    }, [tableContainerRef]);

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
                    disabled={disabled}
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
        <HorizontalScroll ref={tableContainerRef}>
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
            {tableIsScrollable && (
                <div>
                    <p>
                        <i>Long table. Swipe right</i>
                    </p>
                    <EdsIcon name="arrow_drop_right" color="primary" />
                </div>
            )}
        </HorizontalScroll>
    );
};

export default MetaTable;
