
import Promise from 'bluebird';

Promise.config({
    cancellation: true
});

import S3UploadForm from './S3UploadForm';
import Provider from './Provider';

// Note: a bug in `react-hot-loader` causes us to need to use `module.exports` here.
// see https://github.com/gaearon/react-hot-loader/issues/158
module.exports = {
    Provider,
    S3UploadForm
};
