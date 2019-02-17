'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.logActivity = functions.https.onRequest((req, res) => {

    console.log(req.body);
    let data = req.body;

    // Set CORS headers for preflight requests
    // Allows GETs from any origin with the Content-Type header
    // and caches preflight response for 3600s

    res.set('Access-Control-Allow-Origin', '*');

    if (req.method === 'OPTIONS') {
        // Send response to OPTIONS requests
        res.set('Access-Control-Allow-Methods', 'POST');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.set('Access-Control-Max-Age', '3600');
        res.status(204).send('');
    } else {
        // Set CORS headers for the main request
        res.set('Access-Control-Allow-Origin', '*');
        let col = db.collection('activity');
        return col.add(data)
            .then((snapshot) => {
                console.log('db add successful', snapshot);
                return res.status(200).send(snapshot);
            })
            .catch(e => {
                return res.status(500).send(e);
            });
    }

});