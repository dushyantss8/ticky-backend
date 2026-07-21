export type User = {
  id: number;
  email: string;
  role: string;
  createdAt: Date;
};

export type DBUserRow = {
  id: string;
  email: string;
  role: string;
  created_at: Date;
};

export type DBUserWithPasswordRow = DBUserRow & {
  password_hash: string;
};

export type TokenPayload = {
  userId: string;
  email: string;
  role: string;
};