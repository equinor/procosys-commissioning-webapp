import React, { ChangeEvent, useContext, useState } from 'react';
import { Search, Typography } from '@equinor/eds-core-react';
import withAccessControl from '../../security/withAccessControl';
import PlantContext from '../../contexts/PlantContext';
import { AsyncStatus } from '../../contexts/UserContext';
import FullPageLoader from '../loading/FullPageLoader';

const SearchPage = () => {
    const [searchInput, setSearchInput] = useState('');

    return (
        <>
            <Typography variant="h4">Search for a comm package: </Typography>
            <Search
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setSearchInput(e.target.value)
                }
            />
        </>
    );
};

export default withAccessControl(SearchPage, ['COMMPKG/READ']);
