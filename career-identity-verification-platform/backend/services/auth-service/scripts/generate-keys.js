const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const generateKeys = () => {
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem',
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
        },
    });

    const secretsDir = path.join(__dirname, '../secrets');
    if (!fs.existsSync(secretsDir)) {
        fs.mkdirSync(secretsDir);
    }

    fs.writeFileSync(path.join(secretsDir, 'jwt_private.pem'), privateKey);
    fs.writeFileSync(path.join(secretsDir, 'jwt_public.pem'), publicKey);

    console.log('RSA Keys generated successfully in /secrets');
};

generateKeys();
