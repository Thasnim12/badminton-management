import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/users",
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getAllcourts: builder.query({
      query: () => ({
        url: `/get-courts`,
        method: "GET",
      }),
    }),
    getSlots: builder.query({
      query: ({ courtId, date }) => ({
        url: `/get-slots/?courtId=${courtId}&date=${date}`,
        method: "GET",
      }),
    }),
    getAddons: builder.query({
      query: () => ({
        url: "/get-addons",
        method: "GET",
      }),
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/update-profile",
        method: "PUT",
        body: data,
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
    googleLogin: builder.mutation({
      query: ({ code }) => ({
        url: "/google-login",
        method: "POST",
        body: { code },
      }),
    }),
    verifyOtp: builder.mutation({
      query: (otpData) => ({
        url: "/verify-otp",
        method: "POST",
        body: otpData,
      }),
    }),
    sendMessage: builder.mutation({
      query: (messageData) => ({
        url: "/send-message",
        method: "POST",
        body: messageData,
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
    createBooking: builder.mutation({
      query: (data) => ({
        url: "/booking",
        method: "POST",
        body: data,
      }),
    }),
    verifyBooking: builder.mutation({
      query: (data) => ({
        url: "/verify-booking",
        method: "POST",
        body: data,
      }),
    }),
    userBooking: builder.query({
      query: () => ({
        url: "/user-history",
        method: "Get",
      }),
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useVerifyOtpMutation,
  useCreateDonationMutation,
  useVerifyDonationMutation,
  useGoogleLoginMutation,
  useGetSlotsQuery,
  useGetAllcourtsQuery,
  useGetAddonsQuery,
  useUpdateProfileMutation,
  useCreateBookingMutation,
  useVerifyBookingMutation,
  useSendMessageMutation,
  useUserBookingQuery,
} = userApi;

export default userApi;
