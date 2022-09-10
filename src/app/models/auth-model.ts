export interface MutableAuthModel {
  userId: string;
  firstName: string;
  lastName: string;
  nickName: string;
  aboutMySelf?: string;
  email: string;
  mainPhotoUrl?: string | null;
  dateOfBirth: string;
  hasAddressInfo: boolean;
  gender: string;
  city?: string;
  street?: string;
  state?: string;
  country?: string;
}

export type AuthModel = Readonly<MutableAuthModel>;
