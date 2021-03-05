import { Button, DotProgress, Scrim } from '@equinor/eds-core-react';
import React, { useState } from 'react';
import styled from 'styled-components';
import { AsyncStatus } from '../contexts/CommAppContext';
import { ProcosysApiService } from '../services/procosysApi';
import useCommonHooks from '../utils/useCommonHooks';

export const UploadContainer = styled.div`
    max-height: 70vh;
    width: 300px;
    background-color: white;
    padding: 16px;
    overflow: hidden;
    & img {
        width: 100%;
    }
    & button,
    button:disabled {
        margin-top: 12px;
        float: right;
    }
`;

type PostChecklistAttachment = ProcosysApiService['postChecklistAttachment'];
type PostPunchAttachment = ProcosysApiService['postPunchAttachment'];

type UploadAttachmentProps = {
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    postAttachment: PostPunchAttachment | PostChecklistAttachment;
    refreshAttachments: React.Dispatch<React.SetStateAction<boolean>>;
    setSnackbarText: React.Dispatch<React.SetStateAction<string>>;
    parentId: string;
};

const UploadAttachment = ({
    setShowModal,
    postAttachment,
    refreshAttachments,
    setSnackbarText,
    parentId,
}: UploadAttachmentProps) => {
    const { params } = useCommonHooks();
    const [selectedFile, setSelectedFile] = useState<File>();
    const [postAttachmentStatus, setPostAttachmentStatus] = useState(
        AsyncStatus.INACTIVE
    );

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedFile(e.currentTarget.files![0]);
    };

    const onFileUpload = async () => {
        if (!selectedFile) return;
        setPostAttachmentStatus(AsyncStatus.LOADING);
        const formData = new FormData();
        formData.append('myFile', selectedFile, selectedFile.name);
        try {
            await postAttachment({
                plantId: params.plant,
                parentId: parentId,
                data: formData,
                title: '',
            });
            setPostAttachmentStatus(AsyncStatus.SUCCESS);
            setSnackbarText('File successfully added.');
            refreshAttachments((currentValue) => !currentValue);
            setShowModal(false);
        } catch {
            setPostAttachmentStatus(AsyncStatus.ERROR);
            setSnackbarText('Unable to upload attachment. Please try again.');
        }
    };

    return (
        <Scrim isDismissable onClose={() => setShowModal(false)}>
            <UploadContainer>
                {selectedFile ? (
                    <img
                        src={URL.createObjectURL(selectedFile)}
                        alt={selectedFile.name}
                    />
                ) : null}
                <input type="file" onChange={onFileChange} accept="image/*" />
                <Button
                    disabled={
                        !selectedFile ||
                        postAttachmentStatus === AsyncStatus.LOADING
                    }
                    onClick={onFileUpload}
                >
                    {postAttachmentStatus === AsyncStatus.LOADING ? (
                        <DotProgress />
                    ) : (
                        'Upload image'
                    )}
                </Button>
            </UploadContainer>
        </Scrim>
    );
};

export default UploadAttachment;
