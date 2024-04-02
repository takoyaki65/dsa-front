export type UserBase = {
    username: string;
    is_admin: boolean;
    disabled: boolean;
}

export type User = UserBase & {
    id: number;
    created_at: string | null;
    updated_at: string | null;
    active_start_date: string | null;
    active_end_date: string | null;
}

export type LoginCredentials = {
    username: string;
    password: string;
}

export type CreateUser = {
    username: string;
    password: string;
    is_admin: boolean;
    disabled: boolean;
    created_at?: string | null;
    updated_at?: string | null;
    active_start_date?: string | null;
    active_end_date?: string | null;
    // auth_code: string;
}

export type UserDelete = {
    user_ids: number[];
}

