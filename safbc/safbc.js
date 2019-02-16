//////////////////////////////
//  Configure connect object
/////////////////////////////

const Connect = window.uportconnect
const uport = new Connect('SAFBC SSI Quest')
const btnTable = document.querySelector('#tbl');
const msgDiv = document.querySelector('#msg');

function register() {
    //Ask the user for their address information
    //by using default disclosure behavior.
    uport.requestDisclosure({
        requested: ['name', 'email'],
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
                `<p>Welcome ${res.payload.name}, you are now <b>logged in</b>.</p>`;

            count = 0;
            SAFBC = false;

            if (verified.length === 0) {
                console.log('SAFBC cred not issued yet');
                msgDiv.innerHTML = msgDiv.innerHTML +
                    `<p>Thank you for visiting the SAFBC stand ${res.payload.name}.<br/>You have been issued an attendance credential. Please continue your quest for all the other credentials.</p>`;

                uport.sendVerification({
                    exp: Math.floor(new Date().getTime() / 1000) + 30 * 24 * 60 * 60,
                    claim: {
                        'SAFBC': {
                            'DelegateName': res.payload.name,
                            'DelegateEmail': res.payload.email,
                            'DelegateNumber': 'Get number from DB',
                            'LastSeen': `${new Date()}`
                        }
                    }
                }).then(() => {
                    msgDiv.innerHTML = msgDiv.innerHTML + '<br/>' +
                        `<button class="btn" onclick="logout('${res.payload.name}')">Logout</button>`;
                })
            } else {
                verified.forEach(element => {
                    console.log(++count);
                    if (undefined != element.claim.SAFBC) {
                        SAFBC = true;
                        console.log('SAFBC cred already issued');
                        msgDiv.innerHTML = msgDiv.innerHTML +
                            `<p>Thank you for visiting the SAFBC stand ${res.payload.name}.<br/>You have already been issued an attendance credential. Please continue your quest for all the other credentials.</p>`;
                        msgDiv.innerHTML = msgDiv.innerHTML + '<br/>' +
                            `<button class="btn" onclick="logout('${res.payload.name}')">Logout</button>`;
                    } else {
                        console.log('SAFBC cred not issued yet');
                        msgDiv.innerHTML = msgDiv.innerHTML +
                            `<p>Thank you for visiting the SAFBC stand ${res.payload.name}.<br/>You have been issued an attendance credential. Please continue your quest for all the other credentials.</p>`;

                        uport.sendVerification({
                            exp: Math.floor(new Date().getTime() / 1000) + 30 * 24 * 60 * 60,
                            claim: {
                                'SAFBC': {
                                    'DelegateName': res.payload.name,
                                    'DelegateEmail': res.payload.email,
                                    'DelegateNumber': 'Get number from DB',
                                    'LastSeen': `${new Date()}`
                                }
                            }
                        }).then(() => {
                            msgDiv.innerHTML = msgDiv.innerHTML + '<br/>' +
                                `<button class="btn" onclick="logout('${res.payload.name}')">Logout</button>`;
                        })
                    }

                });
            }



        })
}

function verify() {
    //Ask the user for their address information
    //by using default disclosure behavior.
    uport.requestDisclosure({
        requested: ['name', 'email'],
        verified: ['SAFBC', 'OldMutual', 'VALR', 'BlockchainAcademy'],
        notifications: true
    })

    uport.onResponse('disclosureReq')
        .then(res => {
            const did = res.payload.did;
            json = JSON.stringify(res.payload);
            verified = res.payload.verified;
            console.log(res.payload);
            btnTable.parentNode.removeChild(btnTable);
            document.querySelector('#msg').innerHTML =
                `<p>Hi ${res.payload.name}, you are now <b>logged in</b>.</p>`;

            count = 0;
            SAFBC = false;
            OldMutual = true;
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

                if (SAFBC && VALR && BlockchainAcademy && !gift) {
                    document.querySelector('#msg').innerHTML =
                        `<p>Congratulations ${res.payload.name}, you have completed the quest!.</br>Issuing your gift now!</p>`;

                    uport.sendVerification({
                        exp: Math.floor(new Date().getTime() / 1000) + 30 * 24 * 60 * 60,
                        claim: {
                            'GiftRedeemed': {
                                'redeemerName': res.payload.name,
                                'redeemerEmail': res.payload.email,
                                'redeemedDate': `${new Date()}`
                            }
                        }
                    }).then(() => {
                        msgDiv.innerHTML = msgDiv.innerHTML + '<br/>' +
                            `<button class="btn" onclick="logout('${res.payload.name}')">Logout</button>`;
                    })
                } else if (!gift && (!SAFBC || !VALR || !BlockchainAcademy)) {
                    document.querySelector('#msg').innerHTML =
                        `<p>Get back out there ${res.payload.name}. You have not yet completed the quest!.</br>Good hunting!</p>`;
                    msgDiv.innerHTML = msgDiv.innerHTML + '<br/>' +
                        `<button class="btn" onclick="logout('${res.payload.name}')">Logout</button>`;
                    // logout(res.payload.name);

                } else if (gift) {
                    document.querySelector('#msg').innerHTML =
                        `<p>Congratulations ${res.payload.name} on completing the quest!.</br>Your gift has already been issued so enjoy it!</p>`;
                    msgDiv.innerHTML = msgDiv.innerHTML + '<br/>' +
                        `<button class="btn" onclick="logout('${res.payload.name}')">Logout</button>`;
                    // logout(res.payload.name);
                }
            });

        })
}

function logout(name) {

    uport.logout();
    uport.reset();

    document.querySelector('#msg').innerHTML =
        `<p>Goodbye ${name}. You are logged out. </p>`;

    setTimeout(location.reload(), 2000);


}