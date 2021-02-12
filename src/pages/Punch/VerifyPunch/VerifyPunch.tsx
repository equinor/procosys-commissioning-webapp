import { Button } from '@equinor/eds-core-react';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory, useParams, useRouteMatch } from 'react-router-dom';
import styled from 'styled-components';
import { CommParams } from '../../../App';
import ErrorPage from '../../../components/error/ErrorPage';
import SkeletonLoadingPage from '../../../components/loading/SkeletonLoader';
import Navbar from '../../../components/navigation/Navbar';
import CommAppContext, { AsyncStatus } from '../../../contexts/CommAppContext';
import CommPkgContext from '../../../contexts/CommPkgContext';
import { PunchItem } from '../../../services/apiTypes';
import { removeSubdirectories } from '../../../utils/general';
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
    const { url } = useRouteMatch();
    const history = useHistory();
    const [fetchPunchItemStatus, setFetchPunchItemStatus] = useState(
        AsyncStatus.LOADING
    );
    const [punchActionStatus, setPunchActionStatus] = useState(
        AsyncStatus.INACTIVE
    );
    const [punchItem, setPunchItem] = useState<PunchItem>();
    const { plant, punchItemId } = useParams<CommParams>();
    const { api } = useContext(CommAppContext);

    useEffect(() => {
        const source = axios.CancelToken.source();
        (async () => {
            try {
                const punchItemFromApi = await api.getPunchItem(
                    plant,
                    parseInt(punchItemId)
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
                plant,
                parseInt(punchItemId),
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
