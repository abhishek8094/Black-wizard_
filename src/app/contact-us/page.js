"use client";
import React from "react";
import { useDispatch } from "react-redux";
import { createContact } from "@/app/redux/slices/contactSlice";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

const  ContactUs = () => {
  const dispatch = useDispatch();

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required("Name is required")
      .min(5, "Name must be at least 5 characters")
      .matches(/^[a-zA-Z0-9\s]*$/, "Only letters, numbers and spaces are allowed")
      .test('no-html', 'HTML tags are not allowed', value => {
        return !/<[^>]*>/g.test(value);
      }),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required")
      .test('no-html', 'HTML tags are not allowed', value => {
        return !/<[^>]*>/g.test(value);
      }),
    subject: Yup.string()
      .required("Subject is required")
      .min(5, "Subject must be at least 5 characters")
      .matches(/^[a-zA-Z0-9\s]*$/, "Only letters, numbers and spaces are allowed")
      .test('no-html', 'HTML tags are not allowed', value => {
        return !/<[^>]*>/g.test(value);
      }),
    message: Yup.string()
      .required("Message is required")
      .min(10, "Message must be at least 10 characters")
      .matches(/^[a-zA-Z0-9\s.,!?-]*$/, "Only letters, numbers, spaces and basic punctuation (.,!?-) are allowed")
      .test('no-html', 'HTML tags are not allowed', value => {
        return !/<[^>]*>/g.test(value);
      }),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const result = await dispatch(createContact(values));
        if (createContact.fulfilled.match(result)) {
          toast.success("Request sent Successfully!");
          resetForm();
        }
      } catch (err) {
        console.log(err);
      }
    },
  });

  return (
    <div className="bg-white text-black">
      <section className="text-center py-4 md:py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-semibold mb-3 md:mb-4 roboto-font">
          KEEP IN TOUCH
        </h2>
        <p className="text-gray-600 text-sm md:text-base  max-w-2xl mx-auto">
          We are here to help you. Get in touch with us in any of these ways.
        </p>
      </section>

      {/* CONTACT INFO SECTION */}
      <section className=" px-4 sm:px-6 md:px-8 lg:px-20 rounded-lg  mx-2 sm:mx-4 md:mx-8 lg:mx-20 shadow-lg">
        <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10">
          <div className="flex flex-col items-center p-3 sm:p-4 bg-white rounded-lg shadow-md w-full sm:w-auto flex-1 min-w-[200px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className="w-6 md:w-8 h-6 md:h-8 text-gray-600"
              fill="currentColor"
            >
              <path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z" />
            </svg>
            <p className="mt-2 text-sm md:text-base">+91 90157 65710</p>
          </div>

          {/* Location */}
          <div className="flex flex-col items-center p-3 sm:p-4 bg-white rounded-lg shadow-md w-full sm:w-auto flex-1 min-w-[200px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 384 512"
              fill="currentColor"
              className="w-6 md:w-8 h-6 md:h-8 text-gray-600"
            >
              <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
            </svg>
            <p className="mt-2 text-sm md:text-base">Delhi, India</p>
          </div>

          {/* Email */}
          <div className="flex flex-col items-center p-3 sm:p-4 bg-white rounded-lg shadow-md w-full sm:w-auto flex-1 min-w-[200px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              fill="currentColor"
              className="w-6 md:w-8 h-6 md:h-8 text-gray-600"
            >
              <path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48L48 64zM0 176L0 384c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-208L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z" />
            </svg>
            <p className="mt-2 text-sm md:text-base">Blackwizardsports@gmail.com</p>
          </div>
        </div>
      </section>

      {/* MAP SECTION WITH FORM BELOW */}
      <section className="px-4 sm:px-6 md:px-12 lg:px-20 py-4 mt-5 md:py-6">
        <div className="rounded-xl overflow-hidden shadow-lg mb-8 md:mb-12">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224345.83919833457!2d77.0688975474544!3d28.527280343151534!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce3f99af3148f%3A0x76860b3e8e7f32b!2sDelhi!5e0!3m2!1sen!2sin!4v1656000000000!5m2!1sen!2sin"
            width="100%"
            height="300"
            style={{ minHeight: "300px" }}
            allowFullScreen=""
            loading="lazy"
            className="border-0 w-full"
            title="Google Map"
          ></iframe>
        </div>

        {/* CONTACT FORM */}
        <div className="py-6 md:py-4 shadow-lg rounded-lg px-4 sm:px-6 md:px-8 lg:px-12">
          <h3 className="text-center font-semibold text-2xl md:text-3xl mb-4 md:mb-6 roboto-font">
            GET IN TOUCH
          </h3>
          <p className="text-center text-gray-600 mb-6 md:mb-8 roboto-font text-sm md:text-base">
            Submit custom form to reach this person.
          </p>
          <form
            onSubmit={formik.handleSubmit}
            className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4"
          >
            <div className="col-span-2">
              <input
                type="text"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Your Name"
                className={`border bg-white p-2 md:p-3 rounded-md w-full text-sm md:text-base `}
              />
              {formik.touched.name && formik.errors.name ? (
                <div className="text-red-500 text-xs md:text-sm mt-1">
                  {formik.errors.name}
                </div>
              ) : null}
            </div>

            <div className="col-span-2">
              <input
                type="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Email"
                className={`border bg-white p-2 md:p-3 rounded-md w-full text-sm md:text-base`}
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="text-red-500 text-xs md:text-sm mt-1">
                  {formik.errors.email}
                </div>
              ) : null}
            </div>

            <div className="col-span-2">
              <input
                type="text"
                name="subject"
                value={formik.values.subject}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Subject"
                className={`border bg-white p-2 md:p-3 rounded-md w-full text-sm md:text-base`}
              />
              {formik.touched.subject && formik.errors.subject ? (
                <div className="text-red-500 text-xs md:text-sm mt-1">
                  {formik.errors.subject}
                </div>
              ) : null}
            </div>

            <div className="col-span-2">
              <textarea
                name="message"
                value={formik.values.message}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Your Message"
                className={`border bg-white p-2 md:p-3 rounded-md w-full h-24 md:h-32 text-sm md:text-base ${
                  formik.touched.message && formik.errors.message ? "" : ""
                }`}
              ></textarea>
              {formik.touched.message && formik.errors.message ? (
                <div className="text-red-500 text-xs md:text-sm mt-1">
                  {formik.errors.message}
                </div>
              ) : null}
            </div>

            <div className="col-span-2 text-center">
              <button
                type="submit"
                className="bg-secondary cursor-pointer text-black px-4 py-2 md:px-6 md:py-3 rounded-md  shadow-md roboto-font text-sm md:text-base"
              >
              {formik.isSubmitting ? "Loading..." : "SEND MESSAGE"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

export default ContactUs;