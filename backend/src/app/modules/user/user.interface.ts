// Fields that are safe to send to the client (never the password hash)
export const userSafeSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
} as const;

export interface ICreateStudentPayload {
  name: string;
  email: string;
  password: string;
}