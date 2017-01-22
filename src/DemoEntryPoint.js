
import React from 'react';
import { render } from 'react-dom';

import { Provider, S3ImageUploadForm } from './LibraryEntryPoint';

const RootComponent = () => {
    return (
        <Provider>
            <S3ImageUploadForm s3={{
                    bucket: 'caldera.design.dlc.s3.amazonaws.com', // TODO
                    region: 'us-west-2',
                    accessKey: 'AKIAIS22XIJECTUVQSYA'
                }}
                signatureUrl={'http://localhost:6001/api/s3/signature'}
                successUrl={'http://localhost:6001/api/s3/success'}/>
        </Provider>
    );
};

render(<RootComponent/>, document.getElementById('react-main'));
