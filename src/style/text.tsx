import { tokens } from '@equinor/eds-tokens';
import styled from 'styled-components';

const {
    h1: h1Tokens,
    h2: h2Tokens,
    h3: h3Tokens,
    h4: h4Tokens,
    h5: h5Tokens,
    h6: h6Tokens,
} = tokens.typography.heading;

type HeaderProps = {
    noMargin?: boolean;
    centered?: boolean;
};

export const H1t = styled.h1(h1Tokens);
export const H2t = styled.h2(h2Tokens);
export const H3t = styled.h3(h3Tokens);
export const H4t = styled.h4(h4Tokens);
export const H5t = styled.h5(h5Tokens);
export const H6t = styled.h6(h6Tokens);

export const H4 = styled(H4t)<HeaderProps>`
    margin: ${(props) =>
        (props.noMargin && '0') || (props.centered && '0 auto') || ''};
`;

export const H3 = styled(H3t)<HeaderProps>`
    margin: ${(props) =>
        (props.noMargin && '0') || (props.centered && '0 auto') || ''};
`;
