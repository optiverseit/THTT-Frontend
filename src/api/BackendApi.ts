import axiosInstance from "../services/axiosinstance";
import axios from "axios";

export const registerUser = (userData:any) => {
  return axiosInstance.post("auth/register", userData);
};

export const loginUser = (loginData:any) => {
    return axiosInstance.post("/auth/login", loginData);
};

export const googleLogin = (idToken:any) => {
    return axiosInstance.post("/auth/google", {
        id_token: idToken,
    });
};

export const getPackages = () => {
  return axiosInstance.get("api/packages");
};
