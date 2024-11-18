export interface ApiKeyModel {
  id: number;
  keyName: string;
  keyId: string;
  key: string;
  userId: number;
  createdOn: Date;
  expiresOn: Date;
  isActive: boolean;
}
