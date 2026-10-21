import type { Role } from "./enum.interface";

export interface IUser {
    id: string;
    name: string;
    email: string;
    role: Role;
    createdAt: string;
}
