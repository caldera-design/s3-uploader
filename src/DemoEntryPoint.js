
import React from 'react';
import { render } from 'react-dom';

import { Provider, S3UploadForm } from './LibraryEntryPoint';

const styles = {
    container: {
        width: 300
    },
    uploadForm: {
        border: '2px solid grey'
    }
};

const RootComponent = () => {
    return (
        <Provider>
            <div style={styles.container}>
                <S3UploadForm bucket="caldera.design.dlc.s3.amazonaws.com"
                              region="us-west-2"
                              accessKey="AKIAIS22XIJECTUVQSYA"
                              signatureUrl={'http://localhost:6001/api/s3/signature'}
                              successUrl={'http://localhost:6001/api/s3/success'}
                              style={styles.uploadForm}/>
           </div>
        </Provider>
    );
};

render(<RootComponent/>, document.getElementById('react-main'));
