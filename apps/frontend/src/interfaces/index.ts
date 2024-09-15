import { ReactNode } from "react";

export interface State {
  user: User | null;
}

export interface User {
  message?: string;
  success?: boolean;
  token?: string;
  email?: string;
  role?: string;
  id?: string;
}

export interface Action {
  type: string;
  payload?: unknown;
}

export interface AuthContextProviderProps {
  children: ReactNode;
}

export interface NavbarItems {
    href: string;
    tags: string;
    closeNav?: () => void;
  }
  
  export interface RegisterFormData {
    name: string;
    email: string;
    password: string;
  }
  export interface LoginFormData {
    email: string;
    password: string;
  }
  
//   export interface User {
//     _id: string;
//     name: string;
//     email: string;
//     password?: string;
//     role?: string;
//     createdAt?: string;
//     updatedAt?: string;
//     __v?: number;
//   }
  

  export interface State {
    user: User | null;
  }