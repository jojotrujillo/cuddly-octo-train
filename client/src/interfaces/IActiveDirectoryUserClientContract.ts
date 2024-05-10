export class IActiveDirectoryUserClientContract {
    userId: string;
    firstName: string;
    lastName: string;
    email: string; // Mapped to UPN
    pernr: string;
    businessPhone: string;
    mobilePhone: string;
    email2: string; // Mapped to mail

    constructor(
        userId: string,
        firstName: string,
        lastName: string,
        email: string,
        pernr: string,
        businessPhone: string,
        mobilePhone: string,
        email2: string
    ) {
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.pernr = pernr;
        this.businessPhone = businessPhone;
        this.mobilePhone = mobilePhone;
        this.email2 = email2;
    }
}
