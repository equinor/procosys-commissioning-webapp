import React from 'react';
import styled from 'styled-components';
import EdsIcon from '../EdsIcon';
import PackageStatusIcon from '../PackageStatusIcon';

const DetailsWrapper = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr) repeat(2, 0.5fr);
    grid-template-rows: repeat(2);
    grid-column-gap: 15px;
    grid-row-gap: 15px;
    border-bottom: 1px solid lightgrey;
    padding: 15px;
    background-color: #effeff;
`;

const Description = styled.div`
    grid-area: 1 / 1 / 2 / 4;
    & p {
        margin: 0;
    }
`;
const StatusIconWrapper = styled.div`
    grid-area: 1 / 4 / 2 / 5;
    & img {
        height: 20px;
        margin-top: 3px;
    }
`;
const BookmarkIconWrapper = styled.div`
    grid-area: 1 / 5 / 2 / 6;
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
    grid-area: 2 / 3 / 3 / 5;
    & p {
        margin: 0;
    }
`;
const GreyText = styled.span`
    color: #838383;
    margin-right: 5px;
`;

type CommPkgDetailsCardProps = {
    description: string;
    pkgNumber: string;
    MCStatus: string;
    commStatus: string;
};

const DetailsCard = ({
    description,
    pkgNumber,
    MCStatus,
    commStatus,
}: CommPkgDetailsCardProps) => {
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
                <EdsIcon name={'bookmark_outlined'} />
            </BookmarkIconWrapper>
            <CommPkgNumberWrapper>
                <p>
                    <GreyText>PKG:</GreyText> {pkgNumber}
                </p>
            </CommPkgNumberWrapper>
            <MCStatusWrapper>
                <p>
                    <GreyText>MC Status:</GreyText> {MCStatus}
                </p>
            </MCStatusWrapper>
        </DetailsWrapper>
    );
};

export default DetailsCard;
