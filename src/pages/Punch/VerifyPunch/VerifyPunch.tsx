import { Button } from '@equinor/eds-core-react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import ErrorPage from '../../../components/error/ErrorPage';
import SkeletonLoadingPage from '../../../components/loading/SkeletonLoader';
import Navbar from '../../../components/navigation/Navbar';
import { AsyncStatus } from '../../../contexts/CommAppContext';
import { PunchItem } from '../../../services/apiTypes';
import { removeSubdirectories } from '../../../utils/general';
import useCommonHooks from '../../../utils/useCommonHooks';
import PunchDetailsCard from '../ClearPunch/PunchDetailsCard';
import { PunchAction } from '../ClearPunch/useClearPunchFacade';

const VerifyPunchWrapper = styled.main`
    padding: 16px 4%;
    & p {
        margin-top: 0;
    }
`;

const ButtonGroup = styled.div`
    display: flex;
    margin-top: 24px;
    justify-content: flex-end;
    & button,
    button:disabled {
        margin-left: 12px;
    }
`;

const VerifyPunch = () => {
    const { url, history, params, api } = useCommonHooks();
    const [fetchPunchItemStatus, setFetchPunchItemStatus] = useState(
        AsyncStatus.LOADING
    );
    const [punchActionStatus, setPunchActionStatus] = useState(
        AsyncStatus.INACTIVE
    );
    const [punchItem, setPunchItem] = useState<PunchItem>();

    useEffect(() => {
        const source = axios.CancelToken.source();
        (async () => {
            try {
                const punchItemFromApi = await api.getPunchItem(
                    params.plant,
                    params.punchItemId
                );
                setPunchItem(punchItemFromApi);
                setFetchPunchItemStatus(AsyncStatus.SUCCESS);
            } catch (error) {
                setFetchPunchItemStatus(AsyncStatus.ERROR);
            }
        })();
        return () => {
            source.cancel('Checklist component unmounted');
        };
    }, []);

    const handlePunchAction = async (
        punchAction: PunchAction,
        nextStep: () => void
    ) => {
        setPunchActionStatus(AsyncStatus.LOADING);
        try {
            await api.postPunchAction(
                params.plant,
                params.punchItemId,
                punchAction
            );
            setPunchActionStatus(AsyncStatus.SUCCESS);
            nextStep();
        } catch (error) {
            setPunchActionStatus(AsyncStatus.ERROR);
        }
    };

    let content = <></>;
    if (fetchPunchItemStatus === AsyncStatus.LOADING) {
        content = <SkeletonLoadingPage text="Loading punch item" />;
    }
    if (fetchPunchItemStatus === AsyncStatus.ERROR) {
        content = <ErrorPage title="Unable to load punch item" />;
    }
    if (
        fetchPunchItemStatus === AsyncStatus.SUCCESS &&
        punchItem &&
        punchItem.clearedAt
    ) {
        content = (
            <>
                <PunchDetailsCard
                    systemModule={punchItem.systemModule}
                    tagDescription={punchItem.tagDescription}
                ></PunchDetailsCard>
                <VerifyPunchWrapper>
                    <label>Category:</label>
                    <p>{punchItem.status}</p>
                    <label>Type:</label>
                    <p>
                        {punchItem.typeCode}. {punchItem.typeDescription}
                    </p>
                    <label>Description:</label>
                    <p>{punchItem.description}</p>
                    <label>Raised By:</label>
                    <p>
                        {punchItem.raisedByCode}.{' '}
                        {punchItem.raisedByDescription}
                    </p>
                    <label>Clearing by:</label>
                    <p>
                        {punchItem.clearingByCode}.{' '}
                        {punchItem.clearingByDescription}
                    </p>
                    <label>Signatures:</label>
                    <p>
                        Cleared at{' '}
                        {new Date(punchItem.clearedAt).toLocaleDateString(
                            'en-GB'
                        )}{' '}
                        by {punchItem.clearedByFirstName}{' '}
                        {punchItem.clearedByLastName} ({punchItem.clearedByUser}
                        )
                    </p>
                    <ButtonGroup>
                        <Button
                            disabled={punchActionStatus === AsyncStatus.LOADING}
                            onClick={() =>
                                handlePunchAction(PunchAction.UNCLEAR, () =>
                                    history.push(
                                        removeSubdirectories(url, 1) + '/clear'
                                    )
                                )
                            }
                        >
                            Unclear
                        </Button>
                        <Button
                            disabled={punchActionStatus === AsyncStatus.LOADING}
                            onClick={() =>
                                handlePunchAction(PunchAction.REJECT, () =>
                                    history.push(
                                        removeSubdirectories(url, 1) + '/clear'
                                    )
                                )
                            }
                        >
                            Reject
                        </Button>
                        <Button
                            disabled={punchActionStatus === AsyncStatus.LOADING}
                            onClick={() =>
                                handlePunchAction(PunchAction.VERIFY, () => {
                                    history.push(removeSubdirectories(url, 2));
                                })
                            }
                        >
                            Verify
                        </Button>
                    </ButtonGroup>
                </VerifyPunchWrapper>
            </>
        );
    }
    return (
        <>
            <Navbar
                noBorder
                leftContent={{
                    name: 'back',
                    label: 'Punch list',
                    url: removeSubdirectories(url, 2),
                }}
            />
            {content}
        </>
    );
};

export default VerifyPunch;
