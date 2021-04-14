import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import Grid from "@material-ui/core/Grid";
import { useStyles } from "./Styles";
import UnitSelect from "./UnitSelect";

export default function ListContent({ data, ...args }) {
  const classes = useStyles;
  return (
    <List>
      <Grid container spacing={1}>
        {data.map((item, index) => (
          <ListItem key={item.id} divider>
            <Grid
              container
              spacing={0}
              alignItems="center"
              justify="space-between"
            >
              <Grid container item xs={11} sm={11} spacing={1}>
                <Grid item xs={4} sm={4} md={3}>
                  <FormControl fullWidth className={classes.margin}>
                    <InputLabel htmlFor="standard-adornment-amount">
                      Price
                    </InputLabel>
                    <Input
                      name="price"
                      type="number"
                      value={item.price}
                      onChange={args.onChange(index)}
                      startAdornment={
                        <InputAdornment position="start">$</InputAdornment>
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={4} sm={4} md={3}>
                  <FormControl fullWidth className={classes.margin}>
                    <InputLabel htmlFor="standard-adornment-amount">
                      Quantity
                    </InputLabel>
                    <Input
                      name="quantity"
                      type="number"
                      value={item.quantity}
                      onChange={args.onChange(index)}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={3} sm={3} md={2}>
                  <UnitSelect
                    name="unit"
                    value={item.unit}
                    onChange={args.onChange}
                    index={index}
                  />
                </Grid>
                <Grid item xs={11} sm={11} md={3}>
                  <ListItemText
                    primary={"Rank: " + (item.rank ? item.rank : "")}
                    secondary={
                      "Unit Price: " +
                      (item.unitprice
                        ? item.unitprice + " per " + item.unit.stdUnit
                        : "")
                    }
                  />
                </Grid>
              </Grid>
              <Grid container item xs={1} sm={1} md={1} justify="flex-end">
                <Grid item>
                  <IconButton
                    aria-label="delete"
                    onClick={() => args.removeItem(item)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
          </ListItem>
        ))}
      </Grid>
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={() => args.addItem()}
      >
        <AddIcon />
      </Button>
    </List>
  );
}
