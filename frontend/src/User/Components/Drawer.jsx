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
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 400, padding: 2 }}>
        <Typography variant="h6" fontWeight="bold">Our available addons!</Typography>

        {loading ? (
          <Typography>Loading add-ons...</Typography>
        ) : addons?.length === 0 ? (
          <Typography>No add-ons available.</Typography>
        ) : (
          <List>
            {addon.map((addOn) => (
              <ListItem key={addOn._id}>
                <ListItemAvatar>
                  <Avatar src={`http://localhost:5000/uploads/${addOn.item_image}`} alt={addOn.item_name} />
                </ListItemAvatar>
                <ListItemText
                  primary={addOn.item_name}
                  secondary={`Price: ₹${addOn.price} | Available: ${addOn.quantity}`}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedAddOns.some((item) => item._id === addOn._id)}
                      onChange={() => onToggle(addOn)}
                    />
                  }
                  label="Add"
                />
              </ListItem>
            ))}
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
