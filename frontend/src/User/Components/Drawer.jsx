import React from "react";
import {
  Box,
  Typography,
  Button,
  Avatar,
  Drawer,
  IconButton,
  Card,
  CardContent,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const AddOnsDrawer = ({
  open,
  onClose,
  addons,
  selectedAddOns,
  onToggle,
  loading,
}) => {
  const addonList = addons?.addons || [];

  const getSelectedQuantity = (id) => {
    const selectedItem = selectedAddOns.find((item) => item._id === id);
    return selectedItem ? selectedItem.quantity : 0;
  };

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          height: "auto",
          maxHeight: "60vh",
          backgroundColor: "white",
          borderRadius: "12px 12px 0 0",
          paddingBottom: 2,
        },
      }}
    >
      <Box sx={{ padding: 2, position: "relative" }}>
        {/* Close Button */}
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 10,
            top: 10,
            color: "black",
          }}
        >
          <CloseIcon />
        </IconButton>

        <Typography
          variant="h6"
          fontWeight="bold"
          textAlign="center"
          sx={{ mb: 2 }}
        >
          Recommended Add-ons
        </Typography>

        {loading ? (
          <Typography textAlign="center">Loading add-ons...</Typography>
        ) : addonList.length === 0 ? (
          <Typography textAlign="center">No add-ons available.</Typography>
        ) : (
          <Box
            sx={{
              display: "flex",
              overflowX: "auto",
              gap: 2,
              paddingX: 2,
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            {addonList.map((addOn) => {
              const selectedQuantity = getSelectedQuantity(addOn._id);
              const availableQuantity = addOn.quantity - selectedQuantity;
              const totalPrice = selectedQuantity * addOn.price;
              return (
                <Card
                  key={addOn._id}
                  sx={{
                    minWidth: 180,
                    maxWidth: 200,
                    backgroundColor: "white",
                    borderRadius: "12px",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                    textAlign: "center",
                  }}
                >
                  <Avatar
                    src={`https://res.cloudinary.com/dj0rho12o/image/upload/${addOn.item_image}`}
                    alt={addOn.item_name}
                    sx={{
                      width: "100%",
                      height: 120,
                      borderTopLeftRadius: "12px",
                      borderTopRightRadius: "12px",
                    }}
                    variant="square"
                  />
                  <CardContent>
                    <Typography variant="body1" fontWeight="bold">
                      {addOn.item_name}
                    </Typography>
                    <Typography variant="body2" color="gray">
                      ₹{addOn.price} | Available: {availableQuantity}
                    </Typography>

                    {/* Quantity Controls */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mt: 1,
                      }}
                    >
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() =>
                          onToggle(addOn, Math.max(0, selectedQuantity - 1))
                        }
                        disabled={selectedQuantity === 0}
                      >
                        -
                      </Button>
                      <Typography sx={{ mx: 1 }}>{selectedQuantity}</Typography>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() =>
                          onToggle(
                            addOn,
                            Math.min(addOn.quantity, selectedQuantity + 1)
                          )
                        }
                        disabled={availableQuantity === 0}
                      >
                        +
                      </Button>
                    </Box>

                    {/* Display Total Price */}
                    {selectedQuantity > 0 && (
                      <Typography
                        variant="body2"
                        fontWeight="bold"
                        sx={{ mt: 1, textAlign: "center" }}
                      >
                        Total: ₹{totalPrice}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        )}

        <Button
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={onClose}
        >
          Continue
        </Button>
      </Box>
    </Drawer>
  );
};

export default AddOnsDrawer;
