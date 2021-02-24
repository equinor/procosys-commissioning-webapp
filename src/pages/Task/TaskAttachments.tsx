import { Button, Card } from '@equinor/eds-core-react';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import EdsIcon from '../../components/icons/EdsIcon';
import SkeletonLoadingPage from '../../components/loading/SkeletonLoader';
import { AsyncStatus } from '../../contexts/CommAppContext';
import { Attachment } from '../../services/apiTypes';
import useCommonHooks from '../../utils/useCommonHooks';
import { TaskCardWrapper } from './TaskDescription';
const { CardHeader, CardHeaderTitle } = Card;

const AttachmentsWrapper = styled.div`
    display: flex;
    flex-direction: column;
`;
const AttachmentsRow = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    & > img {
        flex: 0.6;
        width: 48px;
        object-fit: contain;
        object-position: 0 0;
        margin-right: 16px;
    }

    & > div {
        flex: 0.6;
        width: 48px;
        height: 42px;
        background-color: #deecee;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 16px;
    }
    & p {
        flex: 3;
    }
    & button {
        flex: 0.6;
    }
`;

const TaskAttachments = () => {
    const { api, params } = useCommonHooks();
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [fetchAttachmentsStatus, setFetchAttachmentsStatus] = useState(
        AsyncStatus.LOADING
    );

    useEffect(() => {
        (async () => {
            try {
                const attachmentsFromApi = await api.getTaskAttachments(
                    params.plant,
                    params.taskId
                );
                setAttachments(attachmentsFromApi);
                setFetchAttachmentsStatus(AsyncStatus.SUCCESS);
            } catch {
                setFetchAttachmentsStatus(AsyncStatus.ERROR);
            }
        })();
    }, [api, params.plant, params.taskId]);

    const handleDownload = async (attachment: Attachment) => {
        const blob = await api.getTaskAttachment(
            params.plant,
            params.taskId,
            attachment.id
        );
        const tempLink = document.createElement('a');
        tempLink.style.display = 'none';
        tempLink.href = window.URL.createObjectURL(blob);
        tempLink.setAttribute('download', attachment.fileName);
        // Safari thinks _blank anchor are pop ups. We only want to set _blank
        // target if the browser does not support the HTML5 download attribute.
        // This allows you to download files in desktop safari if pop up blocking
        // is enabled.
        if (typeof tempLink.download === 'undefined') {
            tempLink.setAttribute('target', '_blank');
        }
        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);
    };

    const content = () => {
        if (
            fetchAttachmentsStatus === AsyncStatus.SUCCESS &&
            attachments.length > 0
        ) {
            return (
                <AttachmentsWrapper>
                    {attachments.map((attachment) => (
                        <AttachmentsRow key={attachment.id}>
                            {attachment.thumbnailAsBase64 ? (
                                <img
                                    src={`data:image/png;base64, ${attachment.thumbnailAsBase64}`}
                                    alt={attachment.title}
                                />
                            ) : (
                                <div>
                                    <EdsIcon name={'file'} />
                                </div>
                            )}
                            <p>{attachment.title}</p>
                            <Button
                                variant={'ghost_icon'}
                                onClick={() => handleDownload(attachment)}
                            >
                                <EdsIcon
                                    name={'cloud_download'}
                                    color="#007179"
                                />
                            </Button>
                        </AttachmentsRow>
                    ))}
                </AttachmentsWrapper>
            );
        } else if (
            fetchAttachmentsStatus === AsyncStatus.SUCCESS &&
            attachments.length < 1
        ) {
            return <p>No attachments for this task</p>;
        } else if (fetchAttachmentsStatus === AsyncStatus.ERROR) {
            return <p>Unable to load attachments. Please refresh.</p>;
        } else {
            return <SkeletonLoadingPage nrOfRows={3} />;
        }
    };

    return (
        <TaskCardWrapper>
            <Card>
                <CardHeader>
                    <CardHeaderTitle>
                        <h3>Attachments</h3>
                    </CardHeaderTitle>
                </CardHeader>
                {content()}
            </Card>
        </TaskCardWrapper>
    );
};

export default TaskAttachments;
