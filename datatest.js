require('dotenv').config();
const Client = require('ssh2-sftp-client');
const fs = require('fs');
const zlib = require('zlib'); 
const stream = require('stream');
const util = require('util');

const sftpConfig = {
    host: 'partnerupload.google.com',
    port: 19321,
    username: 'feeds-82dgm1',
    privateKey: fs.readFileSync(process.env.PRIVATE_KEY_PATH),
    connectTimeout: 4000,
};

const pipeline = util.promisify(stream.pipeline);

async function loadSingleFeedData(feedPath) {
    const sftp = new Client();
    try {
        await sftp.connect(sftpConfig);
        console.log('SFTP Connection Successful');

        const fileStream = await sftp.get(feedPath);
        const unzipStream = zlib.createGunzip();
        const chunks = [];

        fileStream.pipe(unzipStream);
        unzipStream.on('data', chunk => chunks.push(chunk));
        unzipStream.on('end', () => {
            const fileData = Buffer.concat(chunks).toString('utf-8');
            console.log(`Data from ${feedPath}:`, fileData);
        });

        unzipStream.on('error', (err) => {
            console.error('Error during decompression:', err);
        });

        // Wait until the stream processing is complete
        await new Promise(resolve => unzipStream.on('end', resolve));

        await sftp.end();
    } catch (err) {
        console.error('Error loading feed data:', err);
    }
}

loadSingleFeedData('availabilityfeed.json.gz');
