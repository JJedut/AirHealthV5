export interface UserModel {
  id: number;
  userId: string;
  userName: string;
  passwordHash: string;
  created: Date;
  isAdmin: boolean;
}
