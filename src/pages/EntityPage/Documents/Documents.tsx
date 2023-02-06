import {
    AsyncStatus,
    Document as DocumentType,
    DocumentFilter,
    useSnackbar,
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
    const { snackbar, setSnackbarText } = useSnackbar();

    useEffect(() => {
        setFilteredDocuments(documents);
    }, [documents]);
    return (
        <AsyncPage
            fetchStatus={fetchDocumentsStatus}
            errorMessage={"Couldn't get the documents"}
            emptyContentMessage={'No documents for this comm package'}
        >
            <>
                <DocumentFilter
                    setFilteredDocuments={setFilteredDocuments}
                    documents={documents}
                />
                {filteredDocuments?.map((document) => (
                    <Document
                        key={document.documentId}
                        document={document}
                        setSnackbar={setSnackbarText}
                    />
                ))}
                {snackbar}
            </>
        </AsyncPage>
    );
};

export default Documents;
