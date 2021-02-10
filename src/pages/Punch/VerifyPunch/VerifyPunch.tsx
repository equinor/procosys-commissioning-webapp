import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CommParams } from '../../../App';
import CommAppContext, { AsyncStatus } from '../../../contexts/CommAppContext';
import { PunchItem } from '../../../services/apiTypes';
import PunchDetailsCard from '../ClearPunch/PunchDetailsCard';

const VerifyPunch = () => {
    const [fetchPunchItemStatus, setFetchPunchItemStatus] = useState(
        AsyncStatus.LOADING
    );
    const [punchItem, setPunchItem] = useState<PunchItem>();
    const { plant, punchItemId } = useParams<CommParams>();
    const { api } = useContext(CommAppContext);

    useEffect(() => {
        const source = axios.CancelToken.source();
        (async () => {
            try {
                const punchItemFromApi = await api.getPunchItem(
                    plant,
                    parseInt(punchItemId)
                );
                setPunchItem(punchItemFromApi);
                setFetchPunchItemStatus(AsyncStatus.SUCCESS);
            } catch (error) {
                setFetchPunchItemStatus(AsyncStatus.ERROR);
            }
        })();
        return () => {
            source.cancel('Checklist component unmounted');
        };
    }, []);

    return (
        <>
            <PunchDetailsCard></PunchDetailsCard>
        </>
    );
};

export default VerifyPunch;
