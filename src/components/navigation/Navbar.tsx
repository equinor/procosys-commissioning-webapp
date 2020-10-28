import React from 'react';
import styled from 'styled-components';
import { Icon } from '@equinor/eds-core-react';
import { arrow_back } from '@equinor/eds-icons';
import { TopBar, Button, Menu } from '@equinor/eds-core-react';
import { Link } from 'react-router-dom';

const NavbarWrapper = styled.nav``;
Icon.add({ arrow_back });
const Navbar = () => {
    return (
        <NavbarWrapper>
            <TopBar>
                <h2>Comm Procosys</h2>
                <Link to="/select-plant">Select plant</Link>
                <Link to="/select-project">Select project</Link>
            </TopBar>
        </NavbarWrapper>
    );
};

export default Navbar;
