import React, { useContext, useEffect, useState } from 'react';
import SkeletonLoader from '../../../components/loading/SkeletonLoader';
import {
    ChecklistDetails,
    PunchCategory,
    PunchOrganization,
    PunchType,
} from '../../../services/apiTypes';
import { useParams } from 'react-router-dom';
import { CommParams } from '../../../App';
import CommAppContext, { AsyncStatus } from '../../../contexts/CommAppContext';
import ErrorPage from '../../../components/error/ErrorPage';
import Navbar from '../../../components/navigation/Navbar';
import ChecklistDetailsCard from '../../Checklist/ChecklistDetailsCard';
import NewPunchForm from './NewPunchForm';
import useFormFields from '../../../utils/useFormFields';
import { NewPunch as NewPunchType } from '../../../services/apiTypes';
import NewPunchSuccessPage from './NewPunchSuccessPage';

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
    const { api } = useContext(CommAppContext);
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
    const { plant, checklistId } = useParams<CommParams>();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const NewPunchDTO: NewPunchType = {
            CheckListId: parseInt(checklistId),
            CategoryId: parseInt(formFields.category),
            Description: formFields.description,
            TypeId: parseInt(formFields.type),
            RaisedByOrganizationId: parseInt(formFields.raisedBy),
            ClearingByOrganizationId: parseInt(formFields.clearingBy),
        };
        setSubmitPunchStatus(AsyncStatus.LOADING);
        try {
            await api.postNewPunch(plant, NewPunchDTO);
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
                    api.getPunchCategories(plant),
                    api.getPunchTypes(plant),
                    api.getPunchOrganizations(plant),
                    api.getChecklist(plant, checklistId),
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
    }, [plant, checklistId, api]);

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
                    formData={formFields}
                    createChangeHandler={createChangeHandler}
                    buttonText={'Create punch'}
                    handleSubmit={handleSubmit}
                    submitPunchStatus={submitPunchStatus}
                />
            </>
        );
    }

    if (submitPunchStatus === AsyncStatus.SUCCESS) {
        content = <NewPunchSuccessPage />;
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
