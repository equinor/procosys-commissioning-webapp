import React from 'react';
import styled from 'styled-components';
import { TopBar, Button } from '@equinor/eds-core-react';
import { Link } from 'react-router-dom';
import logo from '../../assets/img/procosys-logo.svg';
import EdsIcon from '../EdsIcon';

const NavbarWrapper = styled.nav`
    & img {
        width: 24px;
        height: 24px;
        transform: scale(1.3);
    }
`;
const Navbar = () => {
    return (
        <NavbarWrapper>
            <TopBar>
                <img src={logo} />
                <p> </p>
                <Link to="/">
                    <Button variant="ghost">
                        <EdsIcon name={'menu'} title="Hamburger menu" />
                    </Button>
                </Link>
            </TopBar>
        </NavbarWrapper>
    );
};

export default Navbar;
