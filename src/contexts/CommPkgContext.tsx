import React, { ReactNode, useEffect, useState } from 'react';
import LoadingPage from '../components/loading/LoadingPage';
import * as api from '../services/api';
import { CommParams } from '../App';
import { useParams } from 'react-router-dom';
import {
    ChecklistPreview,
    CommPkg,
    PunchPreview,
    TaskPreview,
} from '../services/apiTypes';

export type CommPkgContextProps = {
    details: CommPkg;
    scope: ChecklistPreview[];
    tasks: TaskPreview[];
    punchList: PunchPreview[];
};

const CommPkgContext = React.createContext({} as CommPkgContextProps);

export const CommPkgContextProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [details, setDetails] = useState<CommPkg>();
    const [scope, setScope] = useState<ChecklistPreview[]>();
    const [tasks, setTasks] = useState<TaskPreview[]>();
    const [punchList, setPunchList] = useState<PunchPreview[]>();

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
            const [
                scopeFromAPI,
                tasksFromAPI,
                punchListFromAPI,
            ] = await Promise.all([
                api.getScope(`PCS$${plantInURL}`, details.id),
                api.getTasks(`PCS$${plantInURL}`, details.id),
                api.getPunchList(`PCS$${plantInURL}`, details.id),
            ]);
            setScope(scopeFromAPI);
            setTasks(tasksFromAPI);
            setPunchList(punchListFromAPI);
        })();
    }, [plantInURL, details]);

    if (!details || !scope || !tasks || !punchList)
        return <LoadingPage loadingText={'Loading commissioning package'} />;

    return (
        <CommPkgContext.Provider
            value={{
                details,
                scope,
                punchList,
                tasks,
            }}
        >
            {children}
        </CommPkgContext.Provider>
    );
};

export default CommPkgContext;
