import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import axios from "axios";
import { LoginFormData } from "../interfaces";
export const useLogin = () => {
    const [error, setError] = useState<boolean>(false);
    const [isLoading, setisLoading] = useState<boolean>(false);
    const [isSucess, setisSucess] = useState<boolean>(false);
    const { dispatch } = useAuthContext();

    const login = async ({email,password}:LoginFormData) => {
        setisLoading(true);
        setError(false);
        try {
            const response = await axios.post(
              `${import.meta.env.VITE_API}/api/auth/login`,
              {
                email,
                password,
              }
            );
            localStorage.setItem("user", JSON.stringify(response.data));
            dispatch({type:"LOGIN", payload:response.data});
            setisSucess(true);
            setisLoading(false);
        } catch (error) {
          console.error("Login error:", error);
          setError(true); 
          setisSucess(false);
          setisLoading(false); 
        }
        
    }

    return { login, error, isLoading, isSucess };
}