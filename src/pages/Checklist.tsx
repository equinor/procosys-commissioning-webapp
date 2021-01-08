import React, { useEffect, useState } from 'react';
import { useParams, useRouteMatch } from 'react-router-dom';
import { CommParams } from '../App';
import ErrorPage from '../components/error/ErrorPage';
import SkeletonLoadingPage from '../components/loading/SkeletonLoader';
import Navbar from '../components/navigation/Navbar';
import { AsyncStatus } from '../contexts/UserContext';
import * as api from '../services/api';
import { CheckItem, ChecklistDetails } from '../services/apiTypes';
import CheckItems from '../components/checklist/CheckItems';
import ChecklistSignature from '../components/checklist/ChecklistSignature';
import ChecklistDetailsCard from '../components/checklist/ChecklistDetailsCard';
import styled from 'styled-components';
import EdsIcon from '../components/EdsIcon';
import PageHeader from '../components/PageHeader';

const ChecklistWrapper = styled.main`
    padding: 0 4%;
    display: flex;
    flex-direction: column;
`;

const IsSignedBanner = styled.div`
    background-color: #deecee;
    padding: 12px 16px;
    display: flex;
    align-items: center;
    margin-top: 16px;
    & p {
        margin: 0 0 0 12px;
    }
    & svg {
        flex: 24px 0 0;
    }
`;

const Checklist = () => {
    const [checklistStatus, setChecklistStatus] = useState(AsyncStatus.LOADING);
    const [checkItems, setCheckItems] = useState<CheckItem[]>([]);
    const [checklistDetails, setChecklistDetails] = useState<
        ChecklistDetails
    >();
    const [isSigned, setIsSigned] = useState(false);
    const { checklistId, plant } = useParams<CommParams>();

    useEffect(() => {
        if (!checklistDetails) return;
        setIsSigned(!!checklistDetails.signedByFirstName);
    }, [checklistDetails]);

    useEffect(() => {
        (async () => {
            try {
                const checklistResponse = await api.getChecklist(
                    plant,
                    checklistId
                );
                setCheckItems(checklistResponse.checkItems);
                setChecklistDetails(checklistResponse.checkList);
                setChecklistStatus(AsyncStatus.SUCCESS);
            } catch (err) {
                setChecklistStatus(AsyncStatus.ERROR);
            }
        })();
    }, [checklistId]);

    let content = <SkeletonLoadingPage text="Loading checklist" />;

    if (checklistStatus === AsyncStatus.ERROR) {
        content = (
            <ErrorPage
                title="Could not load checklist"
                description="Please reload this page or try again later"
            />
        );
    }

    if (
        checklistStatus === AsyncStatus.SUCCESS &&
        checklistDetails &&
        checklistDetails.id &&
        checkItems.length
    ) {
        content = (
            <ChecklistWrapper>
                {isSigned && (
                    <IsSignedBanner>
                        <EdsIcon name="info_circle" />
                        <p>
                            This checklist is signed and cannot be edited.
                            Unsign to make changes.
                        </p>
                    </IsSignedBanner>
                )}
                <ChecklistDetailsCard details={checklistDetails} />
                <CheckItems
                    checkItems={checkItems}
                    details={checklistDetails}
                    isSigned={isSigned}
                />
                <ChecklistSignature
                    isSigned={isSigned}
                    details={checklistDetails}
                    setIsSigned={setIsSigned}
                />
            </ChecklistWrapper>
        );
    }

    return (
        <>
            <Navbar leftContent="back" rightContent="newPunch" />
            {content}
        </>
    );
};

export default Checklist;
