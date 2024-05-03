import { UserDocument } from "api-calls/user/_user.type";

export interface UserSliceData {
  userMap: { [userId: string]: { loading: boolean; doc?: UserDocument } };
}

export interface UserSliceActions {
  loadUserDocument: (userId: string) => void;
  loadUserDocuments: (userIds: string[]) => void;
}

export type UserSlice = UserSliceData & UserSliceActions;
