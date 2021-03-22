import { Button, DotProgress, Scrim } from '@equinor/eds-core-react';
import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { AsyncStatus } from '../contexts/CommAppContext';
import { ProcosysApiService } from '../services/procosysApi';
import { COLORS } from '../style/GlobalStyles';
import useCommonHooks from '../utils/useCommonHooks';

export const UploadContainer = styled.div`
    max-height: 80vh;
    width: 300px;
    background-color: ${COLORS.white};
    padding: 16px;
    overflow: scroll;
    & img {
        width: 100%;
        max-height: 200px;
        object-fit: contain;
    }
    & > button,
    button:disabled {
        margin-top: 12px;
        margin-right: 24px;
        float: right;
    }
`;

const ChooseImageContainer = styled.div`
    width: 100%;
    height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px dashed ${COLORS.fadedBlue};
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
    const fileInputRef = useRef(document.createElement('input'));

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
        } catch (error) {
            setPostAttachmentStatus(AsyncStatus.ERROR);
            setSnackbarText(error.toString());
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
                ) : (
                    <ChooseImageContainer>
                        <Button onClick={() => fileInputRef.current.click()}>
                            Choose image...
                        </Button>
                    </ChooseImageContainer>
                )}
                <input
                    type="file"
                    onChange={onFileChange}
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                />

                <Button
                    disabled={
                        !selectedFile ||
                        postAttachmentStatus === AsyncStatus.LOADING
                    }
                    onClick={onFileUpload}
                >
                    {postAttachmentStatus === AsyncStatus.LOADING ? (
                        <DotProgress color="primary" />
                    ) : (
                        'Upload image'
                    )}
                </Button>
                {selectedFile ? (
                    <Button onClick={() => fileInputRef.current.click()}>
                        Choose other
                    </Button>
                ) : null}
            </UploadContainer>
        </Scrim>
    );
};

export default UploadAttachment;
