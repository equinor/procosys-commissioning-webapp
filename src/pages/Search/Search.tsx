import React, { useState } from 'react';
import withAccessControl from '../../services/withAccessControl';
import styled from 'styled-components';
import {
    Navbar,
    ProcosysButton,
    SearchTypeButton,
    useSnackbar,
} from '@equinor/procosys-webapp-components';
import Bookmarks from './Bookmarks/Bookmarks';
import SearchArea from './Searching/SearchArea';
import SideMenu from '../../components/navigation/SideMenu';

const SearchPageWrapper = styled.main`
    padding: 0 4%;
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
    const { snackbar, setSnackbarText } = useSnackbar();

    return (
        <>
            <Navbar
                leftContent={<ProcosysButton />}
                rightContent={<SideMenu />}
            />
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
                {searchType ? (
                    <SearchArea
                        searchType={searchType}
                        setSnackbarText={setSnackbarText}
                    />
                ) : (
                    <Bookmarks />
                )}
                {snackbar}
            </SearchPageWrapper>
        </>
    );
};

export default withAccessControl(Search, ['COMMPKG/READ']);
