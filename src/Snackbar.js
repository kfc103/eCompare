import React from "react";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  "@global": {
    body: {
      backgroundColor: theme.palette.background.paper
    }
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  fab: {
    position: "absolute",
    bottom: theme.spacing(2),
    right: theme.spacing(2)
  },
  snackbar: {
    [theme.breakpoints.down("xs")]: {
      bottom: 90
    }
  }
}));

export default function SimpleSnackbar({
  showInstalledMessage,
  showUpdateMessage
}) {
  const [open, setOpen] = React.useState(
    showInstalledMessage || showUpdateMessage
  );
  const classes = useStyles();

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const refreshPage = () => {
    window.location.reload(false);
  };

  let message = "";
  if (showInstalledMessage) message = "The app has been installed";
  else if (showUpdateMessage)
    message = "There is an new update, please refresh";

  return (
    <div>
      <Button onClick={handleClick}>Open simple snackbar</Button>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left"
        }}
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        message={message}
        className={classes.snackbar}
        action={
          <React.Fragment>
            <Button color="primary" size="small" onClick={refreshPage}>
              refresh
            </Button>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
    </div>
  );
}
