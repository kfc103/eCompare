import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => {
  return {
    root: {
      width: "100vw",
      flexGrow: 1,
      backgroundColor: theme.palette.background.paper,
      display: "flex",
      flexDirection: "column"
    },
    main: {
      //marginTop: theme.spacing(8),
      //marginBottom: theme.spacing(2)
      margin: theme.spacing(0)
    },
    fab: {
      position: "fixed",
      bottom: theme.spacing(2),
      right: theme.spacing(2)
    }
  };
});
