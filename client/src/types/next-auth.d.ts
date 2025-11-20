import { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
        } & DefaultSession["user"];
        accessToken?: string;
    }

    interface User extends DefaultUser {
        accessToken?: string;
        refreshToken?: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id?: string;
        accessToken?: string;
        refreshToken?: string;
    }
}
