export interface IAvatar {
  uri: string;
}

export interface ICredentials {
  '@context': string;
  '@type': string;
  address: string;
  avatar: IAvatar;
  name: string;
  networkAddress: string;
  phone: string;
  publicEncKey: string;
  publicKey: string;
  pushToken: string;
}
