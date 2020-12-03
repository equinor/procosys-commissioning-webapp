import React, { ReactNode, useEffect, useState } from 'react';
import LoadingPage from '../components/loading/LoadingPage';
import * as api from '../services/api';
import { CommParams } from '../App';
import { useParams } from 'react-router-dom';
import { ChecklistPreview, CommPkg } from '../services/apiTypes';

export type PlantContextProps = {
    details: CommPkg;
    scope: ChecklistPreview[];
};

const CommPackageContext = React.createContext({} as PlantContextProps);

export const CommPackageContextProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [details, setDetails] = useState<CommPkg>();
    const [scope, setScope] = useState<ChecklistPreview[]>();
    const {
        plant: plantInURL,
        project: projectInURL,
        commPkg: commPkgInURL,
    } = useParams<CommParams>();

    useEffect(() => {
        (async () => {
            const detailsFromAPI = await api.getCommPackageDetails(
                `PCS$${plantInURL}`,
                commPkgInURL,
                projectInURL
            );
            setDetails(detailsFromAPI);
        })();
    }, [commPkgInURL, plantInURL, projectInURL]);

    useEffect(() => {
        if (!details) return;
        (async () => {
            const scopeFromAPI = await api.getScope(
                `PCS$${plantInURL}`,
                details.id
            );
            setScope(scopeFromAPI);
        })();
    }, [plantInURL, details]);

    if (!details || !scope)
        return (
            <LoadingPage loadingText={'Loading commissioning package . . .'} />
        );

    return (
        <CommPackageContext.Provider
            value={{
                details,
                scope,
            }}
        >
            {children}
        </CommPackageContext.Provider>
    );
};

export default CommPackageContext;
