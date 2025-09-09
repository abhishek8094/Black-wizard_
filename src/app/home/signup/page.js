"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { userRegistration } from "@/app/redux/slices/authSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  // validation
  const validationSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(2, "First Name must be at least 2 characters")
      .required("First Name is required"),
    lastName: Yup.string()
      .min(2, "Last Name must be at least 2 characters")
      .required("Last Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const handleSubmit = async (values,{ resetForm }) => {
    setLoading(true);
    try {
      const result = await dispatch(
        userRegistration({
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          password: values.password,
          role: "user",
        })
      ).unwrap();

      if (result.success === true) {
        router.push("/home/login")
        resetForm();
        toast.success("Account created successfully!");
      }
    } catch (error) {
      resetForm();
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16 p-6 bg-white text-gray-800">
      <div className="max-w-md mx-auto p-6 border rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Sign Up</h1>

        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            email: "",
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
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  className="w-full p-2 border rounded"
                />
                <ErrorMessage
                  name="firstName"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div>
                <Field
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  className="w-full p-2 border rounded"
                />
                <ErrorMessage
                  name="lastName"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

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
                  className="text-red-500 text-sm"
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
                  className="text-red-500 text-sm"
                />
              </div>

              <div>
                <Field
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
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
                className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 disabled:bg-gray-400"
              >
                {loading ? "Signing up..." : "Sign Up"}
              </button>
            </Form>
          )}
        </Formik>

        <p className="mt-4 text-center">
          Already have an account?{" "}
          <Link href="/home/login" className="text-blue-600 underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
