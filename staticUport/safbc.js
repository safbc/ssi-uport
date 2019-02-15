//////////////////////////////
//  Configure connect object
/////////////////////////////

const Connect = window.uportconnect
const uport = new Connect('SAFBC SSI Quest')

function login() {

    //Ask the user for their address information
    //by using default disclosure behavior.
    uport.requestDisclosure({
        requested: ['name', 'email'],
        verified: ['standSAFBC', 'Stand1', 'Stand2', 'Stand3'],
        notifications: true
    })

    uport.onResponse('disclosureReq')
        .then(res => {
            const did = res.payload.did;
            json = JSON.stringify(res.payload);
            verified = res.payload.verified;
            console.log(res.payload);
            document.querySelector('#msg').innerHTML =
                `<p>Congratulations ${res.payload.name}, you are now <b>logged in</b>.</p>`;

            count = 0;
            standSAFBC = false;
            stand1 = true;
            stand2 = false;
            stand3 = false;
            gift = false;

            verified.forEach(element => {
                console.log(++count);
                if (undefined != element.claim.SAFBCStand) {
                    standSAFBC = true;
                }
                if (undefined != element.claim.Stand1) {
                    stand1 = true;
                }
                if (undefined != element.claim.Stand2) {
                    stand2 = true;
                }
                if (undefined != element.claim.Stand3) {
                    stand3 = true;
                }
                if (undefined != element.claim.GiftRedeemed) {
                    stand3 = true;
                }

                if (stand1 && stand2 && stand3 && !gift) {
                    document.querySelector('#msg').innerHTML =
                        document.querySelector('#msg').innerHTML +
                        `<p>Congratulations ${res.payload.name}, you have completed the quest!.</br>Issuing your gift now!`;

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
                        uport.logout();
                    })
                } else if (!gift && (!Stand1 || !Stand2 || !Stand3)) {
                    document.querySelector('#msg').innerHTML =
                        document.querySelector('#msg').innerHTML +
                        `<p>Get back out there ${res.payload.name}, you have not yet completed the quest!.</br>Good hunting!`;
                    uport.logout();

                } else if (gift) {
                    document.querySelector('#msg').innerHTML =
                        document.querySelector('#msg').innerHTML +
                        `<p>Congratulations ${res.payload.name} on completing the quest!.</br>Your gift has already been issued so enjoy!`;
                    uport.logout();
                }
            });




        })
}

function logout() {


}