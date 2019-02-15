//////////////////////////////
//  Configure connect object
/////////////////////////////

const Connect = window.uportconnect
const uport = new Connect('Blockchain Academy SSI Quest')

function register() {
    //Ask the user for their address information
    //by using default disclosure behavior.
    uport.requestDisclosure({
        requested: ['name', 'email'],
        verified: ['SAFBC', 'BlockchainAcademy'],
        notifications: true
    })
    uport.onResponse('disclosureReq')
        .then(res => {
            const did = res.payload.did;
            json = JSON.stringify(res.payload);
            verified = res.payload.verified;
            console.log(res.payload);
            document.querySelector('#msg').innerHTML =
                `<p>Welcome ${res.payload.name}, you are now <b>logged in</b>.</p>`;

            count = 0;

            if (verified.length === 0) {
                console.log('SAFBC cred not issued yet');
                document.querySelector('#msg').innerHTML =
                    document.querySelector('#msg').innerHTML +
                    `<p>I see you are eager to play the SSI Quest, but you must first please visit the SAFBC stand to start!</p>`;

                document.querySelector('#msg').innerHTML = document.querySelector('#msg').innerHTML + '<br/>' +
                    `<button class="btn" onclick="logout('${res.payload.name}')">Logout</button>`;

            } else {
                verified.forEach(element => {
                    console.log(++count);
                    if (undefined === element.claim.SAFBC) {
                        console.log('SAFBC cred not issued yet');
                        document.querySelector('#msg').innerHTML =
                            document.querySelector('#msg').innerHTML +
                            `<p>I see you are eager to play the SSI Quest, but you must first please visit the SAFBC stand to start!</p>`;

                        document.querySelector('#msg').innerHTML = document.querySelector('#msg').innerHTML + '<br/>' +
                            `<button class="btn" onclick="logout('${res.payload.name}')">Logout</button>`;
                    } else {
                        if (undefined === element.claim.BlockchainAcademy) {
                            console.log('BlockchainAcademy cred not issued yet');
                            document.querySelector('#msg').innerHTML =
                                document.querySelector('#msg').innerHTML +
                                `<p>Thank you for visiting the Blockchain Academy stand ${res.payload.name}.<br/>You have been issued an attendance credential. Please continue your quest for all the other credentials.</p>`;

                            uport.sendVerification({
                                exp: Math.floor(new Date().getTime() / 1000) + 30 * 24 * 60 * 60,
                                claim: {
                                    'BlockchainAcademy': {
                                        'DelegateName': res.payload.name,
                                        'DelegateEmail': res.payload.email,
                                        'AttendedBlockchainAcademy': true,
                                        'LastSeen': `${new Date()}`
                                    }
                                }
                            }).then(() => {
                                document.querySelector('#msg').innerHTML = document.querySelector('#msg').innerHTML + '<br/>' +
                                    `<button class="btn" onclick="logout('${res.payload.name}')">Logout</button>`;
                            })
                        } else {
                            console.log('BlockchainAcademy cred already issued');
                            document.querySelector('#msg').innerHTML =
                                document.querySelector('#msg').innerHTML +
                                `<p>Thank you for coming back to the Blockchain Academy stand ${res.payload.name}.<br/>You have already been issued an attendance credential. Please continue your quest for all the other credentials.</p>`;
                            document.querySelector('#msg').innerHTML = document.querySelector('#msg').innerHTML + '<br/>' +
                                `<button class="btn" onclick="logout('${res.payload.name}')">Logout</button>`;
                        }
                    }

                });
            }

        })
}

function logout(name) {
    uport.logout();

    document.querySelector('#msg').innerHTML =
        `<p>Goodbye ${name}. You are logged out. </p>`;

    setTimeout(location.reload(), 2000);

}