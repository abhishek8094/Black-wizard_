import {
  getRequestWithToken,
  postRequestWithToken,
  getRequestWithTokenAndWithoutData,
} from "./auth";

const API_ENDPOINTS = {
  USERS: "/auth/users",
  USER_BY_ID: (id) => `/auth/users/${id}`,
};

export const getUsers = async () => {
  try {
    const response = await getRequestWithToken(API_ENDPOINTS.USERS);
    return response;
  } catch (error) {
    console.error("Get users failed:", error);
    throw error;
  }
};

export const addUser = async (userData) => {
  try {
    const response = await postRequestWithToken(API_ENDPOINTS.USERS, userData);
    return response;
  } catch (error) {
    console.error("Add user failed:", error);
    throw error;
  }
};

export const editUser = async (id, userData) => {
  try {
    const response = await postRequestWithToken(API_ENDPOINTS.USER_BY_ID(id), userData);
    return response;
  } catch (error) {
    console.error("Edit user failed:", error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    // Assuming DELETE is handled via POST or GET, adjust if backend has DELETE
    const response = await postRequestWithToken(API_ENDPOINTS.USER_BY_ID(id) + "/delete");
    return response;
  } catch (error) {
    console.error("Delete user failed:", error);
    throw error;
  }
};
