export interface RegisterData {
  first_name: string;
  last_name: string;
  sexe?: string;
  email?: string;
  phone?: string;
  password: string;
}

export interface LoginData {
  identifier: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface AuthState {
  user: any | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}