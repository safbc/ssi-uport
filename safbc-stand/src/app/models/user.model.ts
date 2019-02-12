// NOTES: TypeScript unable to correctly parse boolean, always treats as string
export class SAFBCUser {
  public name = '';
  public avatar = '';
  public address = '';
  public MNID = '';
  public phone = '';
  public email = '';
  public isAdmin = false;
  public isRegistered = false;
  public hasAttended = false;
  public isPaid = false;
  public balance = -1;
  public issued = -1;
  public publicEncKey = '';
  public pushToken = '';

  public constructor(init?: Partial<SAFBCUser>) {
    Object.assign(this, init);
  }
}
