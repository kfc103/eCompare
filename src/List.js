import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  }
}));

function ListItemLink(props) {
  return <ListItem button component="a" {...props} />;
}

export default function SimpleList() {
  const classes = useStyles();

  const defaultdata = [
    { id: 1, quantity: 1, price: 50, unitprice: "", rank: "" },
    { id: 2, quantity: 2, price: 100, unitprice: "", rank: "" },
    { id: 3, quantity: 1, price: 75, unitprice: "", rank: "" }
  ];

  const [data, setData] = React.useState(defaultdata);

  const updateUnitPrice = (index) => {
    let newArr = [...data];

    if (index === undefined) {
      newArr.forEach((item) => {
        let unitprice = item.price / item.quantity;
        item.unitprice =
          unitprice === Infinity || unitprice === undefined ? "" : unitprice;
      });
    } else {
      let unitprice = newArr[index].price / newArr[index].quantity;
      newArr[index].unitprice =
        unitprice === Infinity || unitprice === undefined ? "" : unitprice;
    }

    setData(newArr);
    //setState(Date.now());
  };

  function rank() {
    data.sort(function (a, b) {
      return a.price - b.price;
    });
    console.log(data);
  }

  const updateFieldChanged = (index) => (e) => {
    const re = /^[0-9\b]+$/;

    // if value is not blank, then test the regex
    if (e.target.value === "" || re.test(e.target.value)) {
      let newArr = [...data]; // copying the old datas array
      newArr[index][e.target.name] = e.target.value; // replace e.target.value with whatever you want to change it to

      updateUnitPrice(index);
      setData(newArr);
    }
  };

  return (
    <div className={classes.root}>
      <List component="nav" aria-label="main">
        {data.map((item, index) => (
          <ListItem button key={item.id}>
            <TextField
              name="quantity"
              label="Quantity"
              value={item.quantity}
              onChange={updateFieldChanged(index)}
            />
            <TextField name="price" label="Price" value={item.price} />
            <TextField
              name="up"
              label="Unit Price"
              value={item.unitprice}
              disabled
            />
            <ListItemText primary={item.rank} />
          </ListItem>
        ))}
      </List>
      <Button
        variant="contained"
        color="primary"
        onClick={() => updateUnitPrice()}
      >
        Primary
      </Button>
    </div>
  );
}
