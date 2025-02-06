import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000/api/users' }), 
  endpoints: (builder) => ({

    registerUser: builder.mutation({
      query: (userData) => ({
        url: '/register', 
        method: 'POST',
        body: userData,
      }),
    }),

    loginUser: builder.mutation({
      query: (loginData) => ({
        url: '/login', 
        method: 'POST',
        body: loginData,
      }),
    }),


    verifyOtp: builder.mutation({
      query: (otpData) => ({
        url: '/verify-otp',
        method: 'POST',
        body: otpData,
      }),
    }),
  }),
});

export const { useRegisterUserMutation, useLoginUserMutation, useVerifyOtpMutation } = userApi;

export default userApi;
