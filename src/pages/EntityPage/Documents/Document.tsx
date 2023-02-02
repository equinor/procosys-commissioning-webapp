import {
    Attachment,
    Attachments,
    EntityDetails,
    TextIcon,
} from '@equinor/procosys-webapp-components';
import Axios from 'axios';
import React from 'react';
import useCommonHooks from '../../../utils/useCommonHooks';
import {
    Document as DocumentType,
    DocumentRelationType,
} from '../../../typings/apiTypes';
import { COLORS } from '../../../style/GlobalStyles';

interface DocumentProps {
    document: DocumentType;
}

const Document = ({ document }: DocumentProps): JSX.Element => {
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
        </div>
    );
};

export default Document;
