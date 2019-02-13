import {
  Credentials
} from "uport-credentials"

const uport = new Credentials({
  network: "mainnet",
  did: "did:ethr:0xa728976f1df7b67bcfaec88a68d74904329a3456",
  privateKey: "3d4fae2b4ceb517249768defe300eacb0be71a81fd6302f61fa713024d67a358"
})

uport.createDisclosureRequest({
  notifications: true,
  callbackUrl: endpoint + '/callback',
  vc: ['/ipfs/QmbaibXT1w6gWxDcdXSPntHzhskjNDGAgDw2Fp1StWu8Qj']
}).then(requestToken => {
  console.log(requestToken);
})