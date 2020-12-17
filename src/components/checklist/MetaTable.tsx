import React from 'react';
import { ColumnLabel, Row } from '../../services/apiTypes';

type MetaTableProps = {
    labels: ColumnLabel[];
    rows: Row[];
};

const MetaTable = ({ labels, rows }: MetaTableProps) => {
    return <div></div>;
};

export default MetaTable;
