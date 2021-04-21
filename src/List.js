import React from "react";
import PropTypes from "prop-types";
import Container from "@material-ui/core/Container";
import LinearProgress from "@material-ui/core/LinearProgress";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import ListContent from "./ListContent";
import { withStyles } from "@material-ui/styles";
import { useStyles } from "./Styles";
import { prepareDb, readAll, putItem, deleteItem } from "./Storage";
import { unitValueJSON } from "./UnitSelect";

class List extends React.Component {
  constructor(props) {
    super(props);

    this.state = { listId: 0, data: [], db: null, isBusy: false };

    this.addItem = this.addItem.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    prepareDb().then(
      // resolved
      (db) => {
        //console.log("prepareDb: resolve", db);
        readAll(db).then(
          // resolved
          (results) => {
            //console.log("Results", results);
            this.setState({
              listId: results.length,
              data: results,
              db: db,
              isBusy: true
            });
          },
          // rejected
          () => {
            console.log("readAll: rejected");
            this.setDefaultData();
          }
        );
      },
      // rejected
      () => {
        console.log("prepareDb: rejected");
        this.setDefaultData();
      }
    );
  }

  setDefaultData() {
    let defaultData = [createData(1), createData(2)];
    this.setState({
      listId: defaultData.length,
      data: defaultData,
      isBusy: true
    });
  }

  calUnitPrice(item) {
    const unitprice = Number(
      Math.round((item.price * item.unit.scale) / item.quantity + "e5") + "e-5"
    );
    if (!isFinite(unitprice) || !unitprice) return "";

    return unitprice;
  }

  updateUnitPrice(index) {
    let newArr = [...this.state.data];

    if (index === undefined) {
      newArr.forEach((item) => {
        item.unitprice = this.calUnitPrice(item);
      });
    } else {
      newArr[index].unitprice = this.calUnitPrice(newArr[index]);
    }

    this.setState({ data: newArr });
  }

  rank(arr) {
    let newArr = arr;
    if (newArr === undefined) newArr = [...this.state.data];

    if (newArr.length > 1 && !this.isListError(newArr)) {
      let rankedArr = newArr;

      rankedArr.sort((a, b) => {
        return a.unitprice - b.unitprice;
      });

      newArr.forEach((item) => {
        if (item.unitprice === "") item.rank = 0;
        else {
          if (item.unitprice === rankedArr[0].unitprice) item.rank = 3;
          else if (item.unitprice === rankedArr[1].unitprice) item.rank = 2;
          else if (item.unitprice === rankedArr[2].unitprice) item.rank = 1;
          else item.rank = 0;
        }
      });
    } else {
      newArr.forEach((item) => {
        item.rank = 0;
      });
    }

    if (!arr) this.setState({ data: newArr });

    return newArr;
  }

  isListError(arr) {
    let newArr = arr;
    if (newArr === undefined) newArr = [...this.state.data];
    let retVal = false;
    let type;

    newArr.forEach(function (item) {
      const unitType = item.unit.type;
      if (!item.unitprice) retVal = true;
      if (type && type !== unitType) retVal = true;
      else if (type === undefined) type = unitType;
    });
    return retVal;
  }

  onChange(index) {
    return (e) => {
      const newArr = [...this.state.data]; // copying the old datas array

      if (e.target.name === "unit")
        newArr[index]["unit"] = JSON.parse(e.target.value);
      else newArr[index][e.target.name] = e.target.value; // replace e.target.value with whatever you want to change it to

      this.updateUnitPrice(index);
      this.rank();
      if (this.state.db) {
        putItem(this.state.db, newArr[index]).then(
          this.setState({ data: newArr })
        );
      } else this.setState({ data: newArr });
    };
  }

  addItem() {
    const newArr = [...this.state.data];
    const newId = this.state.listId + 1;
    newArr.push(createData(newId));
    this.setState({ listId: newId, data: newArr });
  }

  removeItem(item) {
    let newArr = [...this.state.data];
    const id = item.id;
    newArr.splice(this.state.data.indexOf(item), 1);
    newArr = this.rank(newArr);
    if (this.state.db) {
      deleteItem(this.state.db, id).then(this.setState({ data: newArr }));
    } else this.setState({ data: newArr });
  }

  render() {
    //const classes = useStyles();
    const classes = this.props.classes;
    return (
      <Container component="main">
        {!this.state.isBusy ? <LinearProgress /> : null}
        <ListContent
          data={this.state.data}
          onChange={this.onChange}
          rank={this.rank}
          removeItem={this.removeItem}
          addItem={this.addItem}
        />
        <Fab
          color="primary"
          aria-label="add"
          className={classes.fab}
          onClick={() => this.addItem()}
        >
          <AddIcon />
        </Fab>
      </Container>
    );
  }
}

export function createData(
  id,
  quantity = "",
  price = "",
  unitprice = "",
  unit = JSON.parse(unitValueJSON("piece", "piece", "1", "piece")),
  rank = 0
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

export default List;
