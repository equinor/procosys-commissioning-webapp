import { DotProgress } from '@equinor/eds-core-react';
import { InfoItem, AsyncStatus } from '@equinor/procosys-webapp-components';
import React from 'react';
import { ChecklistResponse } from '../../services/apiTypes';
import { DetailsWrapper } from '../EntityPage/EntityPageDetailsCard';

type ChecklistDetailsCardProps = {
    fetchDetailsStatus: AsyncStatus;
    details: ChecklistResponse | undefined;
};

const ChecklistDetailsCard = ({
    fetchDetailsStatus,
    details,
}: ChecklistDetailsCardProps): JSX.Element => {
    if (fetchDetailsStatus === AsyncStatus.SUCCESS && details != undefined) {
        return (
            <InfoItem
                isDetailsCard
                isScope
                status={details.checkList.status}
                statusLetters={[
                    details.checkList.signedByUser ? 'S' : null,
                    null,
                ]}
                headerText={details.checkList.tagNo}
                description={details.checkList.tagDescription}
                chips={[details.checkList.formularType].filter(
                    (x) => x != null
                )}
                attachments={details.checkList.attachmentCount}
            />
        );
    } else if (fetchDetailsStatus === AsyncStatus.ERROR) {
        return (
            <DetailsWrapper>
                Unable to load details. Please reload
            </DetailsWrapper>
        );
    }
    return (
        <DetailsWrapper>
            <DotProgress color="primary" />
        </DetailsWrapper>
    );
};

export default ChecklistDetailsCard;
