export interface RegisterUserDto {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}