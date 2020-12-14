import React from 'react';
import styled from 'styled-components';
import { CompletionStatus } from '../../services/apiTypes';
import EdsIcon from '../EdsIcon';
import PackageStatusIcon from '../PackageStatusIcon';
import { Button } from '@equinor/eds-core-react';
import useBookmarks from '../../services/useBookmarks';
import { useHistory, useRouteMatch } from 'react-router-dom';

const DetailsWrapper = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr) repeat(2, 0.5fr);
    grid-template-rows: repeat(2);
    grid-column-gap: 15px;
    grid-row-gap: 15px;
    padding: 25px;
    background-color: #f2fafa;
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
        margin-top: 8px;
    }
`;
const BookmarkIconWrapper = styled.div`
    grid-area: 2 / 4 / 2 / 4;
    & svg {
        transform: scaleY(1);
    }
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
    onBookmarksPage?: boolean;
};

const DetailsCard = ({ details, onBookmarksPage }: DetailsCardProps) => {
    const history = useHistory();
    const { url } = useRouteMatch();
    const { isBookmarked, setIsBookmarked } = useBookmarks(details);
    return (
        <DetailsWrapper
            onClick={
                onBookmarksPage
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
                    variant="ghost"
                    onClick={(e: React.MouseEvent<HTMLElement>) => {
                        e.stopPropagation();
                        setIsBookmarked(!isBookmarked);
                    }}
                >
                    <EdsIcon
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
