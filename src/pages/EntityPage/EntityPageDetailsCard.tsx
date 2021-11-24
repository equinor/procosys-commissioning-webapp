import { DotProgress } from '@equinor/eds-core-react';
import {
    AsyncStatus,
    EntityDetails,
    isOfType,
    TextIcon,
} from '@equinor/procosys-webapp-components';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import DetailsCard from '../../components/CommPkgDetailsCard/DetailsCard';
import { Tag } from '../../services/apiTypes';
import { COLORS } from '../../style/GlobalStyles';
import useCommonHooks from '../../utils/useCommonHooks';
import { SearchType } from '../Search/Search';

export const DetailsWrapper = styled.p`
    text-align: center;
    padding: 12px;
`;

const EntityPageDetailsCard = (): JSX.Element => {
    const { params, api, history, url } = useCommonHooks();
    if (params.searchType === SearchType.Comm) {
        return <DetailsCard commPkgId={params.entityId} />;
    }
    const [fetchDetailsStatus, setFetchDetailsStatus] = useState<AsyncStatus>(
        AsyncStatus.LOADING
    );
    const [details, setDetails] = useState<Tag>();

    useEffect(() => {
        const source = axios.CancelToken.source();
        (async (): Promise<void> => {
            try {
                const detailsFromApi = await api.getEntityDetails(
                    params.plant,
                    params.searchType,
                    params.entityId,
                    source.token
                );
                if (isOfType<Tag>(detailsFromApi, 'tag')) {
                    setDetails(detailsFromApi);
                    setFetchDetailsStatus(AsyncStatus.SUCCESS);
                } else {
                    setFetchDetailsStatus(AsyncStatus.ERROR);
                }
            } catch (error) {
                if (!axios.isCancel(error)) {
                    setFetchDetailsStatus(AsyncStatus.ERROR);
                }
            }
        })();
        return (): void => {
            source.cancel('Detailscard unmounted');
        };
    }, [params.searchType, params.entityId, api]);

    if (fetchDetailsStatus === AsyncStatus.SUCCESS && details != undefined) {
        return (
            <EntityDetails
                icon={<TextIcon color={COLORS.pineGreen} text="Tag" />}
                headerText={details.tag.tagNo}
                description={details.tag.description}
                onClick={(): void =>
                    history.push(`${url}/Tag/${details.tag.id}`)
                }
                isDetailsCard
            />
        );
    } else if (fetchDetailsStatus === AsyncStatus.ERROR) {
        return <DetailsWrapper>Unable to load details.</DetailsWrapper>;
    } else {
        return (
            <DetailsWrapper>
                <DotProgress color="primary" />
            </DetailsWrapper>
        );
    }
};

export default EntityPageDetailsCard;
