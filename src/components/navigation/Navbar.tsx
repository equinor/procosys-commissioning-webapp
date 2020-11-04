import React from 'react';
import styled from 'styled-components';
import { Icon, TopBar, Button } from '@equinor/eds-core-react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { H4 } from '../../style/text';

const NavbarWrapper = styled.nav``;
const Navbar = () => {
    return (
        <NavbarWrapper>
            <TopBar>
                <Link to="/">
                    <Button variant="ghost">
                        <Icon name={'menu'} title="Hamburger menu" />
                    </Button>
                </Link>
                {/* <H4 noMargin>Comm ProCoSys</H4> */}
            </TopBar>
        </NavbarWrapper>
    );
};

export default Navbar;
