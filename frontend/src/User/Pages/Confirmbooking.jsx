import React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { Delete, ArrowBack, CreditCard } from "@mui/icons-material";
import Header from "../Global/Header";

export default function ShoppingCart() {
  return (
    <>
    <Header/>
    <Box sx={{ backgroundColor: "#eee", minHeight: "100vh", py: 5 }}>
      <Container>
        <Grid container spacing={3}>
            <Card sx={{ width: "80%" }}>
              <CardContent>
                <Typography variant="h6" component="a" href="#" sx={{ display: "flex", alignItems: "center", textDecoration: "none", color: "black" }}>
                  <ArrowBack sx={{ mr: 1 }} /> Continue Shopping
                </Typography>
                <hr />
                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Box>
                    <Typography variant="h6">Shopping Cart</Typography>
                    <Typography>You have 4 items in your cart</Typography>
                  </Box>
                </Box>
                {[  
                  { name: "Iphone 11 Pro", desc: "256GB, Navy Blue", price: "$900", quantity: 2, img: "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-shopping-carts/img1.webp" },
                  { name: "Samsung Galaxy Note 10", desc: "256GB, Navy Blue", price: "$900", quantity: 2, img: "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-shopping-carts/img2.webp" },
                  { name: "Canon EOS M50", desc: "Onyx Black", price: "$1199", quantity: 1, img: "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-shopping-carts/img3.webp" },
                  { name: "MacBook Pro", desc: "1TB, Graphite", price: "$1799", quantity: 1, img: "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-shopping-carts/img4.webp" }
                ].map((item, index) => (
                  <Card key={index} sx={{ mb: 2 }}>
                    <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Box display="flex" alignItems="center">
                        <CardMedia component="img" image={item.img} sx={{ width: 65, borderRadius: 1 }} />
                        <Box ml={2}>
                          <Typography variant="h6">{item.name}</Typography>
                          <Typography variant="body2" color="textSecondary">{item.desc}</Typography>
                        </Box>
                      </Box>
                      <Box display="flex" alignItems="center">
                        <Typography variant="h6" sx={{ width: 50, textAlign: "center" }}>{item.quantity}</Typography>
                        <Typography variant="h6" sx={{ width: 80, textAlign: "center" }}>{item.price}</Typography>
                        <IconButton color="error">
                          <Delete />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>

          <Grid item xs={12} md={5}>
            <Card sx={{ backgroundColor: "primary.main", color: "white" }}>
              <CardContent>
                <Typography variant="h6">Card Details</Typography>
                <TextField fullWidth label="Cardholder's Name" variant="outlined" sx={{ backgroundColor: "white", my: 2 }} />
                <TextField fullWidth label="Card Number" variant="outlined" sx={{ backgroundColor: "white", my: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField fullWidth label="Expiration" variant="outlined" sx={{ backgroundColor: "white" }} />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField fullWidth label="CVV" variant="outlined" sx={{ backgroundColor: "white" }} />
                  </Grid>
                </Grid>
                <hr />
                <Box display="flex" justifyContent="space-between" my={1}>
                  <Typography>Subtotal</Typography>
                  <Typography>$4798.00</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" my={1}>
                  <Typography>Shipping</Typography>
                  <Typography>$20.00</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" my={1}>
                  <Typography>Total (Incl. Taxes)</Typography>
                  <Typography>$4818.00</Typography>
                </Box>
                <Button fullWidth variant="outlined" color="info" sx={{ mt: 2 }}>
                  <Box display="flex" justifyContent="space-between" width="100%">
                    <Typography>$4818.00</Typography>
                    <Typography>Checkout <CreditCard sx={{ ml: 1 }} /></Typography>
                  </Box>
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
    </>
  );
}
