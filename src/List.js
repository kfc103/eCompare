import React from "react";
import Container from "@material-ui/core/Container";
import TableContent from "./ResponsiveList";
import { useStyles } from "./Styles";

export default function List() {
  const classes = useStyles();

  /*const defaultdata = [
    createData(1, 1, 50, "", ""),
    createData(2, 2, 100, "", ""),
    createData(3, 1, 75, "", "")
  ];*/
  const defaultdata = [createData(1), createData(2)];

  const [data, setData] = React.useState(defaultdata);
  const [listId, setListId] = React.useState(defaultdata.length);

  function createData(
    id,
    quantity = "",
    price = "",
    unitprice = "",
    unit = "",
    rank = ""
  ) {
    return {
      id,
      quantity,
      price,
      unitprice,
      unit,
      rank
    };
  }

  function calUnitPrice(item) {
    const unitprice = Number(
      Math.round((item.price * item.unit.scale) / item.quantity + "e5") + "e-5"
    );
    if (!isFinite(unitprice) || !unitprice) return "";

    return unitprice;
  }

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

  function rank(arr) {
    let newArr = arr;
    if (newArr === undefined) newArr = [...data];

    if (newArr.length > 1 && !isListError()) {
      let rankedArr = newArr;

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

    if (!arr) setData(newArr);

    return newArr;
  }

  function isListError() {
    let retVal = false;
    let type;
    data.forEach(function (item) {
      const unitType = item.unit.type;
      if (!item.unitprice) retVal = true;
      if (type && type !== unitType) retVal = true;
      else if (type === undefined) type = unitType;
    });
    return retVal;
  }

  function updateFieldChanged(index) {
    return (e) => {
      const newArr = [...data]; // copying the old datas array
      newArr[index][e.target.name] = e.target.value; // replace e.target.value with whatever you want to change it to

      updateUnitPrice(index);
      rank();
      setData(newArr);
    };
  }

  function onUnitChange(index) {
    return (e) => {
      const newArr = [...data]; // copying the old datas array
      //console.log(index);
      //console.log(JSON.parse(e.target.value));
      try {
        const unit = JSON.parse(e.target.value);
        newArr[index]["unit"] = unit;
      } catch (err) {
        //console.error(err.message);
        newArr[index]["unit"] = "";
      }
      updateUnitPrice(index);
      rank();
      setData(newArr);
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
    newArr = rank(newArr);
    setData(newArr);
  }

  return (
    <Container component="main">
      <div className={classes.root}>
        <TableContent
          data={data}
          updateFieldChanged={updateFieldChanged}
          onUnitChange={onUnitChange}
          rank={rank}
          removeItem={removeItem}
          addItem={addItem}
        />
      </div>
    </Container>
  );
}
