import React, { useEffect, useState } from 'react';
import SkeletonLoader from '../../../components/loading/SkeletonLoader';
import {
    ChecklistDetails,
    PunchCategory,
    PunchOrganization,
    PunchType,
} from '../../../services/apiTypes';
import { AsyncStatus } from '../../../contexts/CommAppContext';
import ErrorPage from '../../../components/error/ErrorPage';
import Navbar from '../../../components/navigation/Navbar';
import ChecklistDetailsCard from '../../Checklist/ChecklistDetailsCard';
import NewPunchForm from './NewPunchForm';
import useFormFields from '../../../utils/useFormFields';
import { NewPunch as NewPunchType } from '../../../services/apiTypes';
import NewPunchSuccessPage from './NewPunchSuccessPage';
import useCommonHooks from '../../../utils/useCommonHooks';
import { PunchWrapper } from '../ClearPunch/ClearPunch';

export type PunchFormData = {
    category: string;
    type: string;
    description: string;
    raisedBy: string;
    clearingBy: string;
};

const newPunchInitialValues = {
    category: '',
    type: '',
    description: '',
    raisedBy: '',
    clearingBy: '',
};

const NewPunch = () => {
    const { api, params } = useCommonHooks();
    const { formFields, createChangeHandler } = useFormFields(
        newPunchInitialValues
    );
    const [categories, setCategories] = useState<PunchCategory[]>([]);
    const [types, setTypes] = useState<PunchType[]>([]);
    const [organizations, setOrganizations] = useState<PunchOrganization[]>([]);
    const [fetchNewPunchStatus, setFetchNewPunchStatus] = useState(
        AsyncStatus.LOADING
    );
    const [submitPunchStatus, setSubmitPunchStatus] = useState(
        AsyncStatus.INACTIVE
    );
    const [checklistDetails, setChecklistDetails] = useState<
        ChecklistDetails
    >();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const NewPunchDTO: NewPunchType = {
            CheckListId: parseInt(params.checklistId),
            CategoryId: parseInt(formFields.category),
            Description: formFields.description,
            TypeId: parseInt(formFields.type),
            RaisedByOrganizationId: parseInt(formFields.raisedBy),
            ClearingByOrganizationId: parseInt(formFields.clearingBy),
        };
        setSubmitPunchStatus(AsyncStatus.LOADING);
        try {
            await api.postNewPunch(params.plant, NewPunchDTO);
            setSubmitPunchStatus(AsyncStatus.SUCCESS);
        } catch (error) {
            setSubmitPunchStatus(AsyncStatus.ERROR);
        }
    };

    useEffect(() => {
        (async () => {
            try {
                const [
                    categoriesFromApi,
                    typesFromApi,
                    organizationsFromApi,
                    checklistFromApi,
                ] = await Promise.all([
                    api.getPunchCategories(params.plant),
                    api.getPunchTypes(params.plant),
                    api.getPunchOrganizations(params.plant),
                    api.getChecklist(params.plant, params.checklistId),
                ]);
                setCategories(categoriesFromApi);
                setTypes(typesFromApi);
                setOrganizations(organizationsFromApi);
                setChecklistDetails(checklistFromApi.checkList);
                setFetchNewPunchStatus(AsyncStatus.SUCCESS);
            } catch (error) {
                setFetchNewPunchStatus(AsyncStatus.ERROR);
            }
        })();
    }, [params.plant, params.checklistId, api]);

    const content = () => {
        if (submitPunchStatus === AsyncStatus.SUCCESS) {
            return <NewPunchSuccessPage />;
        } else if (
            fetchNewPunchStatus === AsyncStatus.SUCCESS &&
            checklistDetails
        ) {
            return (
                <>
                    <ChecklistDetailsCard
                        details={checklistDetails}
                        descriptionLabel={'New punch for:'}
                    />
                    <NewPunchForm
                        categories={categories}
                        types={types}
                        organizations={organizations}
                        formData={formFields}
                        createChangeHandler={createChangeHandler}
                        buttonText={'Create punch'}
                        handleSubmit={handleSubmit}
                        submitPunchStatus={submitPunchStatus}
                    />
                </>
            );
        } else if (fetchNewPunchStatus === AsyncStatus.ERROR) {
            return <ErrorPage title="Could not load new punch" />;
        } else {
            return <SkeletonLoader text="Loading new punch" />;
        }
    };

    return (
        <>
            <Navbar
                noBorder
                leftContent={{ name: 'back', label: 'Checklist' }}
            />
            <PunchWrapper>{content()}</PunchWrapper>
        </>
    );
};

export default NewPunch;
