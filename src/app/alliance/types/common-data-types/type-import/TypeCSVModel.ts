export class TypeCSVRecord {

  public isCustomer: any;
  public isBillTo: any;
  public isConsignee : any;
  public isShipper: any;
  public isBroker: any;
  public isForwarder: any;
  public isTerminal: any;
  public active: any;

  public mcId: any;
  public ediId: any;
  public notes: any;
  public email: any;
  public officeHours: any;
  public contactPersons: any;

  public location: {
    "id": any,
    "name": any,
    "extendedNotes":any,
    "address1": any,
    "zip": any,
    "state": any,
    "city": any,
    "country": any,
    "phone": any,
    "fax": any,
    "contact": any,
    "cell": any,
    "appt": any,
    "externalId": any
  }
}
