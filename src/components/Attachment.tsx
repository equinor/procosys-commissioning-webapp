import { Button, CircularProgress, Scrim } from '@equinor/eds-core-react';
import React, { useState } from 'react';
import styled from 'styled-components';
import { AsyncStatus } from '../contexts/CommAppContext';
import { Attachment as AttachmentType } from '../services/apiTypes';
import { handleDownload } from '../utils/general';
import useCommonHooks from '../utils/useCommonHooks';
import EdsIcon from './icons/EdsIcon';

export const AttachmentsWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
`;

export const UploadImageButton = styled(Button)`
    height: 82px;
    width: 82px;
    margin: 8px;
    &:disabled {
        height: 82px;
        width: 82px;
        margin: 8px;
    }
`;

const LoadingWrapper = styled.div`
    height: 82px;
    width: 82px;
    margin: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const AttachmentImage = styled.img`
    height: 82px;
    margin: 8px;
`;

export const ImageModal = styled.div`
    width: 80vw;
    max-height: 80vh;
    padding: 16px;
    & > img {
        width: 100%;
        max-height: 80vh;
        object-fit: contain;
    }
    & button,
    button:disabled {
        float: right;
        margin-top: 12px;
        margin-left: 12px;
    }
`;

type AttachmentProps = {
    attachment: AttachmentType;
    refreshAttachments: React.Dispatch<React.SetStateAction<boolean>>;
    parentId: string;
    isSigned?: boolean;
    deleteAttachment?:
        | ((
              plantId: string,
              checklistId: string,
              attachmentId: number
          ) => Promise<void>)
        | ((
              plantId: string,
              punchItemId: string,
              attachmentId: number
          ) => Promise<void>);
    getAttachment:
        | ((
              plantId: string,
              checklistId: string,
              attachmentId: number
          ) => Promise<Blob>)
        | ((
              plantId: string,
              punchListId: string,
              attachmentId: number
          ) => Promise<Blob>);
    setSnackbarText: React.Dispatch<React.SetStateAction<string>>;
};

const Attachment = ({
    attachment,
    getAttachment,
    deleteAttachment,
    refreshAttachments,
    setSnackbarText,
    parentId,
    isSigned = false,
}: AttachmentProps) => {
    const { params } = useCommonHooks();
    const [showFullScreenImage, setShowFullScreenImage] = useState(false);
    const [attachmentFileURL, setAttachmentFileURL] = useState('');
    const [loadingStatus, setLoadingStatus] = useState(AsyncStatus.INACTIVE);
    const [deleteStatus, setDeleteStatus] = useState(AsyncStatus.INACTIVE);

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

    const handleDelete = async () => {
        if (!deleteAttachment) return;
        setDeleteStatus(AsyncStatus.LOADING);
        try {
            await deleteAttachment(params.plant, parentId, attachment.id);
            setSnackbarText('Attachment successfully removed');
            refreshAttachments((prev) => !prev);
            setDeleteStatus(AsyncStatus.SUCCESS);
            setShowFullScreenImage(false);
        } catch (error) {
            setDeleteStatus(AsyncStatus.ERROR);
            setSnackbarText(error.toString());
        }
    };

    return (
        <>
            {showFullScreenImage ? (
                <Scrim
                    isDismissable
                    onClose={() => setShowFullScreenImage(false)}
                >
                    <ImageModal>
                        <img src={attachmentFileURL} alt={attachment.title} />
                        <Button onClick={() => setShowFullScreenImage(false)}>
                            <EdsIcon name="close" />
                            Close
                        </Button>
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
                        {isSigned ? null : (
                            <Button
                                color={'danger'}
                                onClick={handleDelete}
                                disabled={
                                    deleteStatus === AsyncStatus.LOADING ||
                                    !deleteAttachment
                                }
                            >
                                <EdsIcon
                                    name="delete_to_trash"
                                    color={
                                        deleteStatus === AsyncStatus.LOADING
                                            ? '#000000'
                                            : '#ffffff'
                                    }
                                    alt="Delete attachment"
                                    size={32}
                                />
                                {deleteStatus === AsyncStatus.LOADING
                                    ? 'Loading...'
                                    : 'Delete'}
                            </Button>
                        )}
                    </ImageModal>
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
