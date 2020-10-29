import React from 'react';
import styled from 'styled-components';
import { Icon } from '@equinor/eds-core-react';
import { arrow_back } from '@equinor/eds-icons';
import { TopBar, Button, Menu, Typography } from '@equinor/eds-core-react';
import { Link, useHistory } from 'react-router-dom';

const ClickableIcon = styled(Icon)`
    cursor: pointer;
`;

const NavbarWrapper = styled.nav``;
Icon.add({ arrow_back });
const Navbar = () => {
    const history = useHistory();
    return (
        <NavbarWrapper>
            <TopBar>
                <ClickableIcon
                    name="arrow_back"
                    onClick={() => history.goBack()}
                />
                <Link to="/">
                    <Typography variant="h3">Comm Procosys</Typography>
                </Link>
                <Link to="/select-plant">Select plant</Link>
            </TopBar>
        </NavbarWrapper>
    );
};

export default Navbar;
