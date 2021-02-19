import React, { useEffect, useState } from 'react';
import { CommPkgListWrapper, PreviewButton } from '../Scope/Scope';
import styled from 'styled-components';
import EdsIcon from '../../../components/icons/EdsIcon';
import { Typography } from '@equinor/eds-core-react';
import CompletionStatusIcon from '../../../components/icons/CompletionStatusIcon';
import { AsyncStatus } from '../../../contexts/CommAppContext';
import { PunchPreview } from '../../../services/apiTypes';
import SkeletonLoadingPage from '../../../components/loading/SkeletonLoader';
import useCommonHooks from '../../../utils/useCommonHooks';

const InfoRow = styled.div`
    &:first-child {
        margin-right: 20px;
    }
`;

const ModuleAndTagWrapper = styled.div`
    display: flex;
`;

const PunchList = () => {
    const { api, url, params } = useCommonHooks();
    const [punchList, setPunchList] = useState<PunchPreview[]>();
    const [fetchPunchListStatus, setFetchPunchListStatus] = useState(
        AsyncStatus.LOADING
    );

    useEffect(() => {
        (async () => {
            setFetchPunchListStatus(AsyncStatus.LOADING);
            try {
                const punchListFromApi = await api.getPunchList(
                    params.plant,
                    params.commPkg
                );
                setPunchList(punchListFromApi);
                setFetchPunchListStatus(AsyncStatus.SUCCESS);
            } catch {
                setFetchPunchListStatus(AsyncStatus.ERROR);
            }
        })();
    }, [params.commPkg, params.plant, api]);

    const content = () => {
        if (
            fetchPunchListStatus === AsyncStatus.SUCCESS &&
            punchList &&
            punchList.length > 0
        ) {
            return (
                <>
                    {punchList.map((punch) => (
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
                                        <Typography
                                            variant="body_short"
                                            lines={1}
                                        >
                                            {punch.tagDescription}
                                        </Typography>
                                    </InfoRow>
                                </ModuleAndTagWrapper>
                            </div>
                            <EdsIcon name="chevron_right" />
                        </PreviewButton>
                    ))}
                </>
            );
        } else if (
            fetchPunchListStatus === AsyncStatus.SUCCESS &&
            punchList &&
            punchList.length < 1
        ) {
            return <h4>No punches to display.</h4>;
        } else if (fetchPunchListStatus === AsyncStatus.ERROR) {
            return (
                <h4>
                    Unable to get punch list. Please refresh or contact IT
                    support
                </h4>
            );
        } else {
            return <SkeletonLoadingPage text="" />;
        }
    };

    return <CommPkgListWrapper>{content()}</CommPkgListWrapper>;
};

export default PunchList;
