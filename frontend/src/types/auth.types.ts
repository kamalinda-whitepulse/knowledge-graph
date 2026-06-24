export type User = {
  userId: string;
  email: string;
};

export type AuthResponse = {
  access_token: string;
};

export type RegisterResponse = {
  message: string;
  userId: string;
};
