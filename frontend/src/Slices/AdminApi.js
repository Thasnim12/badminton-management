import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/admin",
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getAdminDetails: builder.query({
      query: () => "/admin-profile",
    }),
    getAllUsers: builder.query({
      query: () => ({
        url: "/users",
        method: "GET",
      }),
    }),
    getAllcourts: builder.query({
      query: () => ({
        url: `/courts`,
        method: "GET",
      }),
    }),
    getAllslost: builder.query({
      query: (courtId) => ({
        url: `/slots/${courtId}`,
        method: "GET",
      }),
    }),
    getAlladdons: builder.query({
      query: () => ({
        url: `/addons`,
        method: "GET",
      }),
    }),
    GetStaffs: builder.query({
      query: () => "/get-staffs",
      method: "GET",
    }),
    GetDonations: builder.query({
      query: () => "/get-donations",
      method: "GET",
    }),
    viewBanner: builder.query({
      query: (bannerId) => ({
        url: `/view-banner/${bannerId}`,
        method: "GET",
      }),
    }),
    loginadmin: builder.mutation({
      query: (data) => ({
        url: "/login",
        method: "POST",
        body: data,
      }),
    }),
    logoutadmin: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
    }),
    manageusers: builder.mutation({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: "PUT",
      }),
    }),
    manageslots: builder.mutation({
      query: (data) => ({
        url: `/slots`,
        method: "POST",
        body: data,
      }),
    }),
    addcourts: builder.mutation({
      query: (data) => ({
        url: "/courts",
        method: "POST",
        body: data,
      }),
    }),
    updatecourts: builder.mutation({
      query: ({ slotId, ...data }) => ({
        url: `/edit-slots/${slotId}`,
        method: "PUT",
        body: data,
      }),
    }),
    addstaffs: builder.mutation({
      query: (data) => ({
        url: `/staffs`,
        method: "POST",
        body: data,
      }),
    }),
    addaddons: builder.mutation({
      query: (data) => ({
        url: `/addons`,
        method: "POST",
        body: data,
      }),
    }),
    UpdateStaff: builder.mutation({
      query: (updatedStaff) => ({
        url: `/staffs/${updatedStaff.employee_id}`,
        method: "PUT",
        body: updatedStaff,
      }),
    }),
    DeleteStaff: builder.mutation({
      query: (_id) => ({
        url: `/staffs/${_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Staff"],
    }),
    addBanner: builder.mutation({
      query: (data) => ({
        url: "/banner",
        method: "POST",
        body: data,
      }),
    }),
    getAllBanners: builder.query({
      query: () => ({
        url: "/banner",
      }),
    }),
    updateBanner: builder.mutation({
      query: ({ bannerId, formData }) => ({
        url: `/banner/${bannerId}`,
        method: "PUT",
        body: formData,
        formData: true,
      }),
    }),
    getMessages: builder.query({
      query: () => ({
        url: "/get-message",
        method: "GET",
      }),
    }),
    addUser: builder.mutation({
      query: (userData) => ({
        url: "/add-user",
        method: "POST",
        body: userData,
      }),
    }),
    getBookings: builder.query({
      query: () => "/bookings",
      method: "GET",
    }),
    manageCsv: builder.mutation({
      query: () => ({
        url: "/download-booking",
        method: "GET",
        responseHandler: async (response) => response.blob(),
      }),
    }),
    managedownloadCsv: builder.mutation({
      query: () => ({
        url: "/download-donation",
        method: "GET",
        responseHandler: async (response) => response.blob(),
      }),
    }),
    deleteBanner: builder.mutation({
      query: (bannerId) => ({
        url: `/delete-banner/${bannerId}`,
        method: "DELETE",
      }),
    }),
    deleteAddon: builder.mutation({
      query: (addonsId) => ({
        url: `/delete-addons/${addonsId}`,
        method: "DELETE",
      }),
    }),
    editCourtStatus: builder.mutation({
      query: (courtId) => ({
        url: "/status",
        method: "PUT",
        body: courtId,
      }),
    }),
    deleteCourt: builder.mutation({
      query: (courtId) => ({
        url: "/delete-court",
        method: "DELETE",
        body: courtId,
      }),
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
  useAddaddonsMutation,
  useGetAlladdonsQuery,
  useGetStaffsQuery,
  useGetDonationsQuery,
  useUpdateStaffMutation,
  useDeleteStaffMutation,
  useGetAdminDetailsQuery,
  useAddBannerMutation,
  useGetAllBannersQuery,
  useLazyViewBannerQuery,
  useUpdateBannerMutation,
  useGetMessagesQuery,
  useAddUserMutation,
  useGetBookingsQuery,
  useManageCsvMutation,
  useManagedownloadCsvMutation,
  useDeleteBannerMutation,
  useDeleteAddonMutation,
  useEditCourtStatusMutation,
  useDeleteCourtMutation
} = adminApi;

export default adminApi;
