require('dotenv').config();
const Client = require('ssh2-sftp-client');
const fs = require('fs');

const sftpConfig = {
    host: 'partnerupload.google.com',
    port: 19321,
    username: process.env.MERCHANT_USERNAME,  
    privateKey: fs.readFileSync(process.env.PRIVATE_KEY_PATH),
    connectTimeout: 900000,
};

async function testConnection() {
    const sftp = new Client();
    try {
        await sftp.connect(sftpConfig);
        console.log('SFTP Connection Successful');

        const fileList = await sftp.list('/');
        console.log('Files on SFTP Server:', fileList);

        await sftp.end();
    } catch (err) {
        console.error('Error connecting to SFTP:', err);
    }
}

testConnection();
