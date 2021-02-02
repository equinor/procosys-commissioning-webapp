import {
    Button,
    NativeSelect,
    SingleSelect,
    TextField,
} from '@equinor/eds-core-react';
import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { isTemplateExpression } from 'typescript';
import CommAppContext, { AsyncStatus } from '../../contexts/CommAppContext';
import {
    NewPunch,
    PunchCategory,
    PunchOrganization,
    PunchType,
} from '../../services/apiTypes';
import { CommParams } from '../../App';
import { useHistory, useParams, useRouteMatch } from 'react-router-dom';
import EdsIcon from '../../components/icons/EdsIcon';
import { removeLastSubdirectory } from '../../utils/general';

const ButtonGroup = styled.div`
    display: flex;
    & button:first-of-type {
        margin-right: 16px;
    }
`;

const NewPunchSuccess = styled.div`
    padding: 0 4%;
    margin-top: 48px;
    height: calc(100vh - 54px);
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const NewPunchFormWrapper = styled.form`
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
};

const NewPunchForm = ({
    categories,
    types,
    organizations,
}: NewPunchFormProps) => {
    const { api } = useContext(CommAppContext);
    const { plant, checklistId, commPkg, project } = useParams<CommParams>();
    const { url } = useRouteMatch();
    const history = useHistory();
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
            await api.postNewPunch(plant, NewPunchDTO);
            setSubmitPunchStatus(AsyncStatus.SUCCESS);
        } catch (error) {
            setSubmitPunchStatus(AsyncStatus.ERROR);
        }
    };

    if (submitPunchStatus === AsyncStatus.SUCCESS) {
        return (
            <NewPunchSuccess>
                <EdsIcon name="check" size={40} />
                <h4>Successfully added new punch</h4>
                <ButtonGroup>
                    <Button
                        onClick={() =>
                            history.push(removeLastSubdirectory(url))
                        }
                    >
                        Back to checklist
                    </Button>
                    <Button
                        onClick={() =>
                            history.push(
                                `/${plant}/${project}/${commPkg}/punch-list`
                            )
                        }
                    >
                        Go to punch list
                    </Button>
                </ButtonGroup>
            </NewPunchSuccess>
        );
    }

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
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setType(e.target.value)
                }
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
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setClearingBy(e.target.value)
                }
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
                Create punch
            </Button>
        </NewPunchFormWrapper>
    );
};

export default NewPunchForm;
