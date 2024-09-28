export type UserBase = {
    student_id: string;
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
    user_id: string;
    password: string;
}

export type CreateUser = {
    student_id: string;
    username: string;
    email: string;
    password: string;
    is_admin: boolean;
    disabled: boolean;
    created_at?: string | null;
    updated_at?: string | null;
    active_start_date?: string | null;
    active_end_date?: string | null;
}

export type UserDelete = {
    user_ids: number[];
}

