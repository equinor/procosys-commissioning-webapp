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
    test.todo('It allows user to select an image');
    test.todo('It allows user to upload the image');
    test.todo('It renders an error message if image upload fails');
});