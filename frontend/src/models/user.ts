export interface User {
  _id: string;
  fullName: string;
  username: string;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}