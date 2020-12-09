import React from 'react';
import styled from 'styled-components';
import { CompletionStatus } from '../../services/apiTypes';
import EdsIcon from '../EdsIcon';
import PackageStatusIcon from '../PackageStatusIcon';
import { Button } from '@equinor/eds-core-react';
import useBookmarks from '../../services/useBookmarks';

const DetailsWrapper = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr) repeat(2, 0.5fr);
    grid-template-rows: repeat(2);
    grid-column-gap: 15px;
    grid-row-gap: 15px;
    border-bottom: 1px solid #f5f5f5;
    padding: 15px;
    background-color: #effeff;
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

type CommPkgDetailsCardProps = {
    description: string;
    pkgNumber: string;
    MCStatus: CompletionStatus;
    commStatus: CompletionStatus;
};

const DetailsCard = ({
    description,
    pkgNumber,
    MCStatus,
    commStatus,
}: CommPkgDetailsCardProps) => {
    const { isBookmarked, toggleBookmark } = useBookmarks(pkgNumber);
    return (
        <DetailsWrapper>
            <Description>
                <p>{description}</p>
            </Description>
            <StatusIconWrapper>
                <PackageStatusIcon
                    mcStatus={MCStatus}
                    commStatus={commStatus}
                />
            </StatusIconWrapper>
            <BookmarkIconWrapper>
                <Button variant="ghost" onClick={toggleBookmark}>
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
                <label>PKG number:</label> <p>{pkgNumber}</p>
            </CommPkgNumberWrapper>
            <MCStatusWrapper>
                <label>MC Status:</label> <p>{MCStatus}</p>
            </MCStatusWrapper>
        </DetailsWrapper>
    );
};

export default DetailsCard;
