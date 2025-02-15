import React from "react";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

const BreadcrumbNav = ({ links }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  return (
    <Breadcrumbs
      color="primary"
      separator={<NavigateNextIcon fontSize="small" sx={{ color: "gray" }} />}
      aria-label="breadcrumb"
      sx={{ marginBottom: "20px" }}
    >
      {links.map((link, index) =>
        index === links.length - 1 ? (
          <Typography key={index} color="gray">
            {link.label}
          </Typography>
        ) : (
          <Link
            key={index}
            underline="none"
            color="gray"
            onClick={() => navigate(link.path)}
            sx={{
              cursor: "pointer",
              position: "relative",
              "&::after": {
                content: '""',
                position: "absolute",
                left: 0,
                bottom: -2,
                width: "100%",
                height: "2px",
                backgroundColor: theme.palette.primary.main,
                transform: "scaleX(0)",
                transformOrigin: "left",
                transition: "transform 0.3s ease-in-out",
              },
              "&:hover::after": {
                transform: "scaleX(1)",
              },
            }}
          >
            {link.label}
          </Link>
        )
      )}
    </Breadcrumbs>
  );
};

export default BreadcrumbNav;
