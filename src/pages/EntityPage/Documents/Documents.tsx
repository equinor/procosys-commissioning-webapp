import {
    AsyncStatus,
    Document as DocumentType,
    DocumentFilter,
} from '@equinor/procosys-webapp-components';
import React, { useEffect, useState } from 'react';
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
    const [filteredDocuments, setFilteredDocuments] = useState<
        DocumentType[] | undefined
    >();

    useEffect(() => {
        setFilteredDocuments(documents);
    }, [documents]);
    return (
        <AsyncPage
            fetchStatus={fetchDocumentsStatus}
            errorMessage={"Couldn't get the documents"}
        >
            <>
                <DocumentFilter
                    setFilteredDocuments={setFilteredDocuments}
                    documents={documents}
                />
                {filteredDocuments?.map((document) => (
                    <Document key={document.documentId} document={document} />
                ))}
            </>
        </AsyncPage>
    );
};

export default Documents;
