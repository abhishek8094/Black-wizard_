"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { resetPassword } from "@/app/redux/slices/authSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function ResetPasswordPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  // ✅ Yup validation schema
  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  // ✅ Handle password reset with Redux
  const handleSubmit = async (values) => {
  

    setLoading(true);
    try {
      const result = await dispatch(
        resetPassword({
          password: values.password,
        })
      ).unwrap();

      if (result.success === true) {
        toast.success("Password reset successfully!");
        localStorage.removeItem("resetToken"); 
        router.push("/home/login"); 
      }
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error(error?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16 p-6 bg-white text-gray-800">
      <div className="max-w-md mx-auto p-6 border rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
        <p className="text-gray-600 mb-4">
          Enter your new password below.
        </p>

        <Formik
          initialValues={{
            password: "",
            confirmPassword: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <Field
                  type="password"
                  name="password"
                  placeholder="New Password"
                  className="w-full p-2 border rounded"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div>
                <Field
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm New Password"
                  className="w-full p-2 border rounded"
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading ? "Resetting..." : "Reset Password"}
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
