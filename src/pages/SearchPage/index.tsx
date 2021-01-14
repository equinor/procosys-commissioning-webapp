import React, { ChangeEvent } from 'react';
import { Search } from '@equinor/eds-core-react';
import withAccessControl from '../../security/withAccessControl';
import styled from 'styled-components';
import useSearchPageFacade, { SearchStatus } from './useSearchPageFacade';
import SearchResults from '../../components/SearchResults';
import Navbar from '../../components/navigation/Navbar';
import PageHeader from '../../components/PageHeader';

const SearchPageWrapper = styled.main`
    padding: 12px 4%;
    & h4 {
        text-align: center;
        margin-top: 20px;
    }
    & span {
        height: 60px;
        margin-bottom: 10px;
    }
`;

const SearchPage = () => {
    const { hits, searchStatus, query, setQuery } = useSearchPageFacade();
    const searchHeaderToRender = () => {
        if (searchStatus === SearchStatus.SUCCESS) {
            return (
                <h4>
                    Displaying {hits.items.length} out of {hits.maxAvailable}{' '}
                    packages
                </h4>
            );
        }
        if (searchStatus === SearchStatus.LOADING) {
            return <h4>Loading</h4>;
        }
        return <PageHeader title="Search" subtitle="Find a comm. pkg" />;
    };
    return (
        <>
            <Navbar leftContent={{ name: 'back', label: 'Bookmarks' }} />
            <SearchPageWrapper>
                {searchHeaderToRender()}
                <Search
                    placeholder={'For example: "1002-D01"'}
                    value={query}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setQuery(e.target.value)
                    }
                />
                <SearchResults
                    commPackages={hits.items}
                    searchStatus={searchStatus}
                />
            </SearchPageWrapper>
        </>
    );
};

export default withAccessControl(SearchPage, ['COMMPKG/READ']);
