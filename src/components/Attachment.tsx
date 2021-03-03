import { Button, CircularProgress, Scrim } from '@equinor/eds-core-react';
import React, { useState } from 'react';
import styled from 'styled-components';
import { AsyncStatus } from '../contexts/CommAppContext';
import { ModalContainer } from '../pages/Task/TaskAttachments';
import { Attachment as AttachmentType } from '../services/apiTypes';
import { handleDownload } from '../utils/general';
import useCommonHooks from '../utils/useCommonHooks';
import EdsIcon from './icons/EdsIcon';

type AttachmentProps = {
    attachment: AttachmentType;
    setAttachments: React.Dispatch<React.SetStateAction<AttachmentType[]>>;
    parentId: string;
    deleteAttachment: (
        plantId: string,
        checklistId: string,
        attachmentId: number
    ) => Promise<void>;
    getAttachment: (
        plantId: string,
        checklistId: string,
        attachmentId: number
    ) => Promise<Blob>;
    setSnackbarText: React.Dispatch<React.SetStateAction<string>>;
};
const LoadingWrapper = styled.div`
    height: 64px;
    width: 64px;
    margin: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const AttachmentImage = styled.img`
    height: 64px;
    margin: 8px;
`;

const ChecklistModal = styled.div`
    width: 80vw;
    max-height: 80vh;
    padding: 16px;
    & > img {
        width: 100%;
        object-fit: contain;
    }
    & button {
        float: right;
        margin-top: 16px;
        margin-left: 16px;
    }
`;

const Attachment = ({
    attachment,
    getAttachment,
    deleteAttachment,
    setAttachments,
    setSnackbarText,
    parentId,
}: AttachmentProps) => {
    const { params } = useCommonHooks();
    const [showFullScreenImage, setShowFullScreenImage] = useState(false);
    const [attachmentFileURL, setAttachmentFileURL] = useState('');
    const [loadingStatus, setLoadingStatus] = useState(AsyncStatus.INACTIVE);

    const loadImage = async () => {
        setLoadingStatus(AsyncStatus.LOADING);
        try {
            const blob = await getAttachment(
                params.plant,
                // The parentID is the ID of the punch/task/checklist the attachment is attached to
                parentId,
                attachment.id
            );
            const imageUrl = window.URL.createObjectURL(blob);
            setAttachmentFileURL(imageUrl);
            setShowFullScreenImage(true);
            setLoadingStatus(AsyncStatus.SUCCESS);
        } catch {
            setSnackbarText('Unable to load image.');
            setLoadingStatus(AsyncStatus.ERROR);
        }
    };

    return (
        <>
            {showFullScreenImage ? (
                <Scrim
                    isDismissable
                    onClose={() => setShowFullScreenImage(false)}
                >
                    <ChecklistModal>
                        <img src={attachmentFileURL} alt={attachment.title} />
                        <Button
                            onClick={() => {
                                handleDownload(
                                    attachmentFileURL,
                                    attachment.fileName
                                );
                                setSnackbarText(
                                    'Image successfully downloaded.'
                                );
                            }}
                        >
                            <EdsIcon name="cloud_download" />
                            Download
                        </Button>
                        <Button onClick={() => setShowFullScreenImage(false)}>
                            <EdsIcon name="close" />
                            Close
                        </Button>
                    </ChecklistModal>
                </Scrim>
            ) : null}
            {loadingStatus === AsyncStatus.LOADING ? (
                <LoadingWrapper>
                    <CircularProgress />
                </LoadingWrapper>
            ) : (
                <AttachmentImage
                    src={`data:image/png;base64, ${attachment.thumbnailAsBase64}`}
                    alt={attachment.title}
                    onClick={loadImage}
                />
            )}
        </>
    );
};

export default Attachment;
