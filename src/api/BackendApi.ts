import axiosInstance from "../services/axiosinstance";
import axios from "axios";

export const registerUser = (userData:any) => {
  return axiosInstance.post("auth/register", userData);
};

export const getPackages = () => {
  return axiosInstance.get("/packages");
};
