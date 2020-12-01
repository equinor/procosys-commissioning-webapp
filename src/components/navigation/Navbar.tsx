import React, { useState } from 'react';
import styled from 'styled-components';
import { TopBar, Button } from '@equinor/eds-core-react';
import { Link } from 'react-router-dom';
import logo from '../../assets/img/procosys-logo.svg';
import EdsIcon from '../EdsIcon';
import { useSpring } from 'react-spring';
import SideMenu from './SideMenu';

const NavbarWrapper = styled.nav`
    & img {
        width: 24px;
        height: 24px;
        transform: scale(1.3);
    }
    & header {
        padding-left: 12px;
        padding-right: 24px;
    }
`;

const Navbar = () => {
    const [drawerIsOpen, setDrawerIsOpen] = useState(false);
    const sideDrawerAnimation = useSpring({
        transform: drawerIsOpen ? `translateX(0px)` : `translateX(-300px)`,
    });
    const backdropAnimation = useSpring({
        opacity: drawerIsOpen ? 0.6 : 0,
        display: drawerIsOpen ? 'block' : 'none',
    });
    return (
        <NavbarWrapper>
            <TopBar>
                <Button variant="ghost" onClick={() => setDrawerIsOpen(true)}>
                    <EdsIcon
                        name={'menu'}
                        color="#555"
                        title="Hamburger menu"
                    />
                </Button>
                <p> </p>
                <Link to="/">
                    <img src={logo} alt="Procosys Logo" />
                </Link>
            </TopBar>
            <SideMenu
                setDrawerIsOpen={setDrawerIsOpen}
                animation={sideDrawerAnimation}
                backdropAnimation={backdropAnimation}
            />
        </NavbarWrapper>
    );
};

export default Navbar;
