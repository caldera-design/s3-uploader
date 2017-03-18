
import React from 'react';
import { render } from 'react-dom';

import S3Uploader from './LibraryEntryPoint';

const styles = {
    container: {
        width: 300
    },
    uploadForm: {
        border: '2px solid grey'
    }
};

function RootComponent() {
    return (
        <div style={styles.container}>
            <S3Uploader bucket="caldera.design.dlc.s3.amazonaws.com"
                          region="us-west-2"
                          accessKey="AKIAIS22XIJECTUVQSYA"
                          signatureUrl={'http://localhost:6001/api/s3/signature'}
                          style={styles.uploadForm}/>
       </div>
    );
}

render(<RootComponent/>, document.getElementById('react-main'));
