import React, { useState, useEffect } from 'react';
import {
    TagInfo,
    AsyncStatus,
    isOfType,
} from '@equinor/procosys-webapp-components';
import axios from 'axios';
import { AdditionalTagField, Tag, TagDetails } from '../typings/apiTypes';
import useCommonHooks from '../utils/useCommonHooks';
import { SearchType } from '../pages/Search/Search';

type TagInfoWrapperProps = {
    tagId?: number;
};

const TagInfoWrapper = ({ tagId }: TagInfoWrapperProps): JSX.Element => {
    const { api, params } = useCommonHooks();
    const [fetchTagStatus, setFetchTagStatus] = useState(AsyncStatus.LOADING);
    const [tagInfo, setTagInfo] = useState<TagDetails>();
    const [additionalFields, setAdditionalFields] = useState<
        AdditionalTagField[]
    >([]);
    const { token, cancel } = axios.CancelToken.source();
    const controller = new AbortController();
    const abortSignal = controller.signal;

    useEffect(() => {
        if (!tagId) return;
        (async (): Promise<void> => {
            try {
                const tagResponse = await api.getEntityDetails(
                    params.plant,
                    SearchType.Tag,
                    tagId.toString(),
                    abortSignal
                );
                if (isOfType<Tag>(tagResponse, 'tag')) {
                    setTagInfo(tagResponse.tag);
                    setAdditionalFields(tagResponse.additionalFields);
                    setFetchTagStatus(AsyncStatus.SUCCESS);
                }
            } catch (error) {
                setFetchTagStatus(AsyncStatus.ERROR);
            }
        })();
        return (): void => {
            cancel('Tag info component unmounted');
        };
    }, [tagId]);

    return (
        <TagInfo
            tagInfo={tagInfo}
            fetchTagStatus={fetchTagStatus}
            additionalFields={additionalFields}
        />
    );
};

export default TagInfoWrapper;
