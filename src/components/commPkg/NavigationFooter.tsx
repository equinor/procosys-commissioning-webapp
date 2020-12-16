import React from 'react';
import styled from 'styled-components';
import EdsIcon from '../EdsIcon';
import { Button } from '@equinor/eds-core-react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { COLORS, SHADOW } from '../../style/GlobalStyles';

export const CommPkgFooterWrapper = styled.div`
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    background-image: linear-gradient(
        to bottom,
        rgba(255, 255, 255, 0),
        rgba(255, 255, 255, 1) 25%,
        rgba(255, 255, 255, 1)
    );
    display: flex;
    height: 100px;
    padding-bottom: 5px;
    justify-content: space-evenly;
    align-items: flex-end;
`;

export const FooterButton = styled.button<{ active: boolean }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    border: none;
    flex: 1;
    height: 75px;
    max-width: 100px;
    margin: 0 15px 0 15px;
    padding: 20px 0 0 0;
    transform: ${(props) => (props.active ? 'scale(1.1)' : '1')};
    opacity: ${(props) => (props.active ? '1' : '0.8')};
    background-color: ${(props) => (props.active ? `white` : 'white')};
    position: relative;
    & p {
        margin: 0;
        font-weight: ${(props) => (props.active ? 'initial' : 'initial')};
    }
    &:focus,
    &:hover,
    &:active {
        background-color: initial;
        outline: none;
    }
`;

const ItemCount = styled.span`
    position: absolute;
    top: 5px;
    right: 15px;
    background-color: #f0f0f0;
    border-radius: 15px;
    min-width: 16px;
    padding: 4px 5px 2px 5px;
    & p {
        text-align: center;
        font-size: 12px;
        color: black;
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
                onClick={() => history.push(`${url}/scope`)}
            >
                {numberOfChecklists > 0 && (
                    <ItemCount>
                        <p>{numberOfChecklists}</p>
                    </ItemCount>
                )}
                <EdsIcon name="list" />
                <ButtonText>
                    <p>Scope</p>
                </ButtonText>
            </FooterButton>
            <FooterButton
                active={history.location.pathname.includes('/tasks')}
                onClick={() => history.push(`${url}/tasks`)}
            >
                {numberOfTasks > 0 && (
                    <ItemCount>
                        <p>{numberOfTasks}</p>
                    </ItemCount>
                )}
                <EdsIcon name="paste" />
                <ButtonText>
                    <p>Tasks</p>
                </ButtonText>
            </FooterButton>
            <FooterButton
                active={history.location.pathname.includes('/punch-list')}
                onClick={() => history.push(`${url}/punch-list`)}
            >
                {numberOfPunches > 0 && (
                    <ItemCount>
                        <p>{numberOfPunches}</p>
                    </ItemCount>
                )}
                <EdsIcon name="warning_filled" />
                <ButtonText>
                    <p>Punches</p>
                </ButtonText>
            </FooterButton>
        </CommPkgFooterWrapper>
    );
};

export default NavigationFooter;
