import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Search as SearchField } from '@equinor/eds-core-react';
import withAccessControl from '../../services/withAccessControl';
import styled from 'styled-components';
import useSearchPageFacade, { SearchStatus } from './useSearchPageFacade';
import SearchResults from './SearchResults/SearchResults';
import {
    BackButton,
    Navbar,
    SearchTypeButton,
} from '@equinor/procosys-webapp-components';
import Bookmarks from '../Bookmarks/Bookmarks';

const SearchPageWrapper = styled.main`
    padding: 0 4%;
    & h4 {
        text-align: center;
    }
    & span {
        height: 60px;
        margin-bottom: 10px;
    }
`;

const ButtonsWrapper = styled.div`
    display: flex;
    height: 60px;
    & > button:not(:last-child) {
        margin-right: 10px;
    }
`;

export enum SearchType {
    Comm = 'Comm',
    Tag = 'Tag',
}

const Search = (): JSX.Element => {
    const [searchType, setSearchType] = useState<string | undefined>(undefined);
    const { hits, searchStatus, query, setQuery } = useSearchPageFacade();
    const searchbarRef = useRef<HTMLInputElement>(
        document.createElement('input')
    );

    useEffect(() => {
        searchbarRef.current?.focus();
    }, []);

    const determineComponent = (): JSX.Element => {
        if (searchType === null) {
            return <Bookmarks />;
        }
        return <></>;
        //return <SearchArea searchType={searchType} />;
    };

    return (
        <>
            <Navbar leftContent={<BackButton />} />
            <SearchPageWrapper>
                <p>Search for</p>
                <ButtonsWrapper>
                    <SearchTypeButton
                        searchType={SearchType.Comm}
                        currentSearchType={searchType}
                        setCurrentSearchType={setSearchType}
                    />
                    <SearchTypeButton
                        searchType={SearchType.Tag}
                        currentSearchType={searchType}
                        setCurrentSearchType={setSearchType}
                    />
                </ButtonsWrapper>
                {determineComponent()}
                <SearchField
                    placeholder={'For example: "1002-D01"'}
                    value={query}
                    onChange={(e: ChangeEvent<HTMLInputElement>): void =>
                        setQuery(e.target.value)
                    }
                    ref={searchbarRef}
                />
                <SearchResults
                    commPackages={hits.items}
                    searchStatus={searchStatus}
                />
            </SearchPageWrapper>
        </>
    );
};

export default withAccessControl(Search, ['COMMPKG/READ']);
