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
        let data = {};
        let colStr = 'SAFBC';

        if (undefined !== req.body.SAFBC) {
            data = req.body.SAFBC
            colStr = 'SAFBC';
        } else if (undefined !== req.body.VALR) {
            data = req.body.VALR
            colStr = 'VALR';
        } else if (undefined !== req.body.OldMutual) {
            data = req.body.OldMutual
            colStr = 'OldMutual';
        } else if (undefined !== req.body.BlockchainAcademy) {
            data = req.body.BlockchainAcademy
            colStr = 'BlockchainAcademy';
        } else if (undefined !== req.body.GiftRedeemed) {
            data = req.body.GiftRedeemed
            colStr = 'GiftRedeemed';
        }

        let doc = db.collection(colStr);
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