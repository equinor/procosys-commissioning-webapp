import React, { SetStateAction, useContext, useRef } from 'react';
import styled from 'styled-components';
import { animated, AnimatedValue } from 'react-spring';
import { Icon, Button } from '@equinor/eds-core-react';
import * as auth from '../../services/authService';
import EdsIcon from '../EdsIcon';
import { useHistory, useParams } from 'react-router-dom';
import { CommParams } from '../../App';
import PlantContext from '../../contexts/PlantContext';
import { StorageKey } from '../../services/useBookmarks';

const SideMenuWrapper = styled(animated.aside)`
    width: 297px;
    position: fixed;
    top: 0;
    height: calc(100vh);
    left: 0;
    z-index: 1000;
    background-color: white;
    border-right: 2px solid #f5f5f5;
`;

const TopContent = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
`;

const UserInfo = styled.div`
    padding: 16px;
    display: flex;
    flex-direction: column;
    & p {
        margin: 0;
    }
`;

const UserNameText = styled.p`
    padding-bottom: 15px;
    color: #939393;
`;

const Backdrop = styled(animated.div)`
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    background: white;
    backdrop-filter: blur(1px);
    z-index: 500;
`;

const PlantInfo = styled.div`
    padding: 16px;
    display: flex;
    flex-direction: column;
    background-color: #fafafa;
    & button {
        display: flex;
    }
`;

type SideMenuProps = {
    animation: AnimatedValue<any>;
    backdropAnimation: AnimatedValue<any>;
    setDrawerIsOpen: (drawerIsOpen: boolean) => void;
};

const SideMenu = ({
    animation,
    backdropAnimation,
    setDrawerIsOpen,
}: SideMenuProps) => {
    const history = useHistory();
    const params = useParams<CommParams>();
    const { currentPlant, currentProject } = useContext(PlantContext);
    return (
        <>
            <Backdrop
                style={backdropAnimation}
                onClick={() => setDrawerIsOpen(false)}
            />
            <SideMenuWrapper style={animation}>
                <TopContent>
                    <h2>Welcome</h2>
                    <Button
                        variant="ghost"
                        onClick={() => setDrawerIsOpen(false)}
                    >
                        <EdsIcon name="close" color="black" />
                    </Button>
                </TopContent>
                <UserInfo>
                    <p>Signed in as:</p>
                    <UserNameText>{auth.getUserName()}</UserNameText>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={auth.logout}
                    >
                        Sign out
                    </Button>
                </UserInfo>
                <PlantInfo>
                    <p>Selected plant:</p>
                    <Button
                        onClick={() => {
                            window.localStorage.removeItem(StorageKey.PLANT);
                            window.localStorage.removeItem(StorageKey.PROJECT);
                            setDrawerIsOpen(false);
                            history.push('/');
                        }}
                        color="secondary"
                    >
                        {currentPlant ? currentPlant.title : 'None'}
                        <EdsIcon name="chevron_right" color="white" />
                    </Button>
                    {currentPlant && (
                        <>
                            <p>Selected project:</p>
                            <Button
                                color="secondary"
                                onClick={() => {
                                    window.localStorage.removeItem(
                                        StorageKey.PROJECT
                                    );
                                    setDrawerIsOpen(false);
                                    history.push(`/${params.plant}`);
                                }}
                            >
                                {currentProject
                                    ? currentProject.description
                                    : 'None'}
                                <EdsIcon name="chevron_right" color="white" />
                            </Button>
                        </>
                    )}
                </PlantInfo>
            </SideMenuWrapper>
        </>
    );
};

export default SideMenu;
