import { useEffect, useState } from 'react';
import { AsyncStatus } from '../contexts/CommAppContext';
import { Attachment } from '../services/apiTypes';
import useCommonHooks from './useCommonHooks';

const useAttachments = (endpoint: string) => {
    const { api } = useCommonHooks();
    const [refreshAttachments, setRefreshAttachments] = useState(false);
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [fetchAttachmentsStatus, setFetchAttachmentsStatus] = useState(
        AsyncStatus.LOADING
    );

    useEffect(() => {
        (async () => {
            try {
                const attachmentsFromApi = await api.getAttachments(endpoint);
                setFetchAttachmentsStatus(AsyncStatus.SUCCESS);
                setAttachments(attachmentsFromApi);
            } catch {
                setFetchAttachmentsStatus(AsyncStatus.ERROR);
            }
        })();
    }, [api, refreshAttachments, endpoint]);

    return {
        fetchAttachmentsStatus,
        setFetchAttachmentsStatus,
        showUploadModal,
        setShowUploadModal,
        attachments,
        refreshAttachments: setRefreshAttachments,
    };
};

export default useAttachments;
