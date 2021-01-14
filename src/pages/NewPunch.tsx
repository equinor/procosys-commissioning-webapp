import React, { useContext, useEffect, useState } from 'react';
import SkeletonLoader from '../components/loading/SkeletonLoader';
import {
    ChecklistDetails,
    PunchCategory,
    PunchOrganization,
    PunchType,
} from '../services/apiTypes';
import * as API from '../services/api';
import { useParams } from 'react-router-dom';
import { CommParams } from '../App';
import { AsyncStatus } from '../contexts/UserContext';
import ErrorPage from '../components/error/ErrorPage';
import Navbar from '../components/navigation/Navbar';
import styled from 'styled-components';
import ChecklistDetailsCard from '../components/checklist/ChecklistDetailsCard';
import CommPkgContext from '../contexts/CommPkgContext';
import NewPunchForm from '../components/newPunch/NewPunchForm';

const NewPunch = () => {
    const [categories, setCategories] = useState<PunchCategory[]>([]);
    const [types, setTypes] = useState<PunchType[]>([]);
    const [organizations, setOrganizations] = useState<PunchOrganization[]>([]);
    const [fetchNewPunchStatus, setFetchNewPunchStatus] = useState(
        AsyncStatus.LOADING
    );
    const [checklistDetails, setChecklistDetails] = useState<
        ChecklistDetails
    >();
    const { plant, checklistId } = useParams<CommParams>();
    const { details } = useContext(CommPkgContext);

    useEffect(() => {
        (async () => {
            try {
                const [
                    categoriesFromAPI,
                    typesFromAPI,
                    organizationsFromAPI,
                    checklistFromAPI,
                ] = await Promise.all([
                    API.getPunchCategories(plant),
                    API.getPunchTypes(plant),
                    API.getPunchOrganizations(plant),
                    API.getChecklist(plant, checklistId),
                ]);
                setCategories(categoriesFromAPI);
                setTypes(typesFromAPI);
                setOrganizations(organizationsFromAPI);
                setChecklistDetails(checklistFromAPI.checkList);
                setFetchNewPunchStatus(AsyncStatus.SUCCESS);
            } catch (error) {
                setFetchNewPunchStatus(AsyncStatus.ERROR);
            }
        })();
    }, [plant, checklistId]);

    let content = null;
    if (fetchNewPunchStatus === AsyncStatus.LOADING) {
        content = <SkeletonLoader text="Loading new punch" />;
    }
    if (fetchNewPunchStatus === AsyncStatus.ERROR) {
        content = <ErrorPage title="Could not load new punch" />;
    }
    if (fetchNewPunchStatus === AsyncStatus.SUCCESS && checklistDetails) {
        content = (
            <>
                <ChecklistDetailsCard
                    details={checklistDetails}
                    descriptionLabel={'New punch for:'}
                />
                <NewPunchForm
                    categories={categories}
                    types={types}
                    organizations={organizations}
                />
            </>
        );
    }

    return (
        <>
            <Navbar
                noBorder
                leftContent={{ name: 'back', label: 'Checklist' }}
            />
            {content}
        </>
    );
};

export default NewPunch;
