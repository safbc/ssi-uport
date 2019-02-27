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
    msg = null;
    firstName = 'UnLast';
    lastName = 'UnLast';
    name = 'UnPerson';

    Connect = uportconnect;
    uport = new this.Connect('Old Mutual SSI Quest', {
        network: 'mainnet',
        profileImage: { '/': '/ipfs/QmbWR7ZV7QhSnjmfGKoiT5wmvqLjSBFT1msFvMKgCdYWK5' },
        bannerImage: { '/': '/ipfs/Qmbcxvpf7A4wshhZtoPVyXioED7c33sDrJdMjFNqAx6gFp' },
        description: 'Old Mutual & 22seven @ Blockchain Africa 2019 Conference'
    });
    count: number;
    CredsIssued: boolean;
    falsestart: boolean;

    constructor(
        public loadingController: LoadingController
    ) { }

    checkIn() {
        this.uport.requestDisclosure({
            requested: ['name'],
            verified: ['SAFBC', 'BAC_ID', 'OldMutual', 'OldMutualKYC'],
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
                    this.falsestart = true;

                } else {
                    verified.forEach(element => {
                        console.log(++this.count);

                        if (undefined !== element.claim.BAC_ID) {
                            console.log('ID cred  issued ');
                            this.BAC_ID = true;
                        } else if (undefined !== element.claim.OldMutual) {
                            console.log('OldMutual cred  issued already');
                            this.OldMutual = true;
                        } else if (undefined !== element.claim.OldMutualKYC) {
                            console.log('OldMutualKYC cred issued already');
                            this.OldMutualKYC = true;
                        } else if (undefined !== element.claim.SAFBC) {
                            console.log('SAFBC cred issued');
                            this.SAFBC = true;
                        }
                    });

                    if (!this.BAC_ID) {
                        console.log('ID cred not issued yet');
                        this.falsestart = true;
                        return;
                    } else {
                        if (this.OldMutual && this.OldMutualKYC) {
                            console.log('OldMutual creds already issued');
                            this.name = res.payload.BAC_ID.NomDeGuerre;
                            this.CredsIssued = true;

                            return;

                        } else {
                            console.log('OldMutual creds not issued yet');
                            this.msg = null;

                            this.name = res.payload.BAC_ID.NomDeGuerre;
                            this.firstName = this.name.split(' ').shift();
                            this.lastName = this.name.split('').pop();

                            const claimData = {
                                'OldMutual': {
                                    'DelegateDID': res.payload.did,
                                    'AttendedOldMutual': true,
                                    'LastSeen': `${new Date()}`,
                                    'Description': 'Proof of having attended the Old Mutual 22seven stand.'
                                }
                            };

                            const description = 'In the future, should the correct governance frameworks be put in place,' +
                                ' financial institutions will accept the validated and signed FICA credentials issued by' +
                                ' other institutions. These would have been issued with appropriate validity periods as' +
                                ' per the context of the original interaction. Once the onboarding process is audited and vetted' +
                                ' by the relevant official regulatory authority, then the HUMAN Trust will rubber stamp the' +
                                ' SYSTEMIC Trust';

                            const claimKYC = {
                                'OldMutualKYC': {
                                    'IDNumber': res.payload.BAC_ID.IDNumber,
                                    'NomDeGuerre': res.payload.BAC_ID.NomDeGuerre,
                                    'Domicile': res.payload.BAC_ID.Address,
                                    'DOB': res.payload.BAC_ID.Born,
                                    'Issued': `${new Date()}`,
                                    'Description': description
                                }
                            };

                            const a = Object.keys(claimData)[0];

                            // log the visit to firestore
                            const logData = {
                                'user': res.payload,
                                'OldMutual': claimData.OldMutual,
                                'OldMutualKYC': claimKYC.OldMutualKYC
                            };

                            this.logDelegate(logData);

                            this.uport.sendVerification({
                                exp: Math.floor(new Date().getTime() / 1000) + 30 * 24 * 60 * 60,
                                claim: claimData
                            }).then(() => {
                                this.learning = true;
                                this.uport.sendVerification({
                                    exp: Math.floor(new Date().getTime() / 1000) + 30 * 24 * 60 * 60,
                                    claim: claimKYC
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
