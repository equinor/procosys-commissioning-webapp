import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CommParams } from '../../App';
import ErrorPage from '../../components/error/ErrorPage';
import SkeletonLoadingPage from '../../components/loading/SkeletonLoader';
import Navbar from '../../components/navigation/Navbar';
import { AsyncStatus } from '../../contexts/UserContext';
import * as api from '../../services/api';
import { CheckItem, ChecklistDetails } from '../../services/apiTypes';
import CheckItems from './CheckItems/CheckItems';
import ChecklistSignature from './ChecklistSignature';
import ChecklistDetailsCard from './ChecklistDetailsCard';
import styled from 'styled-components';
import EdsIcon from '../../components/icons/EdsIcon';

const ChecklistWrapper = styled.main`
    padding: 0 4%;
    display: flex;
    flex-direction: column;
`;

const IsSignedBanner = styled.div`
    background-color: white;
    padding: 12px 4%;
    display: flex;
    align-items: center;
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
            <>
                <ChecklistDetailsCard
                    details={checklistDetails}
                    isSigned={isSigned}
                    descriptionLabel={'checklist'}
                />
                {isSigned && (
                    <IsSignedBanner>
                        <EdsIcon name="info_circle" />
                        <p>Unsign to make changes.</p>
                    </IsSignedBanner>
                )}
                <ChecklistWrapper>
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
            </>
        );
    }

    return (
        <>
            <Navbar
                noBorder={true}
                leftContent={{ name: 'back', label: 'CommPkg' }}
                rightContent={{ name: 'newPunch' }}
            />
            {content}
        </>
    );
};

export default Checklist;
