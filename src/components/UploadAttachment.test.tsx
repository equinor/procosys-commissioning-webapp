import { render, screen } from '@testing-library/react';
import { withPlantContext } from '../test/contexts';
import UploadAttachment from './UploadAttachment';
import React from 'react';

const renderUploadModal = () => {
    render(
        withPlantContext({
            Component: (
                <UploadAttachment
                    parentId={'123'}
                    refreshAttachments={() => {}}
                    setSnackbarText={() => {}}
                    setShowModal={() => {}}
                    postAttachment={() => {
                        return Promise.resolve();
                    }}
                />
            ),
        })
    );
};

describe('<UploadAttachment/>', () => {
    it('Renders modal', () => {
        renderUploadModal();
        expect(screen.getByText('Choose image...')).toBeInTheDocument();
    });
});
