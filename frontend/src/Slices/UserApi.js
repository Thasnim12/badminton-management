import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const userApi = createApi({
<<<<<<< HEAD
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000/api/users',credentials: 'include' }), 
  endpoints: (builder) => ({

    getAllcourts: builder.query({
      query: () => ({
        url: `/get-courts`,
        method: 'GET',
      }),
    }),
    getSlots: builder.query({
      query: ({ courtId, date }) => ({
        url: `/get-slots/?courtId=${courtId}&date=${date}`,
        method: 'GET',
      }),
    }),
    getAddons: builder.query({
      query: () => ({
        url: '/get-addons',
        method: 'GET',
=======
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api/users" }),
  endpoints: (builder) => ({
    getUserDetails: builder.query({
      query: () => ({
        url: "/profile",
        method: "GET",
        // headers: {
        //   Authorization: `Bearer ${localStorage.getItem("userInfo")}`,
        // },
      }),
    }),
    updateProfile: builder.mutation({
      query: (profileData) => ({
        url: "/update-profile", 
        method: "PUT",
        body: profileData, 
>>>>>>> c913e5bc4391fe395793c67b02f4e50091105a6b
      }),
    }),
    registerUser: builder.mutation({
      query: (data) => ({
        url: "/register",
        method: "POST",
        body: data,
      }),
    }),
    loginUser: builder.mutation({
      query: (data) => ({
        url: "/login",
        method: "POST",
        body: data,
      }),
    }),
<<<<<<< HEAD
=======

>>>>>>> c913e5bc4391fe395793c67b02f4e50091105a6b
    googleLogin: builder.mutation({
      query: ({ token }) => ({
        url: "/google-login",
        method: "POST",
        body: { token },
      }),
    }),
<<<<<<< HEAD
=======

>>>>>>> c913e5bc4391fe395793c67b02f4e50091105a6b
    verifyOtp: builder.mutation({
      query: (otpData) => ({
        url: "/verify-otp",
        method: "POST",
        body: otpData,
      }),
    }),
    createDonation: builder.mutation({
      query: (data) => ({
        url: "/donation",
        method: "POST",
        body: data,
      }),
    }),
    verifyDonation: builder.mutation({
      query: (data) => ({
        url: "/verify-donation",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

<<<<<<< HEAD
export const { useRegisterUserMutation, 
  useLoginUserMutation, 
  useVerifyOtpMutation, 
  useCreateDonationMutation, 
  useVerifyDonationMutation, 
  useGoogleLoginMutation,
  useGetSlotsQuery,
  useGetAllcourtsQuery ,
  useGetAddonsQuery
=======
export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useVerifyOtpMutation,
  useCreateDonationMutation,
  useVerifyDonationMutation,
  useGoogleLoginMutation,
  useGetUserDetailsQuery,
  useUpdateProfileMutation
>>>>>>> c913e5bc4391fe395793c67b02f4e50091105a6b
} = userApi;

export default userApi;
