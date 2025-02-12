import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000/api/admin', credentials: 'include' }),
  endpoints: (builder) => ({

    getAdminDetails: builder.query({
      query: () => '/admin-profile',
    }),
    getAllUsers: builder.query({
      query: (data) => ({
        url: '/users', 
        method: 'GET',
      }),
    }),
    getAllcourts: builder.query({
      query: () => ({
        url: `/courts`,
        method: 'GET',
      }),
    }),
    getAllslost: builder.query({
      query: (courtId) => ({
        url: `/slots/${courtId}`,
        method: 'GET',
      }),
    }),
    loginadmin: builder.mutation({
        query: (data) => ({
          url: '/login', 
          method: 'POST',
          body: data,
        }),
      query: (data) => ({
        url: '/login',
        method: 'POST',
        body: data,
      }),
    }),
    logoutadmin: builder.mutation({
      query: () => ({
        url: '/logout',
        method: 'POST',
      }),
    }),
    manageusers: builder.mutation({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: 'PUT',
      }),
    }),
    manageslots: builder.mutation({
      query: (data) => ({
        url: `/slots`,
        method: 'POST',
        body: data
      }),
    }),
    addcourts: builder.mutation({
      query: (data) => ({
        url: `/courts`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: data
      }),
    }),
    updatecourts: builder.mutation({
      query: ({ slotId,...data }) => ({
        url: `/edit-slots/${slotId}`,
        method: 'PUT',
        body: data
      }),
    }),
    addstaffs: builder.mutation({
      query: (data) => ({
        url: `/staffs`,
        method: 'POST',
        body: data
      }),
    }),
    GetStaffs: builder.query({
      query: () => '/get-staffs', 
    }),
    GetDonations: builder.query({
      query: () => '/get-donations',
    }),
    UpdateStaff: builder.mutation({
      query: (updatedStaff) => ({
        url: `/staffs/${updatedStaff.employee_id}`, 
        method: 'PUT',
        body: updatedStaff,
      }),
    }),
    DeleteStaff: builder.mutation({
      query: (_id) => ({
        url: `/staffs/${_id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Staff'],
    }),
   
  }),
});   

export const {
  useGetAllUsersQuery,
  useLoginadminMutation,
  useManageusersMutation,
  useLogoutadminMutation,
  useManageslotsMutation,
  useAddcourtsMutation,
  useGetAllcourtsQuery,
  useGetAllslostQuery,
  useUpdatecourtsMutation,
  useAddstaffsMutation,
  useGetStaffsQuery,
  useGetDonationsQuery,
  useUpdateStaffMutation,
  useDeleteStaffMutation,
  useGetAdminDetailsQuery,
 }
  = adminApi;

export default adminApi
