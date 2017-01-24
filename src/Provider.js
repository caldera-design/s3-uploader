
import React, { Component } from 'react';
import { ThemeProvider } from 'react-css-themr';

const theme = {
    S3UploadForm: require('./S3UploadForm.styles.scss')
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
