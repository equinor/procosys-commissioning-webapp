import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { CommParams } from '../../App';
import { SearchStatus } from '../../pages/SearchPage/useSearchPageFacade';
import { CommPkgPreview } from '../../services/apiTypes';
import SkeletonLoadingPage from '../loading/SkeletonLoader';
import PackageStatusIcon from '../PackageStatusIcon';

const SearchResult = styled.article`
    cursor: pointer;
    width: 100%;
    display: flex;
    align-items: center;
    border-top: 1px solid #e5e5e5;
    & p {
        flex: auto;
        width: 200px;
    }
    & h6 {
        margin: 12px;
        white-space: nowrap;
        width: 120px;
    }
    &:hover {
        opacity: 0.7;
    }
`;

const SearchResultsWrapper = styled.div`
    width: 100%;
`;

const StatusImageWrapper = styled.div`
    display: flex;
    padding: 12px;
    & img {
        height: 20px;
        margin-left: -2px;
    }
`;

type SearchResultsProps = {
    searchStatus: SearchStatus;
    commPackages: CommPkgPreview[];
};

const SearchResults = ({ searchStatus, commPackages }: SearchResultsProps) => {
    const history = useHistory();
    const { project } = useParams<CommParams>();
    if (searchStatus === SearchStatus.LOADING) {
        return <SkeletonLoadingPage fullWidth />;
    }
    if (searchStatus === SearchStatus.SUCCESS && commPackages.length > 0) {
        return (
            <SearchResultsWrapper>
                {commPackages.map((commPackage) => {
                    return (
                        <SearchResult
                            onClick={() =>
                                history.push(`${commPackage.commPkgNo}`)
                            }
                            key={commPackage.id}
                        >
                            <StatusImageWrapper>
                                <PackageStatusIcon
                                    mcStatus={commPackage.mcStatus}
                                    commStatus={commPackage.commStatus}
                                />
                            </StatusImageWrapper>

                            <h6>{commPackage.commPkgNo}</h6>
                            <p>{commPackage.description}</p>
                        </SearchResult>
                    );
                })}
            </SearchResultsWrapper>
        );
    }
    if (searchStatus === SearchStatus.INACTIVE) {
        return (
            <SearchResultsWrapper>
                <p>
                    <i>
                        Start typing your Commissioning Package number in the
                        field above. <br />
                    </i>
                </p>
            </SearchResultsWrapper>
        );
    }

    if (searchStatus === SearchStatus.ERROR) {
        return (
            <SearchResultsWrapper>
                <p>
                    <i>
                        An error occurred, please refresh this page and try
                        again.
                    </i>
                </p>
            </SearchResultsWrapper>
        );
    }

    return (
        <SearchResultsWrapper>
            <p>
                <i>No packages found for this search.</i>
            </p>
        </SearchResultsWrapper>
    );
};

export default SearchResults;
