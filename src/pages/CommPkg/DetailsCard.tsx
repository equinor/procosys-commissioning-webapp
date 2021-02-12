import React from 'react';
import styled from 'styled-components';
import { CompletionStatus } from '../../services/apiTypes';
import EdsIcon from '../../components/icons/EdsIcon';
import { Button } from '@equinor/eds-core-react';
import useBookmarks from '../Bookmarks/useBookmarks';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { SHADOW } from '../../style/GlobalStyles';
import { PackageStatusIcon } from '../../components/icons/PackageStatusIcon';

const DetailsWrapper = styled.div<{ atBookmarksPage?: Boolean }>`
    display: grid;
    grid-template-columns: repeat(2, 1fr) repeat(2, 0.5fr);
    grid-template-rows: repeat(2);
    grid-column-gap: 8px;
    grid-row-gap: 8px;
    padding: 16px 4%;
    box-shadow: ${SHADOW};
    background-color: #f7f7f7;
    border-radius: 15px;
    margin: ${(props) => (props.atBookmarksPage ? '0 4% 10px 4%' : '10px')};
    /* background-color: #deecee; */
`;

const Description = styled.div`
    grid-area: 1 / 1 / 2 / 5;
    & p {
        margin: 0;
    }
`;
const StatusIconWrapper = styled.div`
    grid-area: 2 / 3 / 2 / 4;
    text-align: center;
    & img {
        height: 20px;
        margin-top: 10px;
        margin-right: -1.2px;
    }
`;
const BookmarkIconWrapper = styled.div`
    grid-area: 2 / 4 / 2 / 4;
    display: flex;
    justify-content: center;
`;
const CommPkgNumberWrapper = styled.div`
    grid-area: 2 / 1 / 3 / 3;
    & p {
        margin: 0;
    }
`;
const MCStatusWrapper = styled.div`
    grid-area: 2 / 2 / 3 / 3;
    & p {
        margin: 0;
    }
`;

export type DetailsCardInfo = {
    description: string;
    pkgNumber: string;
    MCStatus: CompletionStatus;
    commStatus: CompletionStatus;
};

type DetailsCardProps = {
    details: DetailsCardInfo;
    atBookmarksPage?: boolean;
};

const DetailsCard = ({
    details,
    atBookmarksPage = false,
}: DetailsCardProps) => {
    const history = useHistory();
    const { url } = useRouteMatch();
    const { isBookmarked, setIsBookmarked } = useBookmarks(details);
    return (
        <DetailsWrapper
            atBookmarksPage={atBookmarksPage}
            onClick={
                atBookmarksPage
                    ? () => history.push(`${url}/${details.pkgNumber}`)
                    : () => {}
            }
        >
            <Description>
                <p>{details.description}</p>
            </Description>
            <StatusIconWrapper>
                <PackageStatusIcon
                    mcStatus={details.MCStatus}
                    commStatus={details.commStatus}
                />
            </StatusIconWrapper>
            <BookmarkIconWrapper>
                <Button
                    variant="ghost_icon"
                    onClick={(e: React.MouseEvent<HTMLElement>) => {
                        e.stopPropagation();
                        setIsBookmarked(!isBookmarked);
                    }}
                >
                    <EdsIcon
                        color="primary"
                        name={
                            isBookmarked
                                ? 'bookmark_filled'
                                : 'bookmark_outlined'
                        }
                    />
                </Button>
            </BookmarkIconWrapper>
            <CommPkgNumberWrapper>
                <label>PKG number:</label> <p>{details.pkgNumber}</p>
            </CommPkgNumberWrapper>
            <MCStatusWrapper>
                <label>MC Status:</label> <p>{details.MCStatus}</p>
            </MCStatusWrapper>
        </DetailsWrapper>
    );
};

export default DetailsCard;
