import { AsyncStatus } from '@equinor/procosys-webapp-components';
import React from 'react';
import AsyncPage from '../../../components/AsyncPage';
import Document from './Document';

interface DocumentsProps {
    fetchDocumentsStatus: AsyncStatus;
    documents: any[];
}

const Documents = ({
    fetchDocumentsStatus,
    documents,
}: DocumentsProps): JSX.Element => {
    return (
        <AsyncPage
            fetchStatus={fetchDocumentsStatus}
            errorMessage={"Couldn't get the documents"}
        >
            <>
                {documents.map((document) => (
                    <Document key={document.id} />
                ))}
            </>
        </AsyncPage>
    );
};

export default Documents;
