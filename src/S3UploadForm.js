
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { themr } from 'react-css-themr';
import classnames from 'classnames';
import Promise from 'bluebird';
import $ from 'jquery';
import noop from 'lodash/noop';

import S3Uploader from './S3Uploader';

class S3UploadForm extends Component {

    static propTypes = {
        theme: PropTypes.object.isRequired,
        className: PropTypes.string,
        style: PropTypes.object,
        bucket: PropTypes.string.isRequired,
        region: PropTypes.string.isRequired,
        accessKey: PropTypes.string.isRequired,
        signatureUrl: PropTypes.string.isRequired,
        onSave: PropTypes.func,
        onCancel: PropTypes.func,
        onError: PropTypes.func,
        errorMessage: PropTypes.string,
        saveMessage: PropTypes.string,
        cancelMessage: PropTypes.string
    }

    static defaultProps = {
        onSave: noop,
        onCancel: noop,
        onError: noop,
        saveMessage: 'Save',
        cancelMessage: 'Cancel'
    }

    state = {
        isLoading: false,
        hasFiles: false
    }

    componentWillUnmount() {
        this.savePromise && this.savePromise.cancel();
    }

    handleUploadComplete(userFilename, uploadedFileName) {
        this.handleSave(uploadedFileName);
    }

    handleUploadProgress(fileName, progress) {
        // TODO
    }

    handleUploadError(fileName, error) {
        this.props.onError(fileName, error);
    }

    handleSave(uploadedFileName) {
        this.setState({
            isLoading: true
        });
        this.savePromise = Promise.resolve()
            .then(() => this.props.onSave(uploadedFileName))
            .then(() => {
                this.setState({
                    isLoading: false,
                    hasFiles: false
                });
            });
    }

    handleCancel() {
        this.setState({
            isLoading: true
        });
        this.savePromise = Promise.resolve()
            .then(() => this.props.onCancel())
            .then(() => {
                this.setState({
                    isLoading: false
                });
            });
    }

    handleOpenFileBrowser() {
        $(ReactDOM.findDOMNode(this.fileBrowserInput)).click();
    }

    handleFileBrowserDidSelectFiles() {
        const files = ReactDOM.findDOMNode(this.fileBrowserInput).files;
        this.uploader.addFiles(files);
    }

    uploadFiles(e) {
        e && e.stopPropagation();
        this.uploader.uploadFiles();
    }

    clearFiles(e) {
        e && e.stopPropagation();
        this.uploader.clearFiles();
    }

    render() {
        const { theme, className, errorMessage } = this.props;
        const containerClasses = classnames({
            [theme.container]: true,
            [theme.error]: !!errorMessage,
            [className]: !!className
        });
        return (
            <div className={containerClasses}>
                {this.renderDropArea()}
                {/* {this.renderErrorMessage()} */}
            </div>
        );
    }

    renderDropArea() {
        const { theme, style } = this.props;
        return (
            <div className={theme.squareFixSpacer}
                 style={style}
                 onClick={this.handleOpenFileBrowser.bind(this)}>
                <input ref={input => { this.fileBrowserInput = input; }}
                       type="file"
                       onChange={this.handleFileBrowserDidSelectFiles.bind(this)}/>
                <div className={theme.squareFixContainer}>
                    <S3Uploader className={theme.uploader}
                                ref={uploader => { this.uploader = uploader; }}
                                onError={this.handleUploadError.bind(this)}
                                onComplete={this.handleUploadComplete.bind(this)}
                                onProgress={this.handleUploadProgress.bind(this)}
                                onAddFile={() => this.setState({ hasFiles: true })}
                                onClearFiles={() => this.setState({ hasFiles: false })}
                                bucket={this.props.bucket}
                                region={this.props.region}
                                accessKey={this.props.accessKey}
                                signatureUrl={this.props.signatureUrl}
                                preview={this.renderPreview()}>
                        {this.props.children}
                        {this.renderButtons()}
                    </S3Uploader>
                </div>
            </div>
        );
    }

    renderPreview() {
        return (
            <div>

            </div>
        );
    }

    renderErrorMessage() {
        const { theme, errorMessage } = this.props;
        return (
            <div className={theme.errorMessageContainer}>
                {errorMessage}
            </div>
        );
    }

    renderButtons() {
        if (!this.state.hasFiles) {
            return;
        }
        return (
            <div className={this.props.theme.buttonContainer}>
                <button type="button"
                        onClick={this.uploadFiles.bind(this)}>
                    {this.props.saveMessage}
                </button>
                <button type="button"
                        onClick={this.clearFiles.bind(this)}>
                    {this.props.cancelMessage}
                </button>
            </div>
        );
    }
}

export default themr('S3UploadForm')(S3UploadForm);
