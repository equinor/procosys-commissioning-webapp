import React, { useContext } from 'react';
import styled from 'styled-components';
import DetailsCard from '../components/commPkg/DetailsCard';
import PageHeader from '../components/PageHeader';
import { getCurrentBookmarks } from '../services/useBookmarks';
import { Button } from '@equinor/eds-core-react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import PlantContext from '../contexts/PlantContext';
import Navbar from '../components/navigation/Navbar';
import { SHADOW } from '../style/GlobalStyles';
import EdsIcon from '../components/EdsIcon';

const BookmarksWrapper = styled.main`
    display: flex;
    flex-direction: column;
    padding-bottom: 70px;
    & h3 {
        text-align: center;
    }
`;

const NewBookmarkWrapper = styled.div`
    margin: 12px 4% 10px 4%;
    display: flex;
    justify-content: flex-end;
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
            atBookmarksPage={true}
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
        <main>
            <Navbar
                leftContent={{ name: 'hamburger' }}
                rightContent={{ name: 'search' }}
            />
            <BookmarksWrapper>
                {content}
                <NewBookmarkWrapper>
                    <Button onClick={() => history.push(`${url}/search`)}>
                        <EdsIcon name="search" color="white" />
                        Find comm. pkg
                    </Button>
                </NewBookmarkWrapper>
            </BookmarksWrapper>
        </main>
    );
};

export default Bookmarks;
