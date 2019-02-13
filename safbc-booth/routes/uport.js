var express = require('express');
const bodyParser = require('body-parser');
var router = express.Router();

const {
  Credentials,
  SimpleSigner
} = require('uport-credentials');

const JWT = require('did-jwt');

const {
  transport
} = require('uport-transports');

const message = require('uport-transports').message.util;
const decodeJWT = require('did-jwt').decodeJWT;

/**
 * uPort initializations
 */
const UPORT_CFG = {
  HOST: 'http://04571d92.ngrok.io', //add your ngrok
  ADDRESS: 'did:ethr:0xa728976f1df7b67bcfaec88a68d74904329a3456',
  PVT_KEY: '3d4fae2b4ceb517249768defe300eacb0be71a81fd6302f61fa713024d67a358',
};

const credentials = new Credentials({
  appName: 'SAFBC Booth',
  network: "mainnet",
  did: UPORT_CFG.ADDRESS,
  privateKey: UPORT_CFG.PVT_KEY,
});

const transportQR = transport.qr.send();

// in an express application
router.get('/', (req, res) => {

  // console.log(credentials);
  generateRequest()
    .then(uri => {
      console.log('Got back uri: ', uri);
      res.render('uport', {
        title: 'uPort Login',
        codeblock: uri
      });
    })
})

router.post("/callback", (req, res) => {
  const jwt = req.body.access_token
  // Do something with the jwt
  console.log(jwt);
})

/**
 * Methods
 */
const generateRequest = async () => {
  const req = {
    requested: ['name', 'location', 'email'],
    verified: ['Attended_SAFBC_Stand'],
    callbackUrl: `/callback`,
    notifications: true,
  };

  try {
    const token = await credentials.createDisclosureRequest(req);
    console.log(decodeJWT(token)) //log request token to console
    const uri = message.paramsToQueryString(message.messageToURI(token), {
      callback_type: 'post'
    })
    //    const uri = `me.uport:me?requestToken=${token}&callback_type=post`;
    // qrcode.generate(uri, {
    //   small: true
    // });
    // console.log(uri);
    return uri;
  } catch (error) {
    console.error(error);
    return null;
  }
};

module.exports = router;