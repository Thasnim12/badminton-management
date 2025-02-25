import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Typography, Divider } from "@mui/material";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme }) => ({
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
  variants: [
    {
      props: ({ expand }) => !expand,
      style: {
        transform: "rotate(0deg)",
      },
    },
    {
      props: ({ expand }) => !!expand,
      style: {
        transform: "rotate(180deg)",
      },
    },
  ],
}));

export default function DetailsCard() {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card
      sx={{
        width: "100%",
        maxWidth: 500,
        height: "auto",
        display: "flex",
        flexDirection: "column",
        padding: { xs: 2, sm: 3 },
        margin: "auto",
        boxShadow: 3,
        borderRadius: 2,
      }}
    >
      {/* Header */}
      <CardContent>
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", textAlign: "center" }}
        >
          AVK RAJA YADAV TRUST
        </Typography>
      </CardContent>

      <Divider />

      {/* Responsive Image */}
      <CardMedia
        component="img"
        height={{ xs: 200, sm: 300, md: 400 }}
        image="https://images.unsplash.com/photo-1559309106-ed14040fd35d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YmFkbWludG9ufGVufDB8fDB8fHww"
        alt="Badminton"
        sx={{
          objectFit: "cover",
          borderRadius: 2,
          width: "100%",
        }}
      />

      <Divider />

      {/* Description */}
      <CardContent>
        <Typography
          variant={{ xs: "body2", sm: "body1" }}
          sx={{
            fontWeight: "bold",
            color: "text.secondary",
            textAlign: "justify",
          }}
        >
          "Badminton for a Cause": At AVK Raja Yadav Trust, each tournament you
          participate in or sponsor contributes directly to helping
          underprivileged communities. Your support helps us provide
          scholarships, educational resources, and more.
        </Typography>
      </CardContent>

      <Divider />

      {/* Footer */}
      <CardContent sx={{ textAlign: "center", marginTop: "auto" }}>
        <Typography variant="body2" sx={{ fontWeight: "bold", color: "gray" }}>
          Kazhukoorani, near Vani Bus Stop, Ramanathapuram
          <br />© 2025 AVK Raja Yadav Trust
        </Typography>
      </CardContent>
    </Card>
  );
}
