
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { themr } from 'react-css-themr';
import classnames from 'classnames';
import Promise from 'bluebird';
import $ from 'jquery';

import S3ImageUploader from './S3ImageUploader';

class S3ImageUploadForm extends Component {

    static propTypes = {
        theme: PropTypes.object.isRequired,
        className: PropTypes.string,
        errorMessage: PropTypes.string,
        s3: PropTypes.shape({
            bucket: PropTypes.string.isRequired,
            region: PropTypes.string.isRequired,
            accessKey: PropTypes.string.isRequired
        }).isRequired,
        signatureUrl: PropTypes.string.isRequired,
        successUrl: PropTypes.string.isRequired,
        onSave: PropTypes.func,
        onCancel: PropTypes.func
    }

    static defaultProps = {
        onSave: () => {},
        onCancel: () => {}
    }

    state = {
        isSaving: false,
        uploadedFileName: null
    }

    componentWillUnmount() {
        this.savePromise && this.savePromise.cancel();
    }

    handleSave() {
        this.setState({
            isSaving: true
        });
        this.savePromise = Promise.resolve()
            .then(() => this.props.onSave())
            .then(() => {
                this.setState({
                    isSaving: false
                });
            });
    }

    handleCancel() {
        this.props.onCancel();
    }

    checkCanSave() {
        return !!this.state.uploadedFileName;
    }

    handleUploadComplete(userFilename, uploadedFileName) {
        this.setState({
            uploadedFileName
        });
    }

    handleOpenFileBrowser() {
        $(ReactDOM.findDOMNode(this.fileBrowserInput)).click();
    }

    handleFileBrowserDidSelectFiles() {
        const files = ReactDOM.findDOMNode(this.fileBrowserInput).files;
        this.uploader.addFiles(files);
    }

    render() {
        const { theme, className, errorMessage } = this.props;
        const containerClasses = classnames({
            [theme.container]: true,
            [className]: !!className,
            [theme.error]: !!errorMessage
        });
        return (
            <div className={containerClasses}>
                {this.renderDropArea()}
                {this.renderErrorMessage()}
                {this.renderSaveButton()}
            </div>
        );
    }

    renderDropArea() {
        const { theme } = this.props;
        return (
            <div className={theme.squareFixSpacer}>
                <div className={theme.squareFixContainer}>
                    <S3ImageUploader ref={uploader => { this.uploader = uploader; }}
                                     previewImageClassName={theme.previewImage}
                                     className={theme.uploader}
                                     onComplete={this.handleUploadComplete.bind(this)}
                                     s3={this.props.s3}
                                     signatureUrl={this.props.signatureUrl}
                                     successUrl={this.props.successUrl}>
                        <h3>Drag an image here, or...</h3>
                        <input ref={input => { this.fileBrowserInput = input; }}
                               type="file"
                               onChange={this.handleFileBrowserDidSelectFiles.bind(this)}/>
                        <button onClick={this.handleOpenFileBrowser.bind(this)}>
                            Browse
                        </button>
                    </S3ImageUploader>
                </div>
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

    renderSaveButton() {
        const { theme } = this.props;
        const canSave = this.checkCanSave();
        const onClickAction = canSave ?
            this.handleSave.bind(this) :
            this.handleCancel.bind(this);
        return (
            <div className={theme.submitButtonContainer}>
                <button type="button"
                        onClick={onClickAction}>
                    {canSave ? 'Ok, Save it!' : 'Cancel'}
                </button>
            </div>
        );
    }
}

export default themr('S3ImageUploadForm')(S3ImageUploadForm);
