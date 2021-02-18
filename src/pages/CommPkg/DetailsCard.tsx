import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { CommPkg } from '../../services/apiTypes';
import EdsIcon from '../../components/icons/EdsIcon';
import { Button, Card, DotProgress } from '@equinor/eds-core-react';
import useBookmarks from '../Bookmarks/useBookmarks';
import { SHADOW } from '../../style/GlobalStyles';
import { PackageStatusIcon } from '../../components/icons/PackageStatusIcon';
import useCommonHooks from '../../utils/useCommonHooks';
import { AsyncStatus } from '../../contexts/CommAppContext';
import DetailsCardShell from './DetailsCardShell';

const DetailsWrapper = styled.div<{ atBookmarksPage?: Boolean }>`
    display: grid;
    grid-template-columns: repeat(2, 1fr) repeat(2, 0.5fr);
    grid-template-rows: repeat(2);
    grid-column-gap: 8px;
    grid-row-gap: 8px;
    padding: 16px 4%;
    background-color: ${(props) =>
        props.atBookmarksPage ? 'white' : '#deecee'};
    box-shadow: ${(props) => (props.atBookmarksPage ? SHADOW : 'none')};
    border-radius: 5px;
    margin: ${(props) => (props.atBookmarksPage ? '0 4% 10px 4%' : '0')};
`;

const Description = styled.div`
    grid-area: 1 / 1 / 2 / 5;
    & h4 {
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

type DetailsCardProps = {
    commPkgId: string;
    atBookmarksPage?: boolean;
    onClickAction?: () => void;
};

const DetailsCard = ({
    commPkgId,
    atBookmarksPage = false,
    onClickAction,
}: DetailsCardProps) => {
    const { api, params } = useCommonHooks();
    const { isBookmarked, setIsBookmarked } = useBookmarks(commPkgId);
    const [details, setDetails] = useState<CommPkg>();
    const [fetchDetailsStatus, setFetchDetailsStatus] = useState(
        AsyncStatus.LOADING
    );

    useEffect(() => {
        (async () => {
            try {
                const detailsFromApi = await api.getCommPackageDetails(
                    params.plant,
                    commPkgId
                );
                setDetails(detailsFromApi);
                setFetchDetailsStatus(AsyncStatus.SUCCESS);
            } catch {
                setFetchDetailsStatus(AsyncStatus.ERROR);
            }
        })();
    }, [params, api, commPkgId]);

    if (fetchDetailsStatus === AsyncStatus.ERROR) {
        return (
            <DetailsCardShell atBookmarksPage={atBookmarksPage}>
                <p>Unable to load comm package details. Try reloading.</p>
            </DetailsCardShell>
        );
    }
    if (fetchDetailsStatus === AsyncStatus.SUCCESS && details) {
        return (
            <DetailsWrapper
                atBookmarksPage={atBookmarksPage}
                onClick={onClickAction}
            >
                <Description>
                    <h4>{details.description}</h4>
                </Description>
                <StatusIconWrapper>
                    <PackageStatusIcon
                        mcStatus={details.mcStatus}
                        commStatus={details.commStatus}
                    />
                </StatusIconWrapper>
                <BookmarkIconWrapper>
                    <Button
                        variant="ghost_icon"
                        onClick={(e: React.MouseEvent<HTMLElement>) => {
                            e.stopPropagation();
                            setIsBookmarked((prev) => !prev);
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
                    <label>PKG number:</label> <p>{details.commPkgNo}</p>
                </CommPkgNumberWrapper>
                <MCStatusWrapper>
                    <label>MC Status:</label> <p>{details.mcStatus}</p>
                </MCStatusWrapper>
            </DetailsWrapper>
        );
    }

    return (
        <DetailsCardShell atBookmarksPage={atBookmarksPage}>
            <>
                <DotProgress variant="green" />
            </>
        </DetailsCardShell>
    );
};

export default DetailsCard;
