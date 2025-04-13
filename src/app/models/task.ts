import { IUser } from "./user";

export interface ITask{
    id?: number, 
    name: string, 
    state: State,
    userId: Number
    userName: String
}

export enum State{
    Todo = "Pendiente",
    InProgress = "En progreso",
    Done = "Completada"
}