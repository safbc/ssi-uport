import { Component } from '@angular/core';
import { LoadingController } from '@ionic/angular';

declare var uportconnect: any;
declare var faker: any;

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
    OldMutualKYC = false;
    SAFBC = false;
    BAC_ID = false;
    loggedin = false;
    learning = false;
    checkedin = false;
    completed = false;
    notcompleted = false;
    msg = 'You are now logged in and you did it without a user name or password.';
    firstName = 'UnLast';
    lastName = 'UnLast';
    name = 'UnPerson';

    Connect = uportconnect;
    uport = new this.Connect('VALR SSI Quest', {
        network: 'mainnet',
        profileImage: { '/': '/ipfs/QmZWK7HRRM4Q5zC8aeRd1u9B3XtyTxRLQW211tAxaphMia' },
        bannerImage: { '/': '/ipfs/QmdwUeghExKjyfYNz43yWHeF7ndjxSeaZosUQQ6ogbEr8T' },
        description: 'VALR Stand @ Blockchain Africa 2019 Conference'
    });
    count: number;
    CredsIssued: boolean;
    VALRAuth: boolean;

    constructor(
        public loadingController: LoadingController
    ) { }

    checkIn() {
        this.uport.requestDisclosure({
            requested: ['name'],
            verified: ['SAFBC', 'BAC_ID', 'VALR', 'VALRAuth', 'OldMutualKYC'],
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

                this.loggedin = true;

                this.count = 0;

                if (verified.length === 0) {
                    console.log('SAFBC cred not issued yet');
                    // document.querySelector('#msg').innerHTML =
                    // document.querySelector('#msg').innerHTML +
                    this.msg = 'I see you are eager to play the SSI Quest, but you must first please visit the SAFBC stand to start!';

                } else {
                    verified.forEach(element => {
                        console.log(++this.count);

                        if (undefined !== element.claim.BAC_ID) {
                            console.log('ID cred  issued ');
                            this.BAC_ID = true;
                        } else if (undefined !== element.claim.VALR) {
                            console.log('VALR cred  issued already');
                            this.VALR = true;
                        } else if (undefined !== element.claim.VALRAuth) {
                            console.log('VALRAuth cred issued already');
                            this.VALRAuth = true;
                        } else if (undefined !== element.claim.SAFBC) {
                            console.log('SAFBC cred issued');
                            this.SAFBC = true;
                        } else if (undefined !== element.claim.OldMutualKYC) {
                            console.log('OldMutual KYC presented')
                            this.OldMutualKYC = true;
                        }
                    });

                    if (!this.BAC_ID) {
                        console.log('ID cred not issued yet');
                        this.learning = false;
                        this.msg = 'I see you are eager to play the SSI Quest, but you must first please visit the SAFBC stand to start!';
                        return;
                    } else {
                        if (this.VALR && this.VALRAuth) {
                            console.log('VALR creds already issued');
                            this.name = res.payload.BAC_ID.NomDeGuerre;
                            this.CredsIssued = true;

                            return;

                        } else {
                            console.log('VALR creds not issued yet');
                            this.msg = null;

                            this.name = res.payload.BAC_ID.NomDeGuerre;
                            this.firstName = this.name.split(' ').shift();
                            this.lastName = this.name.split('').pop();

                            const claimData = {
                                'VALR': {
                                    'DelegateDID': res.payload.did,
                                    'AttendedVALR': true,
                                    'LastSeen': `${new Date()}`,
                                    'Description': 'Proof that you visited the VALR stand.'
                                }
                            };
                            let kyc: any = null;
                            if (this.OldMutualKYC) {
                                kyc = res.payload.OldMutualKYC;
                            } else {
                                kyc = res.payload.BAC_ID;
                            }

                            const description = 'If you have visited the Old Mutual stand before you visited VALR,' +
                                ' you will notice that the KYC record contains a copy of the OldMutualKYC credential.' +
                                ' This indicates that VALR has forgone the usual KYC process, and instead has opted rely' +
                                ' on the KYC process attestation of Old Mutual. This simplifies things so much for the' +
                                ' customer.';

                            const claimAuth = {
                                'VALRAuth': {
                                    'User': res.payload.did,
                                    'KYC': kyc,
                                    'Issued': `${new Date()}`,
                                    'Description': description
                                }
                            };

                            const a = Object.keys(claimData)[0];

                            // log the visit to firestore
                            const logData = {
                                'user': res.payload,
                                'VALR': claimData.VALR,
                                'VALRAuth': claimAuth.VALRAuth
                            };

                            this.logDelegate(logData);

                            this.uport.sendVerification({
                                exp: Math.floor(new Date().getTime() / 1000) + 30 * 24 * 60 * 60,
                                claim: claimData
                            }).then(() => {
                                this.learning = true;
                                this.uport.sendVerification({
                                    exp: Math.floor(new Date().getTime() / 1000) + (4 * 60 * 60),
                                    claim: claimAuth
                                });
                            });


                        }
                    }


                }

            })
            .catch((e) => {
                this.loading.dismiss();
                console.log(e);
            });
    }

    logout() {

        this.uport.logout();
        this.uport.reset();

        this.loggedin = false;
        this.learning = false;
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

}
