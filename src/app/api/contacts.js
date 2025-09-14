import {
  getRequestWithToken,
  postRequestWithToken,
} from "./auth";

const API_ENDPOINTS = {
  CONTACTS: "/contacts",
  CONTACT_BY_ID: (id) => `/contacts/${id}`,
};

export const getContacts = async () => {
  try {
    const response = await getRequestWithToken(API_ENDPOINTS.CONTACTS);
    return response;
  } catch (error) {
    console.error("Get contacts failed:", error);
    throw error;
  }
};

export const addContact = async (contactData) => {
  try {
    const response = await postRequestWithToken(API_ENDPOINTS.CONTACTS, contactData);
    return response;
  } catch (error) {
    console.error("Add contact failed:", error);
    throw error;
  }
};

export const editContact = async (id, contactData) => {
  try {
    const response = await postRequestWithToken(API_ENDPOINTS.CONTACT_BY_ID(id), contactData);
    return response;
  } catch (error) {
    console.error("Edit contact failed:", error);
    throw error;
  }
};

export const deleteContact = async (id) => {
  try {
    // Assuming DELETE is handled via POST or GET, adjust if backend has DELETE
    const response = await postRequestWithToken(API_ENDPOINTS.CONTACT_BY_ID(id) + "/delete");
    return response;
  } catch (error) {
    console.error("Delete contact failed:", error);
    throw error;
  }
};
