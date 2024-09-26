import {
  AsyncStatus,
  TagInfo,
  isOfType
} from "@equinor/procosys-webapp-components";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { SearchType } from "../pages/Search/Search";
import { AdditionalTagField, Tag, TagDetails } from "../typings/apiTypes";
import useCommonHooks from "../utils/useCommonHooks";

type TagInfoWrapperProps = {
  tagId?: number;
};

const TagInfoWrapper = ({ tagId }: TagInfoWrapperProps): JSX.Element => {
  const { api, params } = useCommonHooks();
  const [fetchTagStatus, setFetchTagStatus] = useState(AsyncStatus.INACTIVE);
  const [tagInfo, setTagInfo] = useState<TagDetails>();
  const [additionalFields, setAdditionalFields] = useState<
    AdditionalTagField[]
  >([]);
  const { token, cancel } = axios.CancelToken.source();

  const getTagDetails = useCallback(async () => {
    if (!tagId) return;
    setFetchTagStatus(AsyncStatus.LOADING);
    const tagResponse = await api
      .getEntityDetails(params.plant, SearchType.Tag, tagId.toString(), token)
      .catch(() => {
        setFetchTagStatus(AsyncStatus.ERROR);
      });
    if (isOfType<Tag>(tagResponse, "tag")) {
      setTagInfo(tagResponse.tag);
      setAdditionalFields(tagResponse.additionalFields);
      setFetchTagStatus(AsyncStatus.SUCCESS);
    }
  }, [tagId]);

  useEffect(() => {
    getTagDetails();
    return (): void => {
      cancel("Tag info component unmounted");
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
