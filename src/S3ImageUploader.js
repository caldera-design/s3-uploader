
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import * as qq from 'fine-uploader/s3.fine-uploader/s3.fine-uploader.core';
import { DragAndDrop } from 'fine-uploader/dnd/dnd.js';

export default class S3ImageUploader extends Component {

    static propTypes = {
        className: PropTypes.string,
        previewImageClassName: PropTypes.string,
        s3: PropTypes.shape({
            bucket: PropTypes.string.isRequired,
            region: PropTypes.string.isRequired,
            accessKey: PropTypes.string.isRequired
        }).isRequired,
        signatureUrl: PropTypes.string.isRequired,
        successUrl: PropTypes.string.isRequired,
        onError: PropTypes.func,
        onComplete: PropTypes.func,
        onProgress: PropTypes.func
    }

    static defaultProps = {
        onComplete: () => {},
        onProgress: () => {},
        onError: () => {}
    }

    state = {
        showPreview: false
    }

    componentDidMount() {
        this.configureUploader();
    }

    addFiles(files) {
        this.uploader.addFiles(files);
    }

    configureUploader() {
        const element = ReactDOM.findDOMNode(this);
        this.uploader = new qq.s3.FineUploaderBasic(this.getConfigForElement(element));
        this.dragAndDrop = new DragAndDrop({
            dropZoneElements: [element],
            callbacks: {
                dropError: this.props.onError,
                processingDroppedFilesComplete: (files, dropTarget) => {
                    this.uploader.addFiles(files);
                }
            }
        });
    }

    getConfigForElement(element) {
        return {
            element: element,
            callbacks: {
                onComplete: (id, fileName, { uploadedFileName }) => {
                    this.props.onComplete(fileName, uploadedFileName);
                },
                onProgress: (id, fileName, uploadedBytes, totalBytes) => {
                    this.props.onProgress(fileName, uploadedBytes, totalBytes);
                },
                onError: (id, fileName, error) => {
                    this.props.onError(error);
                },
                onSubmit: (id) => {
                    this.configurePreview(id);
                }
            },
            request: {
                endpoint: this.props.s3.bucket,
                accessKey: this.props.s3.accessKey
            },
            signature: {
                endpoint: this.props.signatureUrl
            },
            objectProperties: {
                region: this.props.s3.region,
                acl: 'public-read'
            },
            uploadSuccess: {
                endpoint: this.props.successUrl
            },
            chunking: {
                enabled: true,
                concurrent: {
                    enabled: true
                }
            },
            resume: {
                enabled: true
            },
            deleteFile: {
                enabled: false
            }
        };
    }

    configurePreview(id) {
        const previewImage = ReactDOM.findDOMNode(this.previewImage);
        this.uploader.drawThumbnail(id, previewImage);
    }

    render() {
        const { className, children, previewImageClassName } = this.props;
        return (
            <div className={className}>
                {!this.state.showPreview && children}
                <img ref={img => { this.previewImage = img; }}
                     className={previewImageClassName} />
            </div>
        );
    }

}
