import React, { useContext } from 'react';
import CommPkgContext from '../../../contexts/CommPkgContext';
import { CommPkgListWrapper, PreviewButton } from '../Scope/Scope';
import styled from 'styled-components';
import EdsIcon from '../../../components/icons/EdsIcon';
import { Typography } from '@equinor/eds-core-react';
import CompletionStatusIcon from '../../../components/icons/CompletionStatusIcon';
import { useRouteMatch } from 'react-router-dom';

const InfoRow = styled.div`
    margin-top: 4px;
    &:first-child {
        margin-right: 20px;
    }
`;

const ModuleAndTagWrapper = styled.div`
    display: flex;
`;

const PunchList = () => {
    const { punchList } = useContext(CommPkgContext);
    const { url } = useRouteMatch();
    const punchListToDisplay = punchList.map((punch) => (
        <PreviewButton
            to={
                punch.cleared
                    ? `${url}/${punch.id}/verify`
                    : `${url}/${punch.id}/clear`
            }
            key={punch.id}
        >
            <CompletionStatusIcon status={punch.status} />
            <div>
                <Typography variant="body_short" lines={2}>
                    {punch.cleared ? 'Cleared: ' : null}
                    {punch.description}
                </Typography>
                <ModuleAndTagWrapper>
                    <InfoRow>
                        <label>Module: </label>
                        <p>{punch.systemModule}</p>
                    </InfoRow>
                    <InfoRow>
                        <label>Tag: </label>
                        <Typography variant="body_short" lines={1}>
                            {punch.tagDescription}
                        </Typography>
                    </InfoRow>
                </ModuleAndTagWrapper>
            </div>
            <EdsIcon name="chevron_right" />
        </PreviewButton>
    ));

    if (punchList.length < 1) {
        return (
            <CommPkgListWrapper>
                <h3>No punches to display.</h3>
            </CommPkgListWrapper>
        );
    }

    return <CommPkgListWrapper>{punchListToDisplay}</CommPkgListWrapper>;
};

export default PunchList;
