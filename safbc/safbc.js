//////////////////////////////
//  Configure connect object
/////////////////////////////

const Connect = window.uportconnect
const uport = new Connect('SAFBC SSI Quest', {
    network: "mainnet",
    profileImage: {
        "/": "/ipfs/QmaAroK3Mrxzi2rpTKvLyfGfWfAnNGNKrKpQXmwWg2F54b"
    },
    bannerImage: {
        "/": "/ipfs/QmWeN9UFxU5mKWzuEXKuJTcPECkDa8MCJo95rCTGAchDQW"
    },
    description: "SAFBC Stand @ Blockchain Africa 2019 Conference"
});

/**
 * @description Login and register the delegate as attending the booth.
 * @author G de Beer
 * @date 2019-02-17
 */
function register() {
    const btnTable = document.querySelector('#tbl');
    const msgDiv = document.querySelector('#msg');

    //Ask the user for their address information
    //by using default disclosure behavior.
    uport.requestDisclosure({
        requested: ['name'],
        verified: ['SAFBC'],
        notifications: true
    })
    uport.onResponse('disclosureReq')
        .then(res => {
            const did = res.payload.did;
            json = JSON.stringify(res.payload);
            verified = res.payload.verified;
            console.log(res.payload);

            btnTable.parentNode.removeChild(btnTable);

            msgDiv.innerHTML =
                `<p>Welcome delegate, you are now logged in</p>`;

            count = 0;
            SAFBC = false;

            if (verified.length === 0) {
                console.log('SAFBC cred not issued yet');
                msgDiv.innerHTML = msgDiv.innerHTML +
                    `<p>Thank you for visiting the SAFBC stand.</p>
                    <p>You have been issued an anonymous attendance credential.<br/>
                    Please continue your quest for all the other credentials.</p>`;

                let claimData = {
                    'SAFBC': {
                        'DelegateDID': res.payload.did,
                        'AttendedSAFBC': true,
                        'LastSeen': `${new Date()}`
                    }
                }

                // log the visit to firestore
                let logData = {
                    'user': res.payload,
                    'SAFBC': claimData.SAFBC
                }
                logDelegate(logData);

                uport.sendVerification({
                    exp: Math.floor(new Date().getTime() / 1000) + 30 * 24 * 60 * 60,
                    claim: claimData
                }).then(() => {
                    msgDiv.innerHTML = msgDiv.innerHTML + '<br/>' +
                        `<button class="btn" onclick="logout()">Logout</button>`;
                })
            } else {
                verified.forEach(element => {
                    console.log(++count);
                    if (undefined != element.claim.SAFBC) {
                        SAFBC = true;
                        console.log('SAFBC cred already issued');
                        msgDiv.innerHTML = msgDiv.innerHTML +
                            `<p>Thank you for visiting the SAFBC stand Delegate.<br/>You have already been issued an attendance credential. Please continue your quest for all the other credentials.</p>`;
                        msgDiv.innerHTML = msgDiv.innerHTML + '<br/>' +
                            `<button class="btn" onclick="logout()">Logout</button>`;
                    } else {
                        console.log('SAFBC cred not issued yet');
                        msgDiv.innerHTML = msgDiv.innerHTML +
                            `<p>Thank you for visiting the SAFBC stand Delegate.</p>
                        <p>You have been issued an anonymous attendance credential.<br/> Please continue your quest for all the other credentials.</p>`;

                        let claimData = {
                            'SAFBC': {
                                'DelegateDID': res.payload.did,
                                'AttendedSAFBC': true,
                                'LastSeen': `${new Date()}`
                            }
                        }

                        // log the visit to firestore
                        let logData = {
                            'user': res.payload,
                            'claim': claimData
                        }
                        logDelegate(logData);

                        uport.sendVerification({
                            exp: Math.floor(new Date().getTime() / 1000) + 30 * 24 * 60 * 60,
                            claim: claimData
                        }).then(() => {
                            msgDiv.innerHTML = msgDiv.innerHTML + '<br/>' +
                                `<button class="btn" onclick="logout('${res.payload.name}')">Logout</button>`;
                        })
                    }

                });
            }



        })
}

/**
 * @description Verify id delegate has met requirement for receiving the reward.
 * @author G de Beer
 * @date 2019-02-17
 */
function verify() {
    const btnTable = document.querySelector('#tbl');
    const msgDiv = document.querySelector('#msg');
    //Ask the user for their address information
    //by using default disclosure behavior.
    uport.requestDisclosure({
        requested: ['name', 'email'],
        verified: ['SAFBC', 'OldMutual', 'VALR', 'BlockchainAcademy', 'GiftRedeemed'],
        notifications: true
    })

    uport.onResponse('disclosureReq')
        .then(res => {
            const did = res.payload.did;
            json = JSON.stringify(res.payload);
            verified = res.payload.verified;
            console.log(res.payload);
            btnTable.parentNode.removeChild(btnTable);
            msgDiv.innerHTML = `<p>Hi ${res.payload.name}, you are now <b>logged in</b>.</p>`;

            count = 0;
            SAFBC = false;
            OldMutual = false;
            VALR = false;
            BlockchainAcademy = false;
            gift = false;

            verified.forEach(element => {
                console.log(++count);
                if (undefined != element.claim.SAFBC) {
                    SAFBC = true;
                }
                if (undefined != element.claim.OldMutual) {
                    OldMutual = true;
                }
                if (undefined != element.claim.VALR) {
                    VALR = true;
                }
                if (undefined != element.claim.BlockchainAcademy) {
                    BlockchainAcademy = true;
                }
                if (undefined != element.claim.GiftRedeemed) {
                    gift = true;
                }

                // TODO: Must validate as well aginst database in case user deletes local store of credentials.

                if (SAFBC && VALR && OldMutual && BlockchainAcademy && !gift) {
                    msgDiv.innerHTML = `<p>Congratulations ${res.payload.name}, you have completed the quest!.</br>Issuing your gift now!</p>`;

                    let claimData = {
                        'GiftRedeemed': {
                            'redeemerName': res.payload.name,
                            'redeemerEmail': res.payload.email,
                            'redeemerDID': res.payload.did,
                            'GotGift': true,
                            'redeemedDate': `${new Date()}`
                        }
                    }

                    // log the visit to firestore
                    let logData = {
                        'user': res.payload,
                        'claim': claimData
                    }
                    logDelegate(logData);

                    uport.sendVerification({
                        exp: Math.floor(new Date().getTime() / 1000) + 300 * 24 * 60 * 60,
                        claim: claimData
                    }).then(() => {
                        msgDiv.innerHTML = msgDiv.innerHTML + '<br/>' +
                            `<button class="btn" onclick="logout()">Logout</button>`;
                    })
                } else if (!gift && (!SAFBC || !VALR || !BlockchainAcademy)) {
                    msgDiv.innerHTML =
                        `<p>Get back out there Delegate.<br/>
                        You have not yet completed the quest so keep hunting!</p>`;
                    msgDiv.innerHTML = msgDiv.innerHTML + '<br/>' +
                        `<button class="btn" onclick="logout()">Logout</button>`;

                } else if (gift) {
                    msgDiv.innerHTML =
                        `<p>Congratulations ${res.payload.name} on completing the quest!.</br>Your gift has already been issued so enjoy it!</p>`;
                    msgDiv.innerHTML = msgDiv.innerHTML + '<br/>' +
                        `<button class="btn" onclick="logout()">Logout</button>`;
                }
            });

        })
}

/**
 * @description Log the user out and clear session data.
 * @author G de Beer
 * @date 2019-02-17
 */
function logout() {

    uport.logout();
    uport.reset();

    document.querySelector('#msg').innerHTML =
        `<p>Goodbye... </p>`;

    setTimeout(location.reload(), 2000);

}

/**
 * @description Log the delegate activity to firestore via cloud function.
 * @author G de Beer
 * @date 2019-02-17
 * @param {*} visitor uPort claim data
 */
function logDelegate(visitor) {
    var xhr = new XMLHttpRequest();
    var data = JSON.stringify(visitor);
    xhr.onreadystatechange = function () {
        if (this.readyState == 4) {
            console.log('XHR request completed. ', this.responseText);
        }
    };
    xhr.open("POST", "https://us-central1-veritydemo1.cloudfunctions.net/function-1");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(data);
}