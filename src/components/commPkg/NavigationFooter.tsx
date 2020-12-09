import React from 'react';
import styled from 'styled-components';
import EdsIcon from '../EdsIcon';
import { Button } from '@equinor/eds-core-react';
import { useHistory, useRouteMatch } from 'react-router-dom';

const CommPkgFooterWrapper = styled.div`
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    background-color: white;
    border-top: 2px solid #f5f5f5;
    display: flex;
`;

const FooterButton = styled(Button)<{ active: boolean }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    height: 70px;
    background-color: ${(props) =>
        props.active ? 'rgba(222, 237, 238, 1)' : 'initial'};
    & p {
        margin: 0;
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

const NavigationFooter = ({
    numberOfChecklists,
    numberOfTasks,
    numberOfPunches,
}: CommPkgFooterProps) => {
    const history = useHistory();
    const { url } = useRouteMatch();
    return (
        <CommPkgFooterWrapper>
            <FooterButton
                data-testid="scope-button"
                active={history.location.pathname.includes('/scope')}
                variant="ghost"
                onClick={() => history.push(`${url}/scope`)}
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
            </FooterButton>
            <FooterButton
                active={history.location.pathname.includes('/tasks')}
                variant="ghost"
                onClick={() => history.push(`${url}/tasks`)}
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
            </FooterButton>
            <FooterButton
                active={history.location.pathname.includes('/punch-list')}
                variant="ghost"
                onClick={() => history.push(`${url}/punch-list`)}
            >
                <EdsIcon name="view_list" />
                <ButtonText>
                    <p>Punches</p>
                    {numberOfPunches > 0 && (
                        <ItemCount>
                            <p>{numberOfPunches}</p>
                        </ItemCount>
                    )}
                </ButtonText>
            </FooterButton>
        </CommPkgFooterWrapper>
    );
};

export default NavigationFooter;
