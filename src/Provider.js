
import React, { Component } from 'react';
import { ThemeProvider } from 'react-css-themr';

const theme = {
    S3ImageUploadForm: require('./S3ImageUploadForm.styles.scss')
};

export default class Provider extends Component {
    render() {
        return (
            <ThemeProvider theme={theme}>
                {this.props.children}
            </ThemeProvider>
        );
    }
}
