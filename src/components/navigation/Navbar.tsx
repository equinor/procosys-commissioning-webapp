import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from '@equinor/eds-core-react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import EdsIcon from '../icons/EdsIcon';
import { useSpring } from 'react-spring';
import SideMenu from './SideMenu';
import { removeSubdirectories } from '../../utils/general';

const NavbarWrapper = styled.nav<{ noBorder: boolean }>`
    height: 54px;
    width: 100%;
    background-color: #fff;
    border-bottom: ${(props) =>
        props.noBorder ? 'none' : '1px solid #deecee'};
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    padding: 4px 4% 4px 4%;
    position: fixed;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
    & img {
        width: 24px;
        height: 24px;
        transform: scale(1.3);
    }
    & h4 {
        margin: 0;
    }
    & button {
        padding: 0;
    }
`;

type LeftNavbarContent = {
    name: 'hamburger' | 'back';
    label?: string;
    url?: string;
};
type RightNavbarContent = {
    name: 'logo' | 'newPunch' | 'search';
    label?: string;
    url?: string;
};

const RightButton = styled(Button)`
    /* margin-right: 4%; */
`;

type NavbarProps = {
    leftContent?: LeftNavbarContent;
    midContent?: string;
    rightContent?: RightNavbarContent;
    noBorder?: boolean;
};

const Navbar = ({
    leftContent,
    midContent = '',
    rightContent,
    noBorder = false,
}: NavbarProps) => {
    const [drawerIsOpen, setDrawerIsOpen] = useState(false);
    const history = useHistory();
    const { url } = useRouteMatch();
    const sideDrawerAnimation = useSpring({
        transform: drawerIsOpen ? `translateX(0px)` : `translateX(-300px)`,
    });
    const backdropAnimation = useSpring({
        opacity: drawerIsOpen ? 0.6 : 0,
        display: drawerIsOpen ? 'block' : 'none',
    });

    const determineLeftContent = () => {
        if (leftContent?.name === 'hamburger') {
            return (
                <Button variant="ghost" onClick={() => setDrawerIsOpen(true)}>
                    <EdsIcon name={'menu'} color="#555" title="Menu" />
                    Menu
                </Button>
            );
        }
        if (leftContent?.name === 'back') {
            return (
                <Button
                    variant="ghost"
                    onClick={() => {
                        if (leftContent.url) {
                            history.push(leftContent.url);
                        } else {
                            history.push(removeSubdirectories(url, 1));
                        }
                    }}
                >
                    <EdsIcon name={'arrow_back'} title="Back" />
                    {leftContent.label}
                </Button>
            );
        }
        return <></>;
    };

    const determineRightContent = () => {
        if (rightContent?.name === 'logo') {
            return (
                <></>
                // <Button variant="ghost" onClick={() => history.push(`/`)}>
                //     <img src={logo} alt="ProCoSys logo" />
                // </Button>
            );
        }
        if (rightContent?.name === 'search') {
            return (
                <Button
                    variant="ghost_icon"
                    onClick={() => history.push(`${url}/search`)}
                >
                    <EdsIcon name={'search'} title="Search" />
                </Button>
            );
        }
        if (rightContent?.name === 'newPunch') {
            return (
                <RightButton
                    variant="ghost"
                    onClick={() => history.push(`${url}/new-punch`)}
                >
                    New punch
                </RightButton>
            );
        }
        return <></>;
    };

    return (
        <>
            <NavbarWrapper noBorder={noBorder}>
                {determineLeftContent()}
                <h4>{midContent}</h4>
                {determineRightContent()}
            </NavbarWrapper>
            <SideMenu
                setDrawerIsOpen={setDrawerIsOpen}
                animation={sideDrawerAnimation}
                backdropAnimation={backdropAnimation}
            />
        </>
    );
};

export default Navbar;
