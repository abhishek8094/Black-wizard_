import axios from "axios";
import Cookies from "js-cookie";
import { BASE_URL } from "../constant/constant";


export const setToken = (token) => {
  if (token && typeof window !== "undefined") {
    Cookies.set("token", token, {
      expires: 7,
      secure: true,
      sameSite: "Strict",
    });
  }
};

export const doLogin = (data) => {
  if (data?.data === undefined) return false;
  const userData = data.data;
  const emailId = userData?.Email;
  return true;
};

export const doLogout = () => {
 localStorage?.clear();
  Cookies?.remove("token");
};

export const getToken = () => {
  const token = Cookies.get("token");
  return token ? token : null;
};


export const getRequest = async (endpoint) => {
  try {
    const response = await axios.get(`${BASE_URL}${endpoint}`);
    return response.data;
  } catch (error) {
    console.error(" API Call Failed:", error);
    throw error;
  }
};


export const getRequestWithToken = async (endpoint) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("No token found");
    }

    const response = await axios.get(`${BASE_URL}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(" API Call Failed:", error);
    throw error;
  }
};


export const postRequestWithToken = async (endpoint, data) => {
  try {
    const token = getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axios.post(`${BASE_URL}${endpoint}`, data, {
      headers,
    });

    return response.data;
  } catch (error) {
    console.error(" API Call Failed:", error);
    throw error;
  }
};

export const getRequestWithTokenAndWithoutData = async (endpoint) => {
  try {
    const token = getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axios.get(`${BASE_URL}${endpoint}`, {
      headers,
    });

    return response.data;
  } catch (error) {
    console.error(" API Call Failed:", error);
    throw error;
  }
};