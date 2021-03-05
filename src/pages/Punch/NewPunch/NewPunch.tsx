import React, { useEffect, useState } from 'react';
import SkeletonLoader from '../../../components/loading/SkeletonLoader';
import {
    ChecklistDetails,
    PunchCategory,
    PunchOrganization,
    PunchType,
} from '../../../services/apiTypes';
import { AsyncStatus } from '../../../contexts/CommAppContext';
import ErrorPage from '../../../components/error/ErrorPage';
import Navbar from '../../../components/navigation/Navbar';
import ChecklistDetailsCard from '../../Checklist/ChecklistDetailsCard';
import NewPunchForm from './NewPunchForm';
import useFormFields from '../../../utils/useFormFields';
import { NewPunch as NewPunchType } from '../../../services/apiTypes';
import NewPunchSuccessPage from './NewPunchSuccessPage';
import useCommonHooks from '../../../utils/useCommonHooks';
import { PunchWrapper } from '../ClearPunch/ClearPunch';
import { Button, DotProgress, Scrim } from '@equinor/eds-core-react';
import {
    AttachmentImage,
    AttachmentsWrapper,
    ImageModal,
    UploadImageButton,
} from '../../../components/Attachment';
import EdsIcon from '../../../components/icons/EdsIcon';
import { UploadContainer } from '../../../components/UploadAttachment';
import EdsCard from '../../../components/EdsCard';
import { Snackbar } from '@equinor/eds-core-react';

export type PunchFormData = {
    category: string;
    type: string;
    description: string;
    raisedBy: string;
    clearingBy: string;
};

type TempAttachment = { id: string; file: File };

const newPunchInitialValues = {
    category: '',
    type: '',
    description: '',
    raisedBy: '',
    clearingBy: '',
};

const NewPunch = () => {
    const { api, params } = useCommonHooks();
    const { formFields, createChangeHandler } = useFormFields(
        newPunchInitialValues
    );
    const [categories, setCategories] = useState<PunchCategory[]>([]);
    const [types, setTypes] = useState<PunchType[]>([]);
    const [organizations, setOrganizations] = useState<PunchOrganization[]>([]);
    const [fetchNewPunchStatus, setFetchNewPunchStatus] = useState(
        AsyncStatus.LOADING
    );
    const [submitPunchStatus, setSubmitPunchStatus] = useState(
        AsyncStatus.INACTIVE
    );
    const [checklistDetails, setChecklistDetails] = useState<
        ChecklistDetails
    >();
    const [tempAttachments, setTempAttachments] = useState<TempAttachment[]>(
        []
    );
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File>();
    const [postAttachmentStatus, setPostAttachmentStatus] = useState(
        AsyncStatus.INACTIVE
    );
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [snackbarText, setSnackbarText] = useState('');
    const [showFullImageModal, setShowFullImageModal] = useState(false);
    const [attachmentToShow, setAttachmentToShow] = useState<TempAttachment>();

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedFile(e.currentTarget.files![0]);
    };

    const onFileUpload = async () => {
        if (!selectedFile) return;
        setPostAttachmentStatus(AsyncStatus.LOADING);
        const formData = new FormData();
        formData.append('myFile', selectedFile, selectedFile.name);
        try {
            const attachmentId = await api.postTempPunchAttachment({
                plantId: params.plant,
                parentId: '',
                data: formData,
                title: '',
            });
            setTempAttachments((attachments) => [
                ...attachments,
                { id: attachmentId, file: selectedFile },
            ]);
            setPostAttachmentStatus(AsyncStatus.SUCCESS);
            setSnackbarText('File successfully added.');
            setSelectedFile(undefined);
            setShowUploadModal(false);
        } catch {
            setPostAttachmentStatus(AsyncStatus.ERROR);
            setSnackbarText('Unable to upload attachment. Please try again.');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const NewPunchDTO: NewPunchType = {
            CheckListId: parseInt(params.checklistId),
            CategoryId: parseInt(formFields.category),
            Description: formFields.description,
            TypeId: parseInt(formFields.type),
            RaisedByOrganizationId: parseInt(formFields.raisedBy),
            ClearingByOrganizationId: parseInt(formFields.clearingBy),
            TemporaryFileIds: tempAttachments.map(
                (attachment) => attachment.id
            ),
        };
        setSubmitPunchStatus(AsyncStatus.LOADING);
        try {
            await api.postNewPunch(params.plant, NewPunchDTO);
            setSubmitPunchStatus(AsyncStatus.SUCCESS);
        } catch (error) {
            setSubmitPunchStatus(AsyncStatus.ERROR);
        }
    };

    const handleDelete = (attachmentId: string) => {
        setTempAttachments((attachments) =>
            attachments.filter((item) => item.id !== attachmentId)
        );
        setShowFullImageModal(false);
    };

    useEffect(() => {
        if (snackbarText.length < 1) return;
        setShowSnackbar(true);
    }, [snackbarText]);

    useEffect(() => {
        (async () => {
            try {
                const [
                    categoriesFromApi,
                    typesFromApi,
                    organizationsFromApi,
                    checklistFromApi,
                ] = await Promise.all([
                    api.getPunchCategories(params.plant),
                    api.getPunchTypes(params.plant),
                    api.getPunchOrganizations(params.plant),
                    api.getChecklist(params.plant, params.checklistId),
                ]);
                setCategories(categoriesFromApi);
                setTypes(typesFromApi);
                setOrganizations(organizationsFromApi);
                setChecklistDetails(checklistFromApi.checkList);
                setFetchNewPunchStatus(AsyncStatus.SUCCESS);
            } catch (error) {
                setFetchNewPunchStatus(AsyncStatus.ERROR);
            }
        })();
    }, [params.plant, params.checklistId, api]);

    const content = () => {
        if (submitPunchStatus === AsyncStatus.SUCCESS) {
            return <NewPunchSuccessPage />;
        } else if (
            fetchNewPunchStatus === AsyncStatus.SUCCESS &&
            checklistDetails
        ) {
            return (
                <>
                    <ChecklistDetailsCard
                        details={checklistDetails}
                        descriptionLabel={'New punch for:'}
                    />
                    <EdsCard title={'Add attachments'}>
                        <AttachmentsWrapper>
                            <UploadImageButton
                                onClick={() => setShowUploadModal(true)}
                            >
                                <EdsIcon name="camera_add_photo" />
                            </UploadImageButton>
                            {tempAttachments.map((attachment) => (
                                <>
                                    <AttachmentImage
                                        src={URL.createObjectURL(
                                            attachment.file
                                        )}
                                        alt={'Temp attachment ' + attachment.id}
                                        onClick={() => {
                                            setAttachmentToShow(attachment);
                                            setShowFullImageModal(true);
                                        }}
                                    />
                                </>
                            ))}
                        </AttachmentsWrapper>
                    </EdsCard>
                    <NewPunchForm
                        categories={categories}
                        types={types}
                        organizations={organizations}
                        formData={formFields}
                        createChangeHandler={createChangeHandler}
                        buttonText={'Create punch'}
                        handleSubmit={handleSubmit}
                        submitPunchStatus={submitPunchStatus}
                    />
                    {showFullImageModal && attachmentToShow ? (
                        <Scrim
                            isDismissable
                            onClose={() => setShowFullImageModal(false)}
                        >
                            <ImageModal>
                                <img
                                    src={URL.createObjectURL(
                                        attachmentToShow?.file
                                    )}
                                    alt={
                                        'Temp attachment ' + attachmentToShow.id
                                    }
                                />
                                <Button
                                    onClick={() =>
                                        handleDelete(attachmentToShow.id)
                                    }
                                >
                                    Delete
                                </Button>
                                <Button
                                    onClick={() => setShowFullImageModal(false)}
                                >
                                    Close
                                </Button>
                            </ImageModal>
                        </Scrim>
                    ) : null}
                    {showUploadModal ? (
                        <Scrim
                            isDismissable
                            onClose={() => setShowUploadModal(false)}
                        >
                            <UploadContainer>
                                {selectedFile ? (
                                    <img
                                        src={URL.createObjectURL(selectedFile)}
                                        alt={selectedFile.name}
                                    />
                                ) : null}
                                <input
                                    type="file"
                                    onChange={onFileChange}
                                    accept="image/*"
                                />
                                <Button
                                    disabled={
                                        !selectedFile ||
                                        postAttachmentStatus ===
                                            AsyncStatus.LOADING
                                    }
                                    onClick={onFileUpload}
                                >
                                    {postAttachmentStatus ===
                                    AsyncStatus.LOADING ? (
                                        <DotProgress />
                                    ) : (
                                        'Upload image'
                                    )}
                                </Button>
                            </UploadContainer>
                        </Scrim>
                    ) : null}
                </>
            );
        } else if (fetchNewPunchStatus === AsyncStatus.ERROR) {
            return <ErrorPage title="Could not load new punch" />;
        } else {
            return <SkeletonLoader text="Loading new punch" />;
        }
    };

    return (
        <>
            <Navbar
                noBorder
                leftContent={{ name: 'back', label: 'Checklist' }}
            />
            <PunchWrapper>{content()}</PunchWrapper>
            <Snackbar
                autoHideDuration={3000}
                onClose={() => {
                    setShowSnackbar(false);
                    setSnackbarText('');
                }}
                open={showSnackbar}
            >
                {snackbarText}
            </Snackbar>
        </>
    );
};

export default NewPunch;
