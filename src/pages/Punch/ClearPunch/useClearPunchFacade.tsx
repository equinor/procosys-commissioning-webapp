import React, { useContext, useEffect, useState } from 'react';
import { useHistory, useParams, useRouteMatch } from 'react-router-dom';
import { CommParams } from '../../../App';
import CommAppContext, { AsyncStatus } from '../../../contexts/CommAppContext';
import {
    PunchCategory,
    PunchType,
    PunchOrganization,
    PunchItem,
} from '../../../services/apiTypes';
import { ensure, removeLastSubdirectory } from '../../../utils/general';

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
    const { plant, punchItemId } = useParams<CommParams>();
    const { url } = useRouteMatch();
    const history = useHistory();
    const [punchItem, setPunchItem] = useState<PunchItem>({} as PunchItem);
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
                parseInt(punchItemId),
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

    const clearPunchItem = async (e: React.FormEvent) => {
        e.preventDefault();
        setClearPunchStatus(AsyncStatus.LOADING);
        try {
            await api.postClearPunch(plant, parseInt(punchItemId));
            setClearPunchStatus(AsyncStatus.SUCCESS);
            history.push(`${removeLastSubdirectory(url)}/verify`);
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
                    punchItemFromAPI,
                ] = await Promise.all([
                    api.getPunchCategories(plant),
                    api.getPunchTypes(plant),
                    api.getPunchOrganizations(plant),
                    api.getPunchItem(plant, parseInt(punchItemId)),
                ]);
                setCategories(categoriesFromAPI);
                setTypes(typesFromAPI);
                setOrganizations(organizationsFromAPI);
                setPunchItem(punchItemFromAPI);
                setFetchPunchItemStatus(AsyncStatus.SUCCESS);
            } catch (error) {
                setFetchPunchItemStatus(AsyncStatus.ERROR);
            }
        })();
    }, [plant, api, punchItemId]);

    return {
        updatePunchStatus,
        fetchPunchItemStatus,
        punchItem,
        clearPunchStatus,
        categories,
        types,
        organizations,
        url,
        updateDatabase,
        clearPunchItem,
        handleCategoryChange,
        handleTypeChange,
        handleRaisedByChange,
        handleClearingByChange,
        handleDescriptionChange,
    };
};

export default useClearPunchFacade;
