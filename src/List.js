import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

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
  const [listId, setListId] = React.useState(defaultdata.length);

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
    let newArr = [...data];

    if (isListRankable()) {
      let rankedArr = [...data];

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
    } else {
      newArr.forEach((item) => {
        item.rank = "";
      });
    }

    setData(newArr);
  }

  function isListRankable() {
    let retVal = true;
    data.forEach((item) => {
      if (
        item.unitprice === "" ||
        item.unitprice === undefined ||
        isNaN(item.unitprice)
      )
        retVal = false;
    });
    return retVal;
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
    let newId = listId + 1;
    newArr.push(createData(newId));
    setListId(newId);
    setData(newArr);
  }

  function removeItem(item) {
    let newArr = [...data];
    newArr.splice(data.indexOf(item), 1);
    rank();
    setData(newArr);
  }

  return (
    <Container component="main">
      <div className={classes.root}>
        <TableContainer>
          <Table
            className={classes.table}
            size="small"
            stickyHeader
            aria-label="simple table"
          >
            <TableHead>
              <TableRow>
                <TableCell align="center">Price</TableCell>
                <TableCell align="center">Quantity</TableCell>
                <TableCell align="center">Unit&nbsp;Price</TableCell>
                <TableCell align="center">Rank</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell component="th" scope="row">
                    <TextField
                      name="price"
                      size="small"
                      value={item.price}
                      onChange={updateFieldChanged(index)}
                      onBlur={() => rank()}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <TextField
                      name="quantity"
                      size="small"
                      value={item.quantity}
                      onChange={updateFieldChanged(index)}
                      onBlur={() => rank()}
                    />
                  </TableCell>
                  <TableCell align="right">{item.unitprice}</TableCell>
                  <TableCell align="right">{item.rank}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      aria-label="delete"
                      onClick={() => removeItem(item)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={5}>
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
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </Container>
  );
}
