import { Button, Scrim } from '@equinor/eds-core-react';
import React, { useState } from 'react';
import styled from 'styled-components';
import { Attachment } from '../services/apiTypes';

const UploadContainer = styled.div`
    max-height: 70vh;
    width: 300px;
    background-color: white;
    padding: 16px;
    overflow: hidden;
    & img {
        width: 100%;
    }
    & button {
        margin-top: 12px;
        float: right;
    }
`;

type UploadAttachmentProps = {
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    uploadAttachment: (
        plantId: string,
        checklistId: string,
        data: FormData,
        title: string
    ) => Promise<void>;
    refreshAttachments: React.Dispatch<React.SetStateAction<boolean>>;
};

const UploadAttachment = ({ setShowModal }: UploadAttachmentProps) => {
    const [selectedFile, setSelectedFile] = useState<File>();

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedFile(e.currentTarget.files![0]);
    };

    const onFileUpload = () => {
        if (!selectedFile) return;
        const formData = new FormData();
        formData.append('myFile', selectedFile, selectedFile.name);
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
                <Button disabled={!selectedFile} onClick={onFileUpload}>
                    Upload file
                </Button>
            </UploadContainer>
        </Scrim>
    );
};

export default UploadAttachment;
