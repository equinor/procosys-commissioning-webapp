import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CommParams } from '../../App';
import CommAppContext, { AsyncStatus } from '../../contexts/CommAppContext';
import {
    PunchCategory,
    PunchType,
    PunchOrganization,
    PunchListItem,
} from '../../services/apiTypes';
import { ensure } from '../../utils/general';

export enum UpdatePunchEndpoint {
    Description = 'SetDescription',
    Category = 'SetCategory',
    Type = 'SetType',
    RaisedBy = 'SetRaisedBy',
    ClearingBy = 'SetClearingBy',
}

export type UpdatePunchData =
    | { RaisedByOrganizationId: number }
    | { CategoryId: number }
    | { TypeId: number }
    | { ClearingByOrganizationId: number }
    | { Description: string };

const useClearPunchFacade = () => {
    const { api } = useContext(CommAppContext);
    const { plant, punchListItemId } = useParams<CommParams>();
    const [punchItem, setPunchItem] = useState<PunchListItem>(
        {} as PunchListItem
    );
    const [categories, setCategories] = useState<PunchCategory[]>([]);
    const [types, setTypes] = useState<PunchType[]>([]);
    const [organizations, setOrganizations] = useState<PunchOrganization[]>([]);
    const [fetchPunchItemStatus, setFetchPunchItemStatus] = useState(
        AsyncStatus.LOADING
    );
    const [updatePunchStatus, setUpdatePunchStatus] = useState(
        AsyncStatus.INACTIVE
    );
    const [clearPunchStatus, setClearPunchStatus] = useState(
        AsyncStatus.INACTIVE
    );

    const updateDatabase = async (
        endpoint: UpdatePunchEndpoint,
        updateData: UpdatePunchData
    ) => {
        setUpdatePunchStatus(AsyncStatus.LOADING);
        try {
            await api.putUpdatePunch(
                plant,
                parseInt(punchListItemId),
                updateData,
                endpoint
            );
            setUpdatePunchStatus(AsyncStatus.SUCCESS);
        } catch (error) {
            setUpdatePunchStatus(AsyncStatus.ERROR);
        }
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPunchItem((prev) => ({
            ...prev,
            status: ensure(
                categories.find(
                    (category) => category.id === parseInt(e.target.value)
                )
            ).code,
        }));
        updateDatabase(UpdatePunchEndpoint.Category, {
            CategoryId: parseInt(e.target.value),
        });
    };

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPunchItem((prev) => ({
            ...prev,
            typeCode: ensure(
                types.find((type) => type.id === parseInt(e.target.value))
            ).code,
        }));
        updateDatabase(UpdatePunchEndpoint.Type, {
            TypeId: parseInt(e.target.value),
        });
    };

    const handleDescriptionChange = (
        e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    ) =>
        setPunchItem((prev) => ({
            ...prev,
            description: e.target.value,
        }));

    const handleRaisedByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPunchItem((prev) => ({
            ...prev,
            raisedByCode: ensure(
                organizations.find((org) => org.id === parseInt(e.target.value))
            ).code,
        }));
        updateDatabase(UpdatePunchEndpoint.RaisedBy, {
            RaisedByOrganizationId: parseInt(e.target.value),
        });
    };

    const handleClearingByChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setPunchItem((prev) => ({
            ...prev,
            clearingByCode: ensure(
                organizations.find((org) => org.id === parseInt(e.target.value))
            ).code,
        }));
        updateDatabase(UpdatePunchEndpoint.RaisedBy, {
            ClearingByOrganizationId: parseInt(e.target.value),
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setClearPunchStatus(AsyncStatus.LOADING);
        try {
            await api.postClearPunch(plant, parseInt(punchListItemId));
            setClearPunchStatus(AsyncStatus.SUCCESS);
        } catch (error) {
            setClearPunchStatus(AsyncStatus.ERROR);
        }
    };

    useEffect(() => {
        (async () => {
            try {
                const [
                    categoriesFromAPI,
                    typesFromAPI,
                    organizationsFromAPI,
                    punchListItemFromAPI,
                ] = await Promise.all([
                    api.getPunchCategories(plant),
                    api.getPunchTypes(plant),
                    api.getPunchOrganizations(plant),
                    api.getPunchListItem(plant, parseInt(punchListItemId)),
                ]);
                setCategories(categoriesFromAPI);
                setTypes(typesFromAPI);
                setOrganizations(organizationsFromAPI);
                setPunchItem(punchListItemFromAPI);
                setFetchPunchItemStatus(AsyncStatus.SUCCESS);
            } catch (error) {
                setFetchPunchItemStatus(AsyncStatus.ERROR);
            }
        })();
    }, [plant, api, punchListItemId]);

    return {
        updatePunchStatus,
        fetchPunchItemStatus,
        punchItem,
        clearPunchStatus,
        categories,
        types,
        organizations,
        updateDatabase,
        handleSubmit,
        handleCategoryChange,
        handleTypeChange,
        handleRaisedByChange,
        handleClearingByChange,
        handleDescriptionChange,
    };
};

export default useClearPunchFacade;
