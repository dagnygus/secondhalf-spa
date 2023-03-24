export interface MutableMemberModel {
  userId: string;
  firstName: string;
  lastName: string;
  nickName: string;
  email: string;
  gender: string;
	aboutMySelf?: string;
	dateOfBirth: string;
  isActive: boolean;
  createdAt: string;
  mainPhotoUrl?: string | null;
  liked?: boolean;
  city?: string | null;
  street?: string | null;
  state?: string | null;
  country?: string | null;
}

export type MemberModel = Readonly<MutableMemberModel>;
