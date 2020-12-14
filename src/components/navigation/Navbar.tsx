import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from '@equinor/eds-core-react';
import { Link, useHistory, useRouteMatch } from 'react-router-dom';
import logo from '../../assets/img/procosys-logo.svg';
import EdsIcon from '../EdsIcon';
import { useSpring } from 'react-spring';
import SideMenu from './SideMenu';

const NavbarWrapper = styled.nav`
    height: 54px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid #fafafa;
    padding: 4px 18px 4px 6px;
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
                <Button variant="ghost" onClick={() => setDrawerIsOpen(true)}>
                    <EdsIcon
                        name={'menu'}
                        color="#555"
                        title="Hamburger menu"
                    />
                </Button>
            );
        }
        return (
            <Button variant="ghost" onClick={() => history.goBack()}>
                <EdsIcon name={'arrow_back'} title="Go back icon" />
            </Button>
        );
    };

    const determineRightContent = (option: string) => {
        if (option === 'logo') {
            return (
                <Link to="/">
                    <img src={logo} alt="Procosys Logo" />
                </Link>
            );
        }
        if (option === 'search') {
            return (
                <Button
                    variant="ghost"
                    onClick={() => history.push(`${url}/search`)}
                >
                    <EdsIcon name={'search'} title="Search icon" />
                </Button>
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
