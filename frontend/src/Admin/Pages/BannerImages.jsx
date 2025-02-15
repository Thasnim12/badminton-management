import { useState } from "react";
import Layout from "../Global/Layouts";
import {
    Box,
    Button,
    Grid,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    Typography,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    DialogTitle,
    Container,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import DeleteIcon from "@mui/icons-material/Delete";
import {
    useAddBannerMutation,
    useGetAllBannersQuery,
    useLazyViewBannerQuery,
    useUpdateBannerMutation,
    useDeleteBannerMutation
} from "../../Slices/AdminApi";
import AddBanner from "../Components/Addbanner";
import BreadcrumbNav from "../Global/Breadcrumb";

const BannerImages = () => {
    const [open, setOpen] = useState(false);
    const [openView, setOpenview] = useState(false);
    const [addBanner] = useAddBannerMutation();
    const { data } = useGetAllBannersQuery();
    console.log(data, 'data')
    const [fetchBanner, { data: bannerData },refetch] = useLazyViewBannerQuery();
    const [deleteBanner] = useDeleteBannerMutation();
    const [updateBanner] = useUpdateBannerMutation();
    const [isEditing, setIsEditing] = useState(false);

    const [banner, setBanner] = useState({
        title: "",
        imageUrl: [],  
        order: [],
        removedImages: [],
        newImages: [],
    });

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);

        if (isEditing) {
            setBanner((prev) => ({
                ...prev,
                newImages: [...prev.newImages, ...files],
                order: [
                    ...prev.order,
                    ...files.map((_, i) => prev.order.length + i + 1),
                ],
            }));
        }
    };



    const handleRemoveNewImage = (index) => {
        setBanner((prev) => {
            const updatedNewImages = [...prev.newImages];
            updatedNewImages.splice(index, 1);

            const updatedOrder = updatedNewImages.map((_, i) => i + 1);

            return {
                ...prev,
                newImages: updatedNewImages,
                order: updatedOrder
            };
        });
    };


    const handleRemoveExistingImage = (imageUrl, index) => {
        setBanner((prev) => {
            const updatedImages = [...prev.imageUrl];
            updatedImages.splice(index, 1);

            const updatedOrder = updatedImages.map((_, i) => i + 1);

            return {
                ...prev,
                imageUrl: updatedImages,
                removedImages: [...prev.removedImages, imageUrl],
                order: updatedOrder
            };
        });
    };


    const [loading, setLoading] = useState(false);


    const handleViewBanner = async (bannerId) => {
        setLoading(true);
        try {
            const response = await fetchBanner(bannerId).unwrap();
            setBanner({
                _id: response._id,
                title: response.title,
                imageUrl: response.imageUrl,
                order: response.order || [],
                removedImages: [],
                newImages: [],
            });
            setOpenview(true);
        } catch (error) {
            console.error("Error fetching banner:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditBanner = async () => {
        const formDataToSend = new FormData();
        formDataToSend.append("title", banner.title);
        formDataToSend.append("order", JSON.stringify(banner.order));

        if (banner.removedImages.length > 0) {
            formDataToSend.append(
                "removedImages",
                JSON.stringify(banner.removedImages)
            );
        }

        banner.newImages.forEach((file) =>
            formDataToSend.append("banner_image", file)
        );

        console.log(
            "FormData being sent:",
            Object.fromEntries(formDataToSend.entries())
        );

        try {
            await updateBanner({
                bannerId: banner._id,
                formData: formDataToSend,
            }).unwrap();
            alert("Banner updated successfully!");
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating banner:", error);
            alert("Failed to update banner. Please try again.");
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleDelete = async(bannerId) =>{
        try{
         const response = await deleteBanner(bannerId)
         console.log(response)
         refetch();
        }
        catch(error){
            console.log(error.message)
        }
    }

    return (
        <Layout>
            <TableContainer component={Paper} sx={{ maxWidth: 1300, margin: "auto" }}>
                <Table sx={{ minWidth: 400 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Order</TableCell>
                            <TableCell>Images</TableCell>
                            <TableCell>View</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data?.banner?.map((banner) => (
                            <TableRow key={banner._id}>
                                <TableCell>{banner.title}</TableCell>
                                <TableCell>{banner.order.join(", ")}</TableCell>
                                <TableCell>
                                    <Box sx={{ display: "flex", gap: 1 }}>
                                        {banner.imageUrl.map((img, index) => (
                                            <img key={index} src={`http://localhost:5000/uploads/${img}`} style={{ width: 80, height: 50, objectFit: "cover", borderRadius: 5 }} />
                                        ))}
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <IconButton color="primary" onClick={() => handleViewBanner(banner._id)}>
                                        <RemoveRedEyeIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openView} onClose={() => setOpenview(false)} maxWidth="md" fullWidth>
                <DialogTitle>{isEditing ? "Edit Banner" : banner?.title || "Banner Details"}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} justifyContent="center" sx={{ mt: 2 }}>
                        {banner?.imageUrl?.map((image, index) => (
                            <Grid item xs={6} sm={4} md={3} key={index}>
                                <Box sx={{ position: "relative" }}>
                                    <img
                                        src={`http://localhost:5000/uploads/${image}`}
                                        style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "8px" }}
                                    />
                                    {isEditing && (
                                        <IconButton
                                            sx={{ position: "absolute", top: 5, right: 5, backgroundColor: "white" }}
                                            onClick={() => handleRemoveExistingImage(image, index)}
                                        >
                                            <DeleteIcon color="white" />
                                        </IconButton>
                                    )}
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </DialogContent>
            </Dialog>
        </Layout>
    );
};

export default BannerImages;
