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

const ChecklistWrapper = styled.main`
    padding: 0 4%;
    display: flex;
    flex-direction: column;
`;

const Checklist = () => {
    const [checklistStatus, setChecklistStatus] = useState(AsyncStatus.LOADING);
    const [checkItems, setCheckItems] = useState<CheckItem[]>([]);
    const [checklistDetails, setChecklistDetails] = useState<
        ChecklistDetails
    >();
    const { checklistId, plant } = useParams<CommParams>();

    useEffect(() => {
        (async () => {
            try {
                const checklistResponse = await api.getChecklist(
                    plant,
                    checklistId
                );
                console.log(checklistResponse);
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
        checkItems.length > 0
    ) {
        content = (
            <ChecklistWrapper>
                <ChecklistDetailsCard details={checklistDetails} />
                <CheckItems items={checkItems} />
                <ChecklistSignature details={checklistDetails} />
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
