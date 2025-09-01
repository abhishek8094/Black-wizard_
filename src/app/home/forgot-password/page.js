"use client";

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { forgotPassword } from "@/app/redux/slices/authSlice";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const route = useRouter()
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    setLoading(true);
    try {
      const result = await dispatch(
        forgotPassword({ email: values.email })
      ).unwrap();
     
      if (result.success === true) {
        localStorage.setItem("resetToken", result.resetToken);
        route.push("/home/reset-password")
        toast.success("Password reset email sent! Check your inbox.");
      }

      resetForm();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to send reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16 px-6 text-gray-800 bg-white">
      <div className="max-w-md mx-auto p-6 border rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
        <p className="text-gray-600 mb-4">
          Enter your email address 
        </p>

        <Formik
          initialValues={{ email: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form className="space-y-4">
              <div>
                <Field
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-full p-2 border rounded"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Sending..." : "Submit"}
              </button>
            </Form>
          )}
        </Formik>

        <p className="mt-4 text-center">
          Remember your password?{" "}
          <a href="/home/login" className="text-blue-600 underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}
