import { IUser } from "./IUser";
import { Role } from "../auth/auth.enum";

export class User implements IUser{
    constructor(public _id = '',
        public username = '',
        public password = '',
        public name = '',
        public company = '',
        public role = Role.None,
        public contact = '',
        public isActive = true,
        public jwtToken = ''
    ) {}

    static Build(user: IUser) {
        if (!user) {
            return new User()
        }
        return new User(
            user._id,
            user.username,
            user.password,
            user.name,
            user.company,
            user.role as Role,
            user.contact,
            user.isActive,
            user.jwtToken
        )
    }
    toJSON(): object {
        const serialized = Object.assign(this);
        delete serialized._id
        return serialized
    }
}

export class UserChat {
    id?: string;
    name?: string;
    company?: string;
    role?: string;
}