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
    height: 124px;
    margin: 0 10px 10px 10px;
    box-shadow: ${SHADOW};
    border: 1px dashed #007079;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const SearchButton = styled(Button)`
    width: fit-content;
    align-self: flex-end;
    margin-right: 4%;
    margin-top: 12px;
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
                <NewBookmarkWrapper>
                    <Button onClick={() => history.push(`${url}/search`)}>
                        <EdsIcon name="search" color="white" />
                        Find comm. pkg
                    </Button>
                </NewBookmarkWrapper>
            </BookmarksWrapper>
        </>
    );
};

export default Bookmarks;
