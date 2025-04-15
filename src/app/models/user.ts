export interface IUser{
    id?: number, 
    name: string, 
    password: string, 
    role: Role, 
    email: string
}

export enum Role{
    Admin = "Admin",
    User = "User"
}