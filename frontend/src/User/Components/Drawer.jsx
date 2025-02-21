import React from "react";
import {
  Box,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Drawer,
} from "@mui/material";

const AddOnsDrawer = ({ open, onClose, addons, selectedAddOns, onToggle, loading }) => {
  const addon = addons?.addons;

  const getSelectedQuantity = (id) => {
    const selectedItem = selectedAddOns.find((item) => item._id === id);
    return selectedItem ? selectedItem.quantity : 0;
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 400, padding: 2 }}>
        <Typography variant="h6" fontWeight="bold">Our available add-ons!</Typography>

        {loading ? (
          <Typography>Loading add-ons...</Typography>
        ) : addons?.length === 0 ? (
          <Typography>No add-ons available.</Typography>
        ) : (
          <List>
            {addon.map((addOn) => {
              const selectedQuantity = getSelectedQuantity(addOn._id);
              const availableQuantity = addOn.quantity - selectedQuantity; // Update available count

              return (
                <ListItem key={addOn._id}>
                  <ListItemAvatar>
                    <Avatar src={`https://res.cloudinary.com/dj0rho12o/image/upload/${addOn.item_image}`} alt={addOn.item_name} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={addOn.item_name}
                    secondary={`Price: ₹${addOn.price} | Available: ${availableQuantity}`}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => onToggle(addOn, Math.max(0, selectedQuantity - 1))}
                      disabled={selectedQuantity === 0}
                    >
                      -
                    </Button>
                    <Typography sx={{ mx: 1 }}>{selectedQuantity}</Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => onToggle(addOn, Math.min(addOn.quantity, selectedQuantity + 1))}
                      disabled={availableQuantity === 0} // Disable if no stock left
                    >
                      +
                    </Button>
                  </Box>
                </ListItem>
              );
            })}
          </List>
        )}
        <Button fullWidth variant="outlined" sx={{ mt: 2 }} onClick={onClose}>
          Done
        </Button>
      </Box>
    </Drawer>
  );
};




export default AddOnsDrawer;
