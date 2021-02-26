import { Button, Card, Scrim } from '@equinor/eds-core-react';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import EdsIcon from '../../components/icons/EdsIcon';
import SkeletonLoadingPage from '../../components/loading/SkeletonLoader';
import { AsyncStatus } from '../../contexts/CommAppContext';
import { Attachment } from '../../services/apiTypes';
import useCommonHooks from '../../utils/useCommonHooks';
import { TaskCardWrapper } from './Task';
const { CardHeader, CardHeaderTitle } = Card;

const ModalContainer = styled.div`
    & img {
        max-width: 100vw;
        max-height: 90vh;
        object-fit: contain;
    }
    & button {
        margin-top: 12px;
        float: right;
    }
`;
const AttachmentsWrapper = styled.div`
    display: flex;
    flex-direction: column;
`;
const AttachmentsRow = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    & > img {
        flex: 0.4;
        width: 32px;
        object-fit: contain;
        object-position: 0 0;
        margin-right: 16px;
    }

    & > div {
        flex: 0.4;
        width: 32px;
        height: 32px;
        background-color: #fafafa;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 16px;
    }
    & p {
        flex: 3;
        margin: 0;
    }
    & button {
        flex: 0.6;
    }
`;

type TaskAttachmentsProps = {
    setSnackbarText: React.Dispatch<React.SetStateAction<string>>;
};

const TaskAttachments = ({ setSnackbarText }: TaskAttachmentsProps) => {
    const { api, params } = useCommonHooks();
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [fetchAttachmentsStatus, setFetchAttachmentsStatus] = useState(
        AsyncStatus.LOADING
    );
    const [fullScreenImageUrl, setFullScreenImageUrl] = useState('');
    const [showFullScreenImage, setShowFullScreenImage] = useState(false);
    const [fullScreenImageTitle, setFullScreenImageTitle] = useState('');

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
        try {
            const blob = await api.getTaskAttachment(
                params.plant,
                params.taskId,
                attachment.id
            );
            const tempLink = document.createElement('a');
            tempLink.style.display = 'none';
            tempLink.href = window.URL.createObjectURL(blob);
            tempLink.setAttribute('download', attachment.fileName);
            if (typeof tempLink.download === 'undefined') {
                tempLink.setAttribute('target', '_blank');
            }
            document.body.appendChild(tempLink);
            tempLink.click();
            document.body.removeChild(tempLink);
            setSnackbarText('Attachment downloaded.');
        } catch {
            setSnackbarText('Unable to get attachment.');
        }
    };

    const showLargeImage = async (attachmentId: number, imageTitle: string) => {
        try {
            const blob = await api.getTaskAttachment(
                params.plant,
                params.taskId,
                attachmentId
            );
            const imageUrl = window.URL.createObjectURL(blob);
            setFullScreenImageUrl(imageUrl);
            setFullScreenImageTitle(imageTitle);
            setShowFullScreenImage(true);
        } catch {
            setSnackbarText('Unable to load image.');
        }
    };

    const determineAttachment = (attachment: Attachment) => {
        //Attachment is an image
        if (attachment.thumbnailAsBase64) {
            return (
                <>
                    <img
                        src={`data:image/png;base64, ${attachment.thumbnailAsBase64}`}
                        alt={attachment.title}
                        onClick={() =>
                            showLargeImage(attachment.id, attachment.title)
                        }
                    />
                    <p>{attachment.title}</p>
                    <Button
                        variant={'ghost_icon'}
                        onClick={() => handleDownload(attachment)}
                    >
                        <EdsIcon name={'cloud_download'} color="#007179" />
                    </Button>
                </>
            );
            //Attachment is a document or other file
        } else if (attachment.hasFile) {
            return (
                <>
                    <div>
                        <EdsIcon name={'file'} />
                    </div>
                    <p>{attachment.title}</p>
                    <Button
                        variant={'ghost_icon'}
                        onClick={() => handleDownload(attachment)}
                    >
                        <EdsIcon name={'cloud_download'} color="#007179" />
                    </Button>
                </>
            );
            //Attachment is a link
        } else {
            return (
                <>
                    <div>
                        <EdsIcon name={'link'} />
                    </div>
                    <p>
                        <a href={attachment.uri}>{attachment.title}</a>
                    </p>
                    <Button variant={'ghost_icon'}></Button>
                </>
            );
        }
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
                            {determineAttachment(attachment)}
                        </AttachmentsRow>
                    ))}
                </AttachmentsWrapper>
            );
        } else if (
            fetchAttachmentsStatus === AsyncStatus.SUCCESS &&
            attachments.length < 1
        ) {
            return <p>This task has no attachments.</p>;
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
                {showFullScreenImage ? (
                    <Scrim
                        isDismissable
                        onClose={() => setShowFullScreenImage(false)}
                    >
                        <ModalContainer>
                            <img
                                src={fullScreenImageUrl}
                                alt={fullScreenImageTitle}
                            />
                            <Button
                                onClick={() => setShowFullScreenImage(false)}
                            >
                                <EdsIcon name="close" />
                                Close
                            </Button>
                        </ModalContainer>
                    </Scrim>
                ) : null}

                {content()}
            </Card>
        </TaskCardWrapper>
    );
};

export default TaskAttachments;
