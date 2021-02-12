import React, { useContext, useEffect, useState } from 'react';
import { CommPkgListWrapper, PreviewButton } from '../Scope/Scope';
import styled from 'styled-components';
import EdsIcon from '../../../components/icons/EdsIcon';
import { Typography } from '@equinor/eds-core-react';
import CompletionStatusIcon from '../../../components/icons/CompletionStatusIcon';
import CommAppContext, { AsyncStatus } from '../../../contexts/CommAppContext';
import { PunchPreview } from '../../../services/apiTypes';
import SkeletonLoadingPage from '../../../components/loading/SkeletonLoader';
import ErrorPage from '../../../components/error/ErrorPage';
import useCommonHooks from '../../../utils/useCommonHooks';
import { CommParams } from '../../../App';
import { useParams, useRouteMatch } from 'react-router-dom';

const InfoRow = styled.div`
    &:first-child {
        margin-right: 20px;
    }
`;

const ModuleAndTagWrapper = styled.div`
    display: flex;
`;

const PunchList = () => {
    const { api } = useContext(CommAppContext);
    const { url } = useRouteMatch();
    const { plant, commPkg } = useParams<CommParams>();
    const [punchList, setPunchList] = useState<PunchPreview[]>();
    const [fetchPunchListStatus, setFetchPunchListStatus] = useState(
        AsyncStatus.LOADING
    );

    useEffect(() => {
        (async () => {
            setFetchPunchListStatus(AsyncStatus.LOADING);
            try {
                const punchListFromApi = await api.getPunchList(plant, commPkg);
                setPunchList(punchListFromApi);
                setFetchPunchListStatus(AsyncStatus.SUCCESS);
            } catch {
                setFetchPunchListStatus(AsyncStatus.ERROR);
            }
        })();
    }, []);

    const punchListToDisplay = punchList?.map((punch) => (
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

    if (fetchPunchListStatus === AsyncStatus.LOADING) {
        return <SkeletonLoadingPage text="" />;
    }
    if (fetchPunchListStatus === AsyncStatus.ERROR) {
        return <ErrorPage title="Unable to load punch list" />;
    }
    if (fetchPunchListStatus === AsyncStatus.SUCCESS && punchList!.length < 1) {
        return (
            <CommPkgListWrapper>
                <h3>No punches to display.</h3>
            </CommPkgListWrapper>
        );
    }
    return <CommPkgListWrapper>{punchListToDisplay}</CommPkgListWrapper>;
};

export default PunchList;
