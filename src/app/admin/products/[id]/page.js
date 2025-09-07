"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useParams } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { getProductById, updateProduct } from "@/app/redux/slices/productSlice";

export default function EditProduct() {
  const { userData } = useSelector((state) => state.auth);
  const { productData, loading } = useSelector((state) => state.product);
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    if (!userData || userData.user.role !== "admin") {
      router.push("/home/login");
      return;
    }
    dispatch(getProductById(id));
  }, [userData, dispatch, router, id]);

  if (!userData || userData.user.role !== "admin") return null;

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    price: Yup.number().required("Price is required"),
    description: Yup.string().required("Description is required"),
  });

  const handleSubmit = async (values) => {
    const result = await dispatch(updateProduct({ id, ...values }));
    if (result.type === "product/updateProduct/fulfilled") {
      router.push("/admin/products");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="py-16 px-6 bg-gray-100 min-h-screen">
      <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-700">Edit Product</h1>
          <button
            onClick={() => router.back()}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Back
          </button>
        </div>
        <Formik
          initialValues={{
            name: productData?.name || "",
            price: productData?.price || "",
            description: productData?.description || "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          <Form className="space-y-4 text-gray-700">
            <div>
              <Field name="name" placeholder="Product Name" className="w-full p-2 border rounded" />
              <ErrorMessage name="name" component="div" className="text-red-600 text-sm mt-1" />
            </div>
            <div>
              <Field name="price" type="number" placeholder="Price" className="w-full p-2 border rounded" />
              <ErrorMessage name="price" component="div" className="text-red-600 text-sm mt-1" />
            </div>
            <div>
              <Field name="description" as="textarea" placeholder="Description" className="w-full p-2 border rounded" />
              <ErrorMessage name="description" component="div" className="text-red-600 text-sm mt-1" />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
              Update Product
            </button>
          </Form>
        </Formik>
      </div>
    </div>
  );
}
