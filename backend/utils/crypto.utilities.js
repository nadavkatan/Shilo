const crypto = require('crypto');

const genPassword = (password) =>{
    const salt = crypto.randomBytes(32).toString("hex");
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");

    return {
        salt,
        hash
    }
}

const validatePassword =(password, hash, salt) =>{
    const hashVarify = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
    return hash === hashVarify;
}

module.exports = {genPassword, validatePassword};