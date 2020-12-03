import React from 'react';
import styled from 'styled-components';
import EdsIcon from '../EdsIcon';
import { Button } from '@equinor/eds-core-react';
import { useHistory, useParams, useRouteMatch } from 'react-router-dom';
import { CommParams } from '../../App';

const CommPkgFooterWrapper = styled.div`
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    border-top: 1px solid lightgrey;
    display: flex;
    & button {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 33%;
        height: 70px;
        & p {
            margin: 0;
        }
    }
`;

const ItemCount = styled.span`
    position: absolute;
    top: -20px;
    right: -14px;
    background-color: red;
    border-radius: 15px;
    min-width: 16px;
    padding: 5px 5px 3px 5px;
    & p {
        text-align: center;
        font-size: 12px;
        color: white;
    }
`;

const ButtonText = styled.div`
    position: relative;
`;

type CommPkgFooterProps = {
    numberOfChecklists: number;
    numberOfTasks: number;
    numberOfPunches: number;
};

const CommPkgFooter = ({
    numberOfChecklists,
    numberOfTasks,
    numberOfPunches,
}: CommPkgFooterProps) => {
    const history = useHistory();
    const { plant, project, commPkg } = useParams<CommParams>();
    const { location } = useHistory();
    return (
        <CommPkgFooterWrapper>
            <Button
                variant="ghost"
                onClick={() => history.push(`${location.pathname}/scope`)}
            >
                <EdsIcon name="list" />
                <ButtonText>
                    <p>Scope</p>
                    {numberOfChecklists > 0 && (
                        <ItemCount>
                            <p>{numberOfChecklists}</p>
                        </ItemCount>
                    )}
                </ButtonText>
            </Button>
            <Button
                variant="ghost"
                onClick={() => history.push(`${location.pathname}/tasks`)}
            >
                <EdsIcon name="paste" />
                <ButtonText>
                    <p>Tasks</p>
                    {numberOfTasks > 0 && (
                        <ItemCount>
                            <p>{numberOfTasks}</p>
                        </ItemCount>
                    )}
                </ButtonText>
            </Button>
            <Button variant="ghost" onClick={() => history.push(`/punch-list`)}>
                <EdsIcon name="view_list" />
                <ButtonText>
                    <p>Punches</p>
                    {numberOfPunches > 0 && (
                        <ItemCount>
                            <p>{numberOfPunches}</p>
                        </ItemCount>
                    )}
                </ButtonText>
            </Button>
        </CommPkgFooterWrapper>
    );
};

export default CommPkgFooter;
