"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { appLogin } from "@/app/redux/slices/authSlice";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const route = useRouter()
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  //  validation
  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(6, "At least 6 characters")
      .required("Password is required"),
  });

  const handleSubmit = async (values,{resetForm}) => {
    const result = await dispatch(appLogin(values));
    if(result.type === "auth/appLogin/fulfilled"){
      // Check if user role is admin and redirect accordingly
      const userRole = result.payload?.user?.role;
      if(userRole === "admin"){
        route.push("/admin");
      } else {
        route.push("/account");
      }
    }
    if (result.type === "auth/appLogin/rejected") {
      toast.error(result.payload);
      resetForm();
    }
  };

  return (
    <div className="py-16 px-6 bg-white text-gray-800">
      <div className="max-w-md mx-auto p-6 border rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Login</h1>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
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
                  className="text-red-600 text-sm mt-1"
                />
              </div>

              <div>
                <Field
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="w-full p-2 border rounded"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-600 text-sm mt-1"
                />
              </div>

              <button
                type="submit"
                disabled={loading || isSubmitting}
                className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </Form>
          )}
        </Formik>

        <p className="mt-4 text-center">
          Forgot your password?{" "}
          <a href="/home/forgot-password" className="text-blue-600 underline">
            Reset here
          </a>
        </p>

        <p className="mt-2 text-center">
          Don’t have an account?{" "}
          <a href="/home/signup" className="text-blue-600 underline">
            Sign up
          </a>
        </p>
      </div>

      <ToastContainer />
    </div>
  );
}
