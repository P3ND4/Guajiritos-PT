import { IUser } from "./user";

export interface ITask{
    id: number, 
    name: string, 
    state: State,
    user: IUser
}

enum State{
    Todo = "Todo",
    InProgress = "InProgress",
    Done = "Done"
}