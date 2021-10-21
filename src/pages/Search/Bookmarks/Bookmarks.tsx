import React, { useContext } from 'react';
import styled from 'styled-components';
import DetailsCard from '../../CommPkg/DetailsCard';
import PageHeader from '../../../components/PageHeader';
import { getCurrentBookmarks } from '../../../utils/useBookmarks';
import { Button } from '@equinor/eds-core-react';
import PlantContext from '../../../contexts/PlantContext';
import EdsIcon from '../../../components/icons/EdsIcon';
import useCommonHooks from '../../../utils/useCommonHooks';
import withAccessControl from '../../../services/withAccessControl';
import {
    CollapsibleCard,
    Navbar,
    ProcosysButton,
} from '@equinor/procosys-webapp-components';
import SideMenu from '../../../components/navigation/SideMenu';

const BookmarksWrapper = styled.div`
    margin: 16px 0;
`;

const Bookmarks = (): JSX.Element => {
    const { url, history } = useCommonHooks();
    const { currentProject, currentPlant } = useContext(PlantContext);
    const bookmarks = currentProject
        ? getCurrentBookmarks(currentProject.id.toString())
        : [];

    return (
        <BookmarksWrapper>
            <CollapsibleCard cardTitle={'Bookmarks'}>
                {bookmarks.length < 1 ? (
                    <p>
                        <i>No bookmarks to display</i>
                    </p>
                ) : (
                    <>
                        {bookmarks.map((bookmark) => (
                            <DetailsCard
                                key={bookmark}
                                commPkgId={bookmark}
                                atBookmarksPage={true}
                                onClickAction={(): void =>
                                    history.push(`${url}/Comm/${bookmark}`)
                                }
                            />
                        ))}
                    </>
                )}
            </CollapsibleCard>
        </BookmarksWrapper>
    );
};

export default withAccessControl(Bookmarks, ['COMMPKG/READ']);
