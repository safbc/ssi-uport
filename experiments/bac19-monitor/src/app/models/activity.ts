export interface Activity {
    user: User;
    SAFBC?: Stand;
    VALR?: Stand;
    OldMutual?: Stand;
    BlockchainAcademy?: Stand;
}


export interface User {
    did: string;
    boxPub: string;
    name: any;
    pushToken: string;
    verified: [any];
    invalid: [any];
    publicEncKey: string;
    timestamp: string;
    trace: string;

    SAFBC?: Stand;
    VALR?: Stand;
    OldMutual?: Stand;
    BlockchainAcademy?: Stand;
}

export interface Stand {
    DelegateDID?: string;
    LastSeen: string;
    AttendedSAFBC?: boolean;
    AttendedVALR?: boolean;
    AttendedOldMutual?: boolean;
    AttendedBlockchainAcademy?: boolean;
}
