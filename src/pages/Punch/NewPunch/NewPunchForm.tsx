import { Button, NativeSelect, TextField } from '@equinor/eds-core-react';
import React from 'react';
import styled from 'styled-components';
import { AsyncStatus } from '../../../contexts/CommAppContext';
import {
    PunchCategory,
    PunchOrganization,
    PunchType,
} from '../../../services/apiTypes';
import { PunchFormData } from '../../Punch/NewPunch/NewPunch';

export const NewPunchFormWrapper = styled.form`
    background-color: white;
    margin-top: 32px;
    padding: 0 4%;
    & > button,
    button:disabled {
        float: right;
        margin-top: 16px;
    }
    & > div {
        margin-top: 16px;
    }
`;

type NewPunchFormProps = {
    types: PunchType[];
    categories: PunchCategory[];
    organizations: PunchOrganization[];
    formData: PunchFormData;
    buttonText: string;
    createChangeHandler: (
        key: 'type' | 'category' | 'description' | 'raisedBy' | 'clearingBy'
    ) => (
        e: React.ChangeEvent<
            HTMLSelectElement | HTMLTextAreaElement | HTMLInputElement
        >
    ) => void;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    submitPunchStatus: AsyncStatus;
};

const NewPunchForm = ({
    categories,
    types,
    organizations,
    createChangeHandler,
    handleSubmit,
    submitPunchStatus,
    formData,
    buttonText,
}: NewPunchFormProps) => {
    return (
        <NewPunchFormWrapper onSubmit={handleSubmit}>
            <NativeSelect
                required
                id="PunchCategorySelect"
                label="Punch category"
                disabled={submitPunchStatus === AsyncStatus.LOADING}
                onChange={createChangeHandler('category')}
            >
                <option hidden disabled selected />
                {categories.map((category) => (
                    <option
                        key={category.id}
                        value={category.id}
                    >{`${category.description}`}</option>
                ))}
            </NativeSelect>
            <NativeSelect
                required
                id="PunchTypeSelect"
                label="Type"
                disabled={submitPunchStatus === AsyncStatus.LOADING}
                onChange={createChangeHandler('type')}
            >
                <option hidden disabled selected />
                {types.map((type) => (
                    <option
                        key={type.id}
                        value={type.id}
                    >{`${type.code}. ${type.description}`}</option>
                ))}
            </NativeSelect>
            <TextField
                required
                maxLength={255}
                value={formData.description}
                onChange={createChangeHandler('description')}
                label="Description"
                multiline
                rows={5}
                id="NewPunchDescription"
                disabled={submitPunchStatus === AsyncStatus.LOADING}
            />
            <NativeSelect
                required
                label="Raised by"
                id="RaisedBySelect"
                disabled={submitPunchStatus === AsyncStatus.LOADING}
                onChange={createChangeHandler('raisedBy')}
            >
                <option hidden disabled selected />
                {organizations.map((organization) => (
                    <option key={organization.id} value={organization.id}>
                        {organization.description}
                    </option>
                ))}
            </NativeSelect>
            <NativeSelect
                required
                id="ClearingBySelect"
                label="Clearing by"
                disabled={submitPunchStatus === AsyncStatus.LOADING}
                onChange={createChangeHandler('clearingBy')}
            >
                <option hidden disabled selected />
                {organizations.map((organization) => (
                    <option key={organization.id} value={organization.id}>
                        {organization.description}
                    </option>
                ))}
            </NativeSelect>
            <Button
                type="submit"
                disabled={submitPunchStatus === AsyncStatus.LOADING}
            >
                {buttonText}
            </Button>
        </NewPunchFormWrapper>
    );
};

export default NewPunchForm;