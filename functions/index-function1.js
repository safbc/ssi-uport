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
    // Set CORS headers for preflight requests

    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
        // Send response to OPTIONS requests
        res.set('Access-Control-Allow-Methods', 'POST');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.set('Access-Control-Max-Age', '3600');
        res.status(204).send('');
    } else {
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Headers', 'Content-Type');

        console.log(req.body);
        let data = req.body;
        let did = data.user.did;
        let colStr = 'Activity';

        let doc = db.collection(colStr).doc(did);
        return doc.get()
            .then(d => {
                if (d.exists) {
                    // Update only changed data
                    return doc.update(data)
                        .then(() => {
                            console.log('db add successful');
                            return res.status(200).send('Updated');
                        })
                        .catch(e => {
                            return res.status(500).send(e);
                        });
                } else {
                    // create new document
                    return doc.set(data)
                        .then((snapshot) => {
                            console.log('db add successful');
                            return res.status(200).send(snapshot);
                        })
                        .catch(e => {
                            return res.status(500).send(e);
                        });
                }
            })
    }

});