import React, { useContext } from 'react';
import styled from 'styled-components';
import DetailsCard from '../components/commPkg/DetailsCard';
import PageHeader from '../components/PageHeader';
import { getCurrentBookmarks } from '../services/useBookmarks';
import { Button } from '@equinor/eds-core-react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import PlantContext from '../contexts/PlantContext';
import Navbar from '../components/navigation/Navbar';

const BookmarksWrapper = styled.main`
    display: flex;
    flex-direction: column;
    & h3 {
        text-align: center;
    }
    & button {
        border-radius: 0;
    }
`;

const Bookmarks = () => {
    const { url } = useRouteMatch();
    const history = useHistory();
    const { currentProject, currentPlant } = useContext(PlantContext);
    const bookmarks = getCurrentBookmarks(currentProject!.id.toString());
    const bookmarksToDisplay = bookmarks.map((bookmark) => (
        <DetailsCard
            key={bookmark.pkgNumber}
            details={{
                description: bookmark.description,
                commStatus: bookmark.commStatus,
                MCStatus: bookmark.MCStatus,
                pkgNumber: bookmark.pkgNumber,
            }}
            onBookmarksPage={true}
        />
    ));

    let content = (
        <>
            <PageHeader title={'Bookmarks'} subtitle={currentPlant?.title} />
            {bookmarksToDisplay}
        </>
    );

    if (bookmarks.length < 1)
        content = <PageHeader title="No bookmarks to display" />;
    return (
        <>
            <Navbar rightContent="search" />
            <BookmarksWrapper>
                {content}
                {/* <Button onClick={() => history.push(`${url}/search`)}>
                    Search for a Comm pkg
                </Button> */}
            </BookmarksWrapper>
        </>
    );
};

export default Bookmarks;
