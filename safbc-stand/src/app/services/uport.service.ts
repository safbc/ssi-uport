import { Injectable } from '@angular/core';
import { Connect, SimpleSigner, MNID } from 'uport-connect';
// import { JWT } from 'uport';

import { BehaviorSubject, Observable } from 'rxjs';
import { SAFBCUser } from '../models/user.model';
import { LocalStorageService } from './local-storage.service';
import { ICredentials } from '../models/icredentials.model';

declare let window: any;

@Injectable({
  providedIn: 'root'
})
export class UportService {
  private web3: any;
  public network = 0;

  private _name = 'SAFBC BAC19';
  private _clientId = '2oyGuNMuW1aCoxELjbg5FgqjccZREeHwNzq';
  private _privateKey = 'bc10f80699eef7b564d47373eea7add5cf26de5ffdd20e38b38ed89c0b0f8030';
  private _networkName = 'rinkeby';

  private _userStorageKey = 'safbcCredToken';

  private _user: BehaviorSubject<SAFBCUser> = new BehaviorSubject<SAFBCUser>(new SAFBCUser());
  public readonly user$: Observable<SAFBCUser> = this._user.asObservable();

  private uport: any;

  constructor(private localStorageService: LocalStorageService) {
    this.initUport();
    if (this.localStorageService.has(this._userStorageKey)) {
      this.parseCachedUser();
    }
    window.addEventListener('load', (event) => {
      // this.web3 = this.uport.getWeb3();
    });
  }

  private initUport() {
    this.uport = new Connect(this._name, {
      clientId: this._clientId,
      network: this._networkName,
      signer: SimpleSigner(this._privateKey)
    });
  }

  /**
   * Checks localStorage for a previous login token
   */
  private async parseCachedUser() {
    const user = new SAFBCUser(JSON.parse(this.localStorageService.get(this._userStorageKey)));
    // Checking if uPort log in data is valid, if not the modal will pop up again
    // if (await this.verifyPushToken(user.pushToken)) {
    //   // @TODO: check expire
    //   this.uport.pushToken = user.pushToken;
    //   this.uport.publicEncKey = user.publicEncKey;
    //   this.uport.address = user.address;
    //   this.uport.firstReq = false;
    //   this._user.next(user);
    // } else {
    //   this.localStorageService.delete(this._userStorageKey);
    // }
  }

  // /**
  //  * This function is to verify cached tokens to ensure user object is valid according to uPort
  //  * @param pushToken User Pushtoken
  //  */
  // private async verifyPushToken(pushToken: string) {
  //   const topic = this.uport.topicFactory('access_token');
  //   const res = await JWT.verifyJWT(this.uport.credentials.settings, pushToken, topic.url);
  //   if (res) {
  //     if (new Date(<number>res.payload.exp * 1000).getTime() > Date.now()) {
  //       return true;
  //     }
  //   }
  //   return false;
  // }

  // /**
  //  * Returns a contract object based of provided ABI
  //  * @param artifacts Contract ABI to be converted
  //  */
  // public async artifactsToContract(artifacts) {
  //   if (!this.web3) {
  //     const delay = new Promise(resolve => setTimeout(resolve, 100));
  //     await delay;
  //     return await this.artifactsToContract(artifacts);
  //   }
  //   const contractAbstraction = this.web3.eth.contract(artifacts.abi);
  //   return contractAbstraction;

  // }

  /**
   * Returns current user session address
   */
  public getAddress(): string {
    return this._user.getValue().address;
  }

  // /**
  //  * Exposed checker to validate input address syntax
  //  * @param address string to check if valid eth address
  //  */
  // public isValidAddress(address: string): boolean {
  //   return this.web3.isAddress(address);
  // }

  // /**
  //  * uPort addresses are MNID encode, this provides a network specific address
  //  * @param _address uPort MNID encoded address to be converted to set network address
  //  */
  // public decodeMNID(_address: string) {
  //   const decoded = MNID.decode(_address);
  //   return decoded.address;
  // }

  // /**
  //  * Fires the uPort modal with hardcoded request parameters
  //  */
  // public async login() {
  //   await this.requestCredentials(['name', 'avatar', 'phone']);
  // }

  // public logout() {
  //   this.localStorageService.delete(this._userStorageKey);
  //   this._user.next(new SAFBCUser());
  //   this.initUport();
  // }

  // /**
  //  * Creates a request modal for the user to scan and submit credentials to this app
  //  * @param _requested Array of required fields to be requested from the user
  //  * @param _verified Array of attestations to be requested from the user
  //  */
  // private requestCredentials(_requested: string[] = null, _verified: string[] = null): Promise<any> {
  //   const req = {
  //     requested: _requested,
  //     verified: _verified,
  //     notifications: true
  //   };

  //   return new Promise((resolve, reject) => {
  //     this.uport.requestCredentials(req).then((credentials: ICredentials) => {
  //       const user = new SAFBCUser(this._user.getValue());
  //       user.MNID = credentials.networkAddress;
  //       user.avatar = credentials.avatar.uri;
  //       user.address = this.decodeMNID(credentials.networkAddress);
  //       user.name = credentials.name;
  //       user.phone = credentials.phone;
  //       user.publicEncKey = credentials.publicEncKey;
  //       user.pushToken = credentials.pushToken;
  //       this.localStorageService.set(this._userStorageKey, JSON.stringify(user));
  //       this._user.next(user);

  //       resolve();
  //     });
  //   });
  // }

  // /**
  //  * This checks for when a transaction is mined and returns a reciept at the end
  //  * @param txHash Transaction hash to query
  //  * @param interval Time delay between queries
  //  */
  // public getTransactionReceiptMined(txHash: string, interval: number = null) {
  //   // @TODO: error handling on rejection from uport
  //   const transactionReceiptAsync = (resolve, reject) => {
  //     this.web3.eth.getTransactionReceipt(txHash, (error, receipt) => {
  //       if (error) {
  //         reject(error);
  //       } else if (receipt == null) {
  //         setTimeout(
  //           () => transactionReceiptAsync(resolve, reject),
  //           interval ? interval : 500);
  //       } else {
  //         resolve(receipt);
  //       }
  //     });
  //   };

  //   if (Array.isArray(txHash)) {
  //     return Promise.all(txHash.map(
  //       oneTxHash => this.getTransactionReceiptMined(oneTxHash, interval)));
  //   } else if (typeof txHash === 'string') {
  //     return new Promise(transactionReceiptAsync);
  //   } else {
  //     throw new Error('Invalid Type: ' + txHash);
  //   }
  // }

  // public extractLogDataFromReceipt(_receipt: any, _topic: string) {
  //   // @TODO: get hash decoding funcions
  //   // @TODO: make general decode function
  // }

  // @TODO: Dislike this approach, need to refactor, issue is circular dependancy to have services do this directly
  /**
   * This is used to update the user object if external related data is updated in the model
   * @param _user new user model to overwrite existing state
   */
  public updateUserObject(_user: SAFBCUser) {
    this._user.next(_user);
  }
}
