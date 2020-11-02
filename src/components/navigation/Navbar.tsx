import React from 'react';
import styled from 'styled-components';
import { Icon, TopBar, Button } from '@equinor/eds-core-react';
import { Link, useHistory } from 'react-router-dom';
import { H4 } from '../../style/text';

const NavbarWrapper = styled.nav``;
const Navbar = () => {
    const history = useHistory();
    return (
        <NavbarWrapper>
            <TopBar>
                <Link to="/select-plant">
                    <Button variant="ghost">
                        <Icon name={'menu'} />
                    </Button>
                </Link>
                {/* <H4 noMargin>Comm ProCoSys</H4> */}
            </TopBar>
        </NavbarWrapper>
    );
};

export default Navbar;
