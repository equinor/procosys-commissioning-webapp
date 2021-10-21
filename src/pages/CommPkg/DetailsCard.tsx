import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { CommPkg } from '../../services/apiTypes';
import EdsIcon from '../../components/icons/EdsIcon';
import { Button, DotProgress } from '@equinor/eds-core-react';
import useBookmarks from '../../utils/useBookmarks';
import { Caption, COLORS } from '../../style/GlobalStyles';
import { PackageStatusIcon } from '../../components/icons/PackageStatusIcon';
import useCommonHooks from '../../utils/useCommonHooks';
import { AsyncStatus } from '../../contexts/CommAppContext';
import DetailsCardShell from './DetailsCardShell';
import axios from 'axios';

const CommDetailsWrapper = styled.div<{ atBookmarksPage?: boolean }>`
    cursor: ${(props): string =>
        props.atBookmarksPage ? 'pointer' : 'initial'};
    display: flex;
    border-top: 1px solid ${COLORS.lightGrey};
    padding: ${(props): string =>
        props.atBookmarksPage ? '16px 0' : '16px 4%'};
    margin: 0;
    text-decoration: none;
    background-color: ${(props): string =>
        props.atBookmarksPage ? COLORS.white : COLORS.fadedBlue};
    &:hover {
        opacity: ${(props): number => (props.atBookmarksPage ? 0.7 : 1)};
    }
`;

const StatusImageWrapper = styled.div`
    display: flex;
    padding-right: 12px;
    align-self: center;
    width: 24px;
`;

const DetailsWrapper = styled.div`
    flex-direction: column;
    flex: 1;
    & > p {
        margin: 0;
    }
`;

const HeaderWrapper = styled.div<{ atBookmarksPage: boolean }>`
    display: flex;
    align-items: baseline;
    & > h6 {
        margin: 0;
        flex: 1.4;
        color: ${(props): string =>
            props.atBookmarksPage ? COLORS.mossGreen : COLORS.black};
    }
    & > p {
        margin: 0;
        flex: 1;
        text-align: right;
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
}: DetailsCardProps): JSX.Element => {
    const { api, params } = useCommonHooks();
    const { isBookmarked, setIsBookmarked } = useBookmarks(commPkgId);
    const [details, setDetails] = useState<CommPkg>();
    const [fetchDetailsStatus, setFetchDetailsStatus] = useState(
        AsyncStatus.LOADING
    );

    useEffect(() => {
        const source = axios.CancelToken.source();
        (async (): Promise<void> => {
            try {
                const detailsFromApi = await api.getCommPackageDetails(
                    source.token,
                    params.plant,
                    commPkgId
                );
                setDetails(detailsFromApi);
                setFetchDetailsStatus(AsyncStatus.SUCCESS);
            } catch (error) {
                if (!axios.isCancel(error)) {
                    setFetchDetailsStatus(AsyncStatus.ERROR);
                }
            }
        })();
        return (): void => {
            source.cancel('Detailscard unmounted');
        };
    }, [params, api, commPkgId]);

    if (fetchDetailsStatus === AsyncStatus.ERROR) {
        return (
            <DetailsCardShell atBookmarksPage={atBookmarksPage}>
                <p>Unable to load comm package details. Try reloading.</p>
            </DetailsCardShell>
        );
    } else if (fetchDetailsStatus === AsyncStatus.SUCCESS && details) {
        return (
            <CommDetailsWrapper
                atBookmarksPage={atBookmarksPage}
                onClick={onClickAction}
            >
                <StatusImageWrapper>
                    <PackageStatusIcon
                        mcStatus={details.mcStatus}
                        commStatus={details.commStatus}
                    />
                </StatusImageWrapper>
                <DetailsWrapper>
                    <HeaderWrapper atBookmarksPage={atBookmarksPage}>
                        {details.commPkgNo}
                    </HeaderWrapper>
                    <Caption>{details.description}</Caption>
                </DetailsWrapper>
                <Button
                    variant="ghost_icon"
                    onClick={(e: React.MouseEvent<HTMLElement>): void => {
                        e.stopPropagation();
                        setIsBookmarked((prev) => !prev);
                    }}
                >
                    <EdsIcon
                        color={COLORS.mossGreen}
                        name={
                            isBookmarked
                                ? 'bookmark_filled'
                                : 'bookmark_outlined'
                        }
                    />
                </Button>
            </CommDetailsWrapper>
        );
    } else {
        return (
            <DetailsCardShell atBookmarksPage={atBookmarksPage}>
                <DotProgress color="primary" />
            </DetailsCardShell>
        );
    }
};

export default DetailsCard;
