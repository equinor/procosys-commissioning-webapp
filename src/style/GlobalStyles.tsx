import styled, { CSSObject } from 'styled-components';
import { tokens } from '@equinor/eds-tokens';

const GlobalStyles = styled.div`
    & h1 {
        ${tokens.typography.heading.h1 as CSSObject}
    }
    & h2 {
        ${tokens.typography.heading.h2 as CSSObject}
    }
    & h3 {
        ${tokens.typography.heading.h3 as CSSObject}
    }
    & h4 {
        ${tokens.typography.heading.h4 as CSSObject}
    }
    & h5 {
        ${tokens.typography.heading.h5 as CSSObject}
    }
    & h6 {
        ${tokens.typography.heading.h6 as CSSObject}
    }
    & p {
        ${tokens.typography.paragraph.body_short as CSSObject}
    }
`;

export const BREAKPOINT = {
    xs: `@media (max-width: 0px)`,
    sm: `@media (max-width: 600px)`,
    md: `@media (max-width: 960px)`,
    lg: `@media (max-width: 1280px)`,
    xl: `@media (max-width: 1920px)`,
};

export default GlobalStyles;
