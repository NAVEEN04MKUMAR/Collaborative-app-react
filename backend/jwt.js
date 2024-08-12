// const fs=require('fs');
const crypto=require('crypto');
const jwtsecret=crypto.randomBytes(64).toString('hex');
console.log('jwt secret key generated and saved',jwtsecret);