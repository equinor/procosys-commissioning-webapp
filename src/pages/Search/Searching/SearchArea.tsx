import React, { ChangeEvent, useEffect, useRef } from 'react';
import { Search as SearchField } from '@equinor/eds-core-react';
import useSearchPageFacade from '../useSearchPageFacade';
import SearchResults from './SearchResults/SearchResults';
import { SearchType } from '../Search';
import styled from 'styled-components';
import { TagPhotoRecognition } from '@equinor/procosys-webapp-components';
import useCommonHooks from '../../../utils/useCommonHooks';

const TallSearchField = styled(SearchField)`
    margin-top: 18px;
`;

const SearchAreaWrapper = styled.div`
    position: relative;
`;

type SearchAreaProps = {
    searchType: string;
};

const SearchArea = ({ searchType }: SearchAreaProps): JSX.Element => {
    const searchbarRef = useRef<HTMLInputElement>(
        document.createElement('input')
    );
    const { appConfig } = useCommonHooks();
    const { hits, searchStatus, query, setQuery } =
        useSearchPageFacade(searchType);

    useEffect(() => {
        searchbarRef.current?.focus();
    }, []);

    const getPlaceholderText = (): string => {
        if (searchType === SearchType.Comm) {
            return '1002-D01';
        } else {
            return '#M-2601-P013';
        }
    };

    return (
        <SearchAreaWrapper>
            {searchType === SearchType.Tag ? (
                <TagPhotoRecognition
                    setQuery={setQuery}
                    tagOcrEndpoint={appConfig.ocrFunctionEndpoint}
                />
            ) : null}
            <TallSearchField
                placeholder={`For example: "${getPlaceholderText()}"`}
                value={query}
                onChange={(e: ChangeEvent<HTMLInputElement>): void =>
                    setQuery(e.target.value)
                }
                ref={searchbarRef}
                aria-label="Searchbar"
            />
            <SearchResults
                searchStatus={searchStatus}
                searchResults={hits}
                searchType={searchType}
            />
        </SearchAreaWrapper>
    );
};

export default SearchArea;
