import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const userApi = createApi({
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
      query: ({ token }) => ({
        url: "/google-login",
        method: "POST",
        body: { token },
      }),
    }),

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

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useVerifyOtpMutation,
  useCreateDonationMutation,
  useVerifyDonationMutation,
  useGoogleLoginMutation,
  useGetUserDetailsQuery,
  useUpdateProfileMutation
} = userApi;

export default userApi;
