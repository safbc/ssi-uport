import { Component } from '@angular/core';

declare var uportconnect: any;

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage {

    constructor() {

    }

    msg = '';
    loggedin = false;
    Connect = uportconnect;
    uport = new this.Connect('Old Mutual SSI Quest', {
        network: 'mainnet',
        profileImage: { '/': '/ipfs/QmbWR7ZV7QhSnjmfGKoiT5wmvqLjSBFT1msFvMKgCdYWK5' },
        bannerImage: { '/': '/ipfs/Qmbcxvpf7A4wshhZtoPVyXioED7c33sDrJdMjFNqAx6gFp' },
        description: 'Old Mutual @ Blockchain Africa 2019 Conference'
    });
    count: number;

    checkIn() {
        // Ask the user for their address information
        // by using default disclosure behavior.
        this.uport.requestDisclosure({
            requested: ['name'],
            verified: ['SAFBC', 'OldMutual'],
            notifications: true
        });

        this.uport.onResponse('disclosureReq')
            .then(res => {
                const did = res.payload.did;
                const json = JSON.stringify(res.payload);
                const verified = res.payload.verified;
                console.log(res.payload);

                this.loggedin = true;
                this.msg = `Welcome Delegate, you are now logged in`;

                this.count = 0;

                if (verified.length === 0) {
                    console.log('SAFBC cred not issued yet');
                    // document.querySelector('#msg').innerHTML =
                    // document.querySelector('#msg').innerHTML +
                    this.msg = this.msg + '<br>I see you are eager to play the SSI Quest, but you must first please visit the SAFBC stand to start!';

                } else {
                    verified.forEach(element => {
                        console.log(++this.count);
                        if (undefined === element.claim.SAFBC) {
                            console.log('SAFBC cred not issued yet');
                            this.msg = this.msg + '<br>I see you are eager to play the SSI Quest, '
                            'but you must first please visit the SAFBC stand to start!';

                        } else {
                            if (undefined === element.claim.OldMutual) {
                                console.log('OldMutual cred not issued yet');
                                this.msg = this.msg + 
                                `<p>Thank you for visiting the Old Mutual stand.</p>
                                <p>You have been issued an attendance credential.<br/>
                                Please continue your quest for all the other credentials.</p>`;

                                // tslint:disable-next-line:prefer-const
                                let claimData = {
                                    'OldMutual': {
                                        'DelegateDID': res.payload.did,
                                        'AttendedOldMutual': true,
                                        'LastSeen': `${new Date()}`
                                    }
                                };

                                const a = Object.keys(claimData)[0];

                                // log the visit to firestore
                                const logData = {
                                    'user': res.payload,
                                    'OldMutual': claimData.OldMutual
                                };

                                this.logDelegate(logData);

                                this.uport.sendVerification({
                                    exp: Math.floor(new Date().getTime() / 1000) + 30 * 24 * 60 * 60,
                                    claim: claimData
                                }).then(() => {
                                    // msgDiv.innerHTML = msgDiv.innerHTML + '<br/>' +
                                    // `<button class="btn" onclick="logout()">Logout</button>`;
                                });
                            } else {
                                console.log('OldMutual cred already issued');
                                // msgDiv.innerHTML = msgDiv.innerHTML +
                                // `<p>Thank you for coming back to the Old Mutual stand.</p>
                                // <p>You have already been issued an attendance credential.<br>
                                // Please continue your quest for all the other credentials.</p>`;
                                // msgDiv.innerHTML = msgDiv.innerHTML + '<br/>' +
                                // `<button class="btn" onclick="logout()">Logout</button>`;
                            }
                        }

                    });
                }

            })
    }

    logout() {

        this.uport.logout();
        this.uport.reset();

        this.loggedin = false;

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
