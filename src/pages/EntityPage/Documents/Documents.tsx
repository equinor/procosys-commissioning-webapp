import {
    AsyncStatus,
    Document as DocumentType,
} from '@equinor/procosys-webapp-components';
import React from 'react';
import AsyncPage from '../../../components/AsyncPage';
import Document from './Document';

interface DocumentsProps {
    fetchDocumentsStatus: AsyncStatus;
    documents?: DocumentType[];
}

const Documents = ({
    fetchDocumentsStatus,
    documents,
}: DocumentsProps): JSX.Element => {
    // TODO: add a filter for documents
    return (
        <AsyncPage
            fetchStatus={fetchDocumentsStatus}
            errorMessage={"Couldn't get the documents"}
        >
            <>
                {documents?.map((document) => (
                    <Document key={document.documentId} document={document} />
                ))}
            </>
        </AsyncPage>
    );
};

export default Documents;
