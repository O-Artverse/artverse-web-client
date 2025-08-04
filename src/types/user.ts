export interface LoginPostDto {
  email: string;
  password: string;
}

export interface RegisterPostDto {
  email: string;
  password: string;
  birthdate: string;
}

export interface GoogleAuthCallback {
  access_token: string;
  refresh_token: string;
  user_id: string;
  error?: string;
} 