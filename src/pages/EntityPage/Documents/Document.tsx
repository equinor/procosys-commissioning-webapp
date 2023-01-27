import {
    Attachment,
    Attachments,
    EntityDetails,
    TextIcon,
} from '@equinor/procosys-webapp-components';
import Axios from 'axios';
import React from 'react';
import useCommonHooks from '../../../utils/useCommonHooks';

const Document = (): JSX.Element => {
    const { api, params } = useCommonHooks();
    const source = Axios.CancelToken.source();

    return (
        <div>
            <EntityDetails
                icon={<TextIcon color={''} text={''} />} // TODO: replace? at least need different ones for each type
                headerText={''}
                description={''}
                isDetailsCard={true}
            />
            <Attachments
                getAttachments={(): Promise<Attachment[]> =>
                    // TODO: replace
                    api.getChecklistAttachments(
                        params.plant,
                        params.checklistId
                    )
                }
                getAttachment={(attachmentId: number): Promise<Blob> =>
                    // TODO: replace
                    api.getChecklistAttachment(
                        source.token,
                        params.plant,
                        params.checklistId,
                        attachmentId
                    )
                }
                setSnackbarText={function (message: string): void {
                    throw new Error('Function not implemented.');
                }}
                readOnly={true}
                source={source}
            />
        </div>
    );
};

export default Document;
