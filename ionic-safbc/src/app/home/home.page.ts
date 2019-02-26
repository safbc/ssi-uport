import { Component } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import * as faker from 'faker';
import { GotGift } from '../got-gift';

declare var uportconnect: any;

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage {
    loading: HTMLIonLoadingElement;

    gift = false;
    BlockchainAcademy = false;
    VALR = false;
    OldMutual = false;
    SAFBC = false;
    BAC_ID = false;
    loggedin = false;
    learning = false;
    checkedin = false;
    completed = false;
    notcompleted = false;
    msg = '';
    uportName = '';
    firstName = 'First';
    lastName = 'Last';
    name = 'First Last';

    Connect = uportconnect;
    uport = new this.Connect('SAFBC SSI Quest', {
        network: 'mainnet',
        accentColor: '#200202',
        profileImage: { '/': '/ipfs/QmaAroK3Mrxzi2rpTKvLyfGfWfAnNGNKrKpQXmwWg2F54b' },
        bannerImage: { '/': '/ipfs/QmWeN9UFxU5mKWzuEXKuJTcPECkDa8MCJo95rCTGAchDQW' },
        description: 'SAFBC Stand @ Blockchain Africa 2019 Conference'
    });
    count: number;
    gotGift: boolean;

    constructor(
        public loadingController: LoadingController
    ) { }


    checkIn() {
        this.uport.requestDisclosure({
            requested: ['name'],
            verified: ['SAFBC', 'BAC_ID'],
            notifications: true
        })
            .catch((e) => {
                this.loading.dismiss();
                console.log(e);
            });

        this.presentLoading();

        this.uport.onResponse('disclosureReq')
            .then(res => {
                this.loading.dismiss();
                const did = res.payload.did;
                const json = JSON.stringify(res.payload);
                const verified = res.payload.verified;
                console.log(res.payload);
                this.uportName = res.payload.name;



                this.loggedin = true;
                this.learning = true;
                // this.msg = `Welcome Delegate, you are now logged in`;

                this.count = 0;

                if (verified.length === 0) {
                    console.log('SAFBC cred not issued yet');

                    this.firstName = faker.name.firstName();
                    this.lastName = faker.name.lastName();

                    this.name = this.firstName + ' ' + this.lastName;


                    this.issueCreds(res);

                } else {
                    let _id = false;
                    this.learning = false;

                    verified.forEach(element => {
                        console.log(++this.count);
                        console.log(element.claim);

                        if (undefined === element.claim.BAC_ID) {
                            console.log('ID cred not found yet');

                        } else {
                            console.log('ID cred already issued');
                            _id = true;

                            this.name = res.payload.BAC_ID.NomDeGuerre;

                            const nameArray = this.name.split(' ');
                            this.firstName = nameArray[0];
                            this.lastName = nameArray[1];

                            this.checkedin = true;

                        }

                    });
                    if (!_id) {
                        console.log('No ID was found at all. Creating new credentials');
                        this.firstName = faker.name.firstName();
                        this.lastName = faker.name.lastName();

                        this.name = this.firstName + ` ` + this.lastName;

                        this.checkedin = true;
                        this.issueCreds(res);
                    }
                }

            })
            .catch((e) => {
                this.loading.dismiss();
                console.log(e);
            });
    }

    issueCreds(res) {
        const claimData = {
            'SAFBC': {
                'DelegateDID': res.payload.did,
                'AttendedSAFBC': true,
                'LastSeen': `${new Date()}`
            }
        };

        let dob = faker.date.past(50, new Date('Sat Sep 20 1992 21:35:02 GMT+0200 (CEST)'));
        dob = dob.getFullYear() + '-' + (dob.getMonth() + 1) + '-' + dob.getDate();  // First month is "1"

        const claimID = {
            'BAC_ID': {
                'IDNumber': res.payload.did,
                'NomDeGuerre': this.name,
                'Domicile': faker.address.city(),
                'Born': dob,
                'Issued': `${new Date()}`
            }
        };

        // log the visit to firestore
        const logData = {
            'user': res.payload,
            'SAFBC': claimData.SAFBC,
            'BAC_ID': claimID.BAC_ID
        };

        this.logDelegate(logData);

        this.uport.sendVerification({
            exp: Math.floor(new Date().getTime() / 1000) + 30 * 24 * 60 * 60,
            claim: claimData
        }).then(() => {
            this.uport.sendVerification({
                exp: Math.floor(new Date().getTime() / 1000) + 365 * 24 * 60 * 60,
                claim: claimID
            });
            this.checkedin = true;
        });
    }

    verify() {
        this.uport.requestDisclosure({
            requested: ['name', 'email'],
            verified: ['SAFBC', 'OldMutual', 'VALR', 'BlockchainAcademy', 'GiftRedeemed', 'BAC_ID'],
            notifications: true
        })
            .catch((e) => {
                this.loading.dismiss();
                console.log(e);
            });

        this.presentLoading();

        this.uport.onResponse('disclosureReq')
            .then(res => {
                this.loading.dismiss();
                const _did = res.payload.did;
                const _jsonPayload = JSON.stringify(res.payload);
                const verified = res.payload.verified;
                console.log(res.payload);

                this.uportName = res.payload.name;

                let count = 0;

                this.loggedin = true;

                this.SAFBC = false;
                this.OldMutual = false;
                this.VALR = false;
                this.BlockchainAcademy = false;
                this.BAC_ID = false;
                this.gift = false;

                verified.forEach(element => {
                    console.log(++count);
                    if (undefined !== element.claim.SAFBC) {
                        this.SAFBC = true;
                    }
                    if (undefined !== element.claim.BAC_ID) {
                        this.BAC_ID = true;
                    }
                    if (undefined !== element.claim.OldMutual) {
                        this.OldMutual = true;
                    }
                    if (undefined !== element.claim.VALR) {
                        this.VALR = true;
                    }
                    if (undefined !== element.claim.BlockchainAcademy) {
                        this.BlockchainAcademy = true;
                    }
                    if (undefined !== element.claim.GiftRedeemed) {
                        this.gift = true;
                    }

                    if (this.SAFBC && this.BAC_ID && this.VALR && this.OldMutual && this.BlockchainAcademy && !this.gift) {

                        // TODO: Call webservice to double check if gift wasn't already issued but credential deleted.
                        console.log('Gift result', this.checkGift(res.payload.did));
                        // using the _did  value

                        this.completed = true;

                        const claimData = {
                            'GiftRedeemed': {
                                'redeemerName': res.payload.name,
                                'redeemerEmail': res.payload.email,
                                'redeemerDID': res.payload.did,
                                'GotGift': true,
                                'redeemedDate': `${new Date()}`
                            }
                        };

                        // log the visit to firestore
                        const logData = {
                            'user': res.payload,
                            'GiftRedeemed': claimData.GiftRedeemed
                        };
                        this.logDelegate(logData);

                        this.uport.sendVerification({
                            exp: Math.floor(new Date().getTime() / 1000) + 300 * 24 * 60 * 60,
                            claim: claimData
                        }).then(() => {
                            // Show completed response
                            this.completed = true;
                        });


                    } else if (this.SAFBC && this.BAC_ID && !this.gift && (!this.OldMutual || !this.VALR || !this.BlockchainAcademy)) {
                        // Show not completed response
                        this.name = res.payload.BAC_ID.NomDeGuerre;
                        this.notcompleted = true;

                    } else if (this.gift) {
                        // Fall through to show gift already redeemed response

                    }

                });

            });


    }


    logout() {

        this.uport.logout();
        this.uport.reset();

        this.loggedin = false;
        this.learning = false;
        this.checkedin = false;
        this.completed = false;
        this.msg = null;

        location.reload();

    }

    async presentLoading() {
        this.loading = await this.loadingController.create({
            spinner: 'circles',
            message: 'Please wait...',
            translucent: true,
        });
        return await this.loading.present();
    }

    /**
    * @description Log the delegate activity to firestore via cloud function.
    * @author G de Beer
    * @date 2019-02-17
    * @param visitor uPort claim data
    */
    logDelegate(visitor) {
        const xhr = new XMLHttpRequest();
        const data = JSON.stringify(visitor);
        xhr.onreadystatechange = function () {
            if (this.readyState === 4) {
                console.log('XHR request completed. ', this.responseText);
            }
        };
        // tslint:disable-next-line:quotemark
        xhr.open("POST", "https://us-central1-veritydemo1.cloudfunctions.net/function-1");

        // tslint:disable-next-line:quotemark
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(data);
    }

    checkGift(did) {
        const xhr = new XMLHttpRequest();
        const qry = {
            'did': did
        };
        const data = JSON.stringify(qry);

        // tslint:disable-next-line:quotemark
        xhr.open("POST", "https://us-central1-veritydemo1.cloudfunctions.net/function-1");

        // tslint:disable-next-line:quotemark
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(data);

        return xhr.onreadystatechange = function () {
            if (this.readyState === 4) {
                console.log('XHR request completed. ', this.responseText);
                const res: GotGift = JSON.parse(this.responseText);
                return res.gotGift;
            }
        };

    }

}
