import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from '@equinor/eds-core-react';
import { Link, useHistory, useParams, useRouteMatch } from 'react-router-dom';
import logo from '../../assets/img/procosys-logo.svg';
import EdsIcon from '../EdsIcon';
import { useSpring } from 'react-spring';
import SideMenu from './SideMenu';
import { CommParams } from '../../App';

const NavbarWrapper = styled.nav`
    height: 54px;
    width: 100%;
    max-width: 768px;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    padding: 4px 2% 4px 2%;
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
`;

type NavbarProps = {
    leftContent?: string;
    midContent?: string;
    rightContent?: string;
};

const RightButton = styled(Button)`
    /* margin-right: 4%; */
`;

const removeLastSubdirectory = (url: string) => {
    const matched = url.match(/.*\//);
    if (!matched) return '';
    return matched[0].slice(0, -1);
};

const Navbar = ({
    leftContent = 'hamburger',
    midContent = '',
    rightContent = 'logo',
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

    const determineLeftContent = (option: string) => {
        if (option === 'hamburger') {
            return (
                <Button
                    variant="ghost_icon"
                    onClick={() => setDrawerIsOpen(true)}
                >
                    <EdsIcon name={'menu'} color="#555" title="Menu" />
                </Button>
            );
        }
        return (
            <Button
                variant="ghost_icon"
                onClick={() => history.push(removeLastSubdirectory(url))}
            >
                <EdsIcon name={'arrow_back'} title="Back" />
            </Button>
        );
    };

    const determineRightContent = (option: string) => {
        if (option === 'logo') {
            return (
                <></>
                // <Button variant="ghost" onClick={() => history.push(`/`)}>
                //     <img src={logo} alt="ProCoSys logo" />
                // </Button>
            );
        }
        if (option === 'search') {
            return (
                <Button
                    variant="ghost_icon"
                    onClick={() => history.push(`${url}/search`)}
                >
                    <EdsIcon name={'search'} title="Search" />
                </Button>
            );
        }
        if (option === 'newPunch') {
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
            <NavbarWrapper>
                {determineLeftContent(leftContent)}
                <h4>{midContent}</h4>
                {determineRightContent(rightContent)}
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
