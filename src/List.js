import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import IconButton from "@material-ui/core/IconButton";
import Divider from "@material-ui/core/Divider";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper
  }
}));

export default function SimpleList() {
  const classes = useStyles();

  function createData(
    id,
    quantity = "",
    price = "",
    unitprice = "",
    rank = ""
  ) {
    return {
      id,
      quantity,
      price,
      unitprice,
      rank
    };
  }

  /*const defaultdata = [
    createData(1, 1, 50, "", ""),
    createData(2, 2, 100, "", ""),
    createData(3, 1, 75, "", "")
  ];*/
  const defaultdata = [createData(1), createData(2)];

  const [data, setData] = React.useState(defaultdata);

  const calUnitPrice = (item) => {
    let unitprice = item.price / item.quantity;

    if (unitprice === Infinity || unitprice === undefined || isNaN(unitprice))
      return "";

    return unitprice;
  };
  function updateUnitPrice(index) {
    let newArr = [...data];

    if (index === undefined) {
      newArr.forEach((item) => {
        item.unitprice = calUnitPrice(item);
      });
    } else {
      newArr[index].unitprice = calUnitPrice(newArr[index]);
    }

    setData(newArr);
  }

  function rank() {
    let rankedArr = [...data];
    let newArr = [...data];
    rankedArr.sort((a, b) => {
      return a.unitprice - b.unitprice;
    });
    newArr.forEach((item) => {
      if (item.unitprice === "") item.rank = "";
      else {
        if (item.unitprice === rankedArr[0].unitprice) item.rank = "1st";
        else if (item.unitprice === rankedArr[1].unitprice) item.rank = "2nd";
        else if (item.unitprice === rankedArr[2].unitprice) item.rank = "3rd";
        else item.rank = "";
      }
    });
    setData(newArr);
  }

  function updateFieldChanged(index) {
    return (e) => {
      const re = /^[0-9\b]+$/;

      // if value is not blank, then test the regex
      if (e.target.value === "" || re.test(e.target.value)) {
        let newArr = [...data]; // copying the old datas array
        newArr[index][e.target.name] = e.target.value; // replace e.target.value with whatever you want to change it to

        updateUnitPrice(index);
        rank();
        setData(newArr);
      }
    };
  }

  function addItem() {
    let newArr = [...data];
    newArr.push(createData(newArr.length + 1));
    setData(newArr);
  }

  function removeItem(item) {
    let newArr = [...data];
    newArr.splice(data.indexOf(item), 1);
    setData(newArr);
  }

  return (
    <Container component="main">
      <div className={classes.root}>
        <List aria-label="main">
          {data.map((item, index) => (
            <ListItem key={item.id}>
              <TextField
                name="price"
                label="Price"
                value={item.price}
                onChange={updateFieldChanged(index)}
              />
              <TextField
                name="quantity"
                label="Quantity"
                value={item.quantity}
                onChange={updateFieldChanged(index)}
              />
              <ListItemText
                primary={"Rank: " + item.rank}
                secondary={"Unit Price: " + item.unitprice}
                fullWidth
              />
              <IconButton aria-label="delete" onClick={() => removeItem(item)}>
                <DeleteIcon />
              </IconButton>
            </ListItem>
          ))}
          <ListItem>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => {
                return addItem();
              }}
            >
              <AddIcon />
            </Button>
          </ListItem>
        </List>

        <Button
          variant="contained"
          color="primary"
          onClick={() => updateUnitPrice()}
        >
          Primary
        </Button>
        <Button variant="contained" color="primary" onClick={() => rank()}>
          Rank
        </Button>
      </div>
    </Container>
  );
}
