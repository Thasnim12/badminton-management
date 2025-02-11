import React from "react";
import { styled } from "@mui/material";
import {
    Link,
    Typography
} from '@mui/material';
import Title from "./Title";

const useStyles = styled({
  depositContext: {
    flex: 1
  }
});

export default function Deposits() {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Title>Recent Deposits</Title>
      <Typography component="p" variant="h4">
        $3,024.00
      </Typography>
      <Typography color="textSecondary" className={classes.depositContext}>
        on 15 March, 2019
      </Typography>
      <div>
        <Link color="primary" href="javascript:;">
          View balance
        </Link>
      </div>
    </React.Fragment>
  );
}