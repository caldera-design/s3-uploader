
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import * as qq from 'fine-uploader/s3.fine-uploader/s3.fine-uploader.core';
import { DragAndDrop } from 'fine-uploader/dnd/dnd.js';

export default class S3Uploader extends Component {

    static propTypes = {
        className: PropTypes.string,
        acl: PropTypes.string,
        bucket: PropTypes.string.isRequired,
        region: PropTypes.string.isRequired,
        accessKey: PropTypes.string.isRequired,
        signatureUrl: PropTypes.string.isRequired,
        successUrl: PropTypes.string.isRequired,
        onError: PropTypes.func,
        onComplete: PropTypes.func,
        onProgress: PropTypes.func,
        resumeEnabled: PropTypes.bool,
        deleteEnabled: PropTypes.bool,
        chunkingEnabled: PropTypes.bool,
        concurrentChunkingEnabled: PropTypes.bool,
        autoUploadEnabled: PropTypes.bool,
        preview: PropTypes.element
    }

    static defaultProps = {
        onComplete: () => {},
        onProgress: () => {},
        onError: () => {},
        acl: 'public-read',
        resumeEnabled: true,
        deleteEnabled: true,
        chunkingEnabled: true,
        concurrentChunkingEnabled: true,
        autoUploadEnabled: false
    }

    state = {
        showPreview: false
    }

    componentDidMount() {
        this.configureUploader();
    }

    configureUploader() {
        this.uploader = new qq.s3.FineUploaderBasic(this.getUploaderConfig());
        this.dragAndDrop = new DragAndDrop({
            dropZoneElements: [ReactDOM.findDOMNode(this)],
            callbacks: {
                dropError: this.props.onError,
                processingDroppedFilesComplete: files => this.addFiles(files)
            }
        });
    }

    addFiles(files) {
        this.uploader.addFiles(files);
    }

    uploadFiles() {
        this.uploader.uploadStoredFiles();
    }

    clearFiles() {
        this.uploader.clearStoredFiles();
    }

    getUploaderConfig() {
        return {
            element: ReactDOM.findDOMNode(this),
            autoUpload: this.props.autoUploadEnabled,
            request: {
                endpoint: this.props.bucket,
                accessKey: this.props.accessKey
            },
            signature: {
                endpoint: this.props.signatureUrl
            },
            objectProperties: {
                region: this.props.region,
                acl: this.props.acl
            },
            uploadSuccess: {
                endpoint: this.props.successUrl
            },
            chunking: {
                enabled: this.props.chunkingEnabled,
                concurrent: {
                    enabled: this.props.concurrentChunkingEnabled
                }
            },
            resume: {
                enabled: this.props.resumeEnabled
            },
            deleteFile: {
                enabled: this.props.deleteEnabled
            },
            callbacks: {
                onComplete: (id, fileName, { uploadedFileName }) => {
                    this.props.onComplete(fileName, uploadedFileName);
                },
                onProgress: (id, fileName, uploadedBytes, totalBytes) => {
                    this.props.onProgress(fileName, uploadedBytes / totalBytes);
                },
                onError: (id, fileName, error) => this.props.onError(fileName, error),
                onSubmit: (id) => this.configurePreview(id)
            }
        };
    }

    configurePreview(id) {
        // const previewImage = ReactDOM.findDOMNode(this.previewImage);
        // this.uploader.drawThumbnail(id, previewImage);
    }

    render() {
        return (
            <div className={this.props.className}>
                {/* {!this.state.showPreview && this.props.preview} */}
                {this.props.children}
                {/* <img ref={img => { this.previewImage = img; }} /> */}
            </div>
        );
    }
}
