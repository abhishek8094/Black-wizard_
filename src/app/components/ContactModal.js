import React from "react";
import { useDispatch } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { createContact, updateContact } from "../redux/slices/contactSlice";
import { toast } from "react-toastify";

const ContactModal = ({ isOpen, onClose, contact }) => {
  const dispatch = useDispatch();

  // Validation schema
  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Name is required")
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be less than 100 characters"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    subject: Yup.string()
      .required("Subject is required")
      .min(5, "Subject must be at least 5 characters")
      .max(200, "Subject must be less than 200 characters"),
    message: Yup.string()
      .required("Message is required")
      .min(10, "Message must be at least 10 characters")
      .max(1000, "Message must be less than 1000 characters")
  });

  // Initial values
  const initialValues = {
    name: contact?.name || "",
    email: contact?.email || "",
    subject: contact?.subject || "",
    message: contact?.message || "",
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      if (contact) {
        // Update existing contact
        const result = await dispatch(
          updateContact({ id: contact._id, data: values })
        );
        if (updateContact.fulfilled.match(result)) {
          toast.success("Contact updated successfully");
          resetForm();
          onClose();
        }
      } else {
        // Create new contact
        const result = await dispatch(createContact(values));
        if (createContact.fulfilled.match(result)) {
          toast.success("Contact created successfully");
          resetForm();
          onClose();
        }
      }
    } catch (error) {
      toast.error("Failed to save contact");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-bold mb-4">
          {contact ? "Edit Contact" : "Add Contact"}
        </h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Name *
                </label>
                <Field
                  type="text"
                  name="name"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Email *
                </label>
                <Field
                  type="email"
                  name="email"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Subject *
                </label>
                <Field
                  type="text"
                  name="subject"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="subject" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Message *
                </label>
                <Field
                  as="textarea"
                  name="message"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500 h-24"
                />
                <ErrorMessage name="message" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Saving..." : contact ? "Update" : "Create"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ContactModal;
