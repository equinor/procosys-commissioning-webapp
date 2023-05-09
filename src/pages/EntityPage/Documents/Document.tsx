import {
    Attachment,
    Attachments,
    AttachmentsFromList,
    EntityDetails,
    TextIcon,
    Document as DocumentType,
    DocumentRelationType,
} from '@equinor/procosys-webapp-components';
import Axios from 'axios';
import React from 'react';
import useCommonHooks from '../../../utils/useCommonHooks';
import { COLORS } from '../../../style/GlobalStyles';
import styled from 'styled-components';

const AttachmentsWrapper = styled.div`
    padding: 0 16px;
`;

interface DocumentProps {
    document: DocumentType;
    setSnackbar: React.Dispatch<React.SetStateAction<string>>;
}

const Document = ({ document, setSnackbar }: DocumentProps): JSX.Element => {
    const { api, params } = useCommonHooks();
    const source = Axios.CancelToken.source();

    const getIcon = (): JSX.Element => {
        if (document.relationType == DocumentRelationType.BOUNDARY)
            return <TextIcon color={COLORS.darkGrey} text={'Bou.'} />;
        else if (document.relationType == DocumentRelationType.OTHER)
            return <TextIcon color={COLORS.pineGreen} text={'Oth.'} />;
        return <></>;
    };

    return (
        <div>
            <EntityDetails
                icon={getIcon()}
                headerText={document.documentNo}
                description={document.title}
                details={[document.revisionNo]}
            />
            <AttachmentsWrapper>
                <AttachmentsFromList
                    attachments={document.attachments}
                    getAttachment={function (
                        attachmentId: number
                    ): Promise<Blob> {
                        return api.getDocumentAttachment(
                            source.token,
                            params.plant,
                            document.revisionId,
                            attachmentId
                        );
                    }}
                    setSnackbarText={setSnackbar}
                />
            </AttachmentsWrapper>
        </div>
    );
};

export default Document;
