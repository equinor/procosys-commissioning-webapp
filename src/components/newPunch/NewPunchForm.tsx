import {
    Button,
    NativeSelect,
    SingleSelect,
    TextField,
} from '@equinor/eds-core-react';
import React, { useState } from 'react';
import styled from 'styled-components';
import { isTemplateExpression } from 'typescript';
import { AsyncStatus } from '../../contexts/UserContext';
import {
    NewPunch,
    PunchCategory,
    PunchOrganization,
    PunchType,
} from '../../services/apiTypes';
import * as API from '../../services/api';
import { CommParams } from '../../App';
import { useParams } from 'react-router-dom';

const NewPunchFormWrapper = styled.form`
    & > button {
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
};

const NewPunchForm = ({
    categories,
    types,
    organizations,
}: NewPunchFormProps) => {
    const { plant, checklistId } = useParams<CommParams>();
    const [submitPunchStatus, setSubmitPunchStatus] = useState(
        AsyncStatus.INACTIVE
    );
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('');
    const [raisedBy, setRaisedBy] = useState('');
    const [clearingBy, setClearingBy] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const NewPunchDTO: NewPunch = {
            CheckListId: parseInt(checklistId),
            CategoryId: parseInt(category),
            Description: description,
            TypeId: parseInt(type),
            RaisedByOrganizationId: parseInt(raisedBy),
            ClearingByOrganizationId: parseInt(clearingBy),
        };
        setSubmitPunchStatus(AsyncStatus.LOADING);
        try {
            await API.postNewPunch(plant, NewPunchDTO);
            setSubmitPunchStatus(AsyncStatus.SUCCESS);
        } catch (error) {
            setSubmitPunchStatus(AsyncStatus.ERROR);
        }
    };

    return (
        <NewPunchFormWrapper onSubmit={handleSubmit}>
            <NativeSelect
                required
                id="PunchCategorySelect"
                label="Punch category"
                disabled={submitPunchStatus === AsyncStatus.LOADING}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setCategory(e.target.value)
                }
            >
                <option hidden disabled selected />
                {categories.map((category) => (
                    <option
                        value={category.id}
                    >{`${category.description}`}</option>
                ))}
            </NativeSelect>
            <NativeSelect
                required
                id="PunchTypeSelect"
                label="Type"
                disabled={submitPunchStatus === AsyncStatus.LOADING}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setType(e.target.value)
                }
            >
                <option hidden disabled selected />
                {types.map((type) => (
                    <option
                        value={type.id}
                    >{`${type.code}. ${type.description}`}</option>
                ))}
            </NativeSelect>
            <TextField
                required
                maxLength={255}
                value={description}
                onChange={(
                    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
                ) => setDescription(e.target.value)}
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
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setRaisedBy(e.target.value)
                }
            >
                <option hidden disabled selected />
                {organizations.map((organization) => (
                    <option value={organization.id}>
                        {organization.description}
                    </option>
                ))}
            </NativeSelect>
            <NativeSelect
                required
                id="ClearingBySelect"
                label="Clearing by"
                disabled={submitPunchStatus === AsyncStatus.LOADING}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setClearingBy(e.target.value)
                }
            >
                <option hidden disabled selected />
                {organizations.map((organization) => (
                    <option value={organization.id}>
                        {organization.description}
                    </option>
                ))}
            </NativeSelect>
            <Button
                type="submit"
                disabled={submitPunchStatus === AsyncStatus.LOADING}
            >
                Create punch
            </Button>
        </NewPunchFormWrapper>
    );
};

export default NewPunchForm;
