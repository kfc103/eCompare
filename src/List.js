import React from "react";
import Container from "@material-ui/core/Container";
import LinearProgress from "@material-ui/core/LinearProgress";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import ListContent from "./ListContent";
import { prepareDb, readAll, putItem, deleteItem } from "./Storage";
//import { putItem, deleteItem } from "./Storage";
import { unitValueJSON } from "./UnitSelect";
import { withStyles } from "@material-ui/core/styles";

const styles = (theme) => ({
  root: {
    width: "100vw",
    flexGrow: 1,
    //backgroundColor: theme.palette.background.paper,
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
    margin: "auto",
    bottom: theme.spacing(2) /*,
    right: theme.spacing(2)*/
  },
  flexbox: {
    display: "flex",
    position: "fixed",
    width: "100%",
    justifyContent: "center"
  }
});

/*List.propTypes = {
  classes: PropTypes.object.isRequired
};*/

class List extends React.Component {
  constructor(props) {
    super(props);

    this.state = { listId: 0, data: [], db: null, isBusy: true };

    this.addItem = this.addItem.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  async componentDidMount() {
    try {
      const db = await prepareDb();
      //console.log("db:" + db);

      const results = await readAll(db);
      //console.log("results: " + results);

      this.setState({
        listId: results.length,
        data: results,
        db: db,
        isBusy: false
      });
    } catch (e) {
      console.log("Cannot retrieve local record: set default value");
      this.setDefaultData();
    }
  }

  setDefaultData() {
    let defaultData = [createData(1), createData(2)];
    this.setState({
      listId: defaultData.length,
      data: defaultData,
      isBusy: false
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
    const newArr = this.state.data;

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
    let retVal = false;
    let unitType;

    arr.forEach(function (item) {
      const thisUnitType = item.unit.type;
      if (!item.unitprice) retVal = true;
      if (unitType && unitType !== thisUnitType) retVal = true;
      else if (unitType === undefined) unitType = thisUnitType;
    });

    return retVal;
  }

  async saveItem(item) {
    await putItem(this.state.db, item);
  }

  onChange(index) {
    return (e) => {
      //let newArr = [...this.state.data]; // copying the old datas array
      let newArr = this.state.data;

      if (e.target.name === "unit")
        newArr[index]["unit"] = JSON.parse(e.target.value);
      else newArr[index][e.target.name] = e.target.value; // replace e.target.value with whatever you want to change it to

      this.updateUnitPrice(index);
      this.rank();
      if (this.state.db) for (const item of newArr) this.saveItem(item);
      this.setState({ data: newArr });
    };
  }

  addItem() {
    //const newArr = [...this.state.data];
    const newArr = this.state.data;
    const newId = this.state.listId + 1;
    newArr.push(createData(newId));
    this.setState({ listId: newId, data: newArr });
  }

  removeItem(item) {
    //let newArr = [...this.state.data];
    let newArr = this.state.data;
    const id = item.id;
    newArr.splice(this.state.data.indexOf(item), 1);
    newArr = this.rank(newArr);
    if (this.state.db) {
      deleteItem(this.state.db, id).then(this.setState({ data: newArr }));
    } else this.setState({ data: newArr });
  }

  render() {
    //const classes = useStyles();
    //let classes = "";
    //if (this.props.classes) classes = this.props.classes;
    const { classes } = this.props;

    if (this.state.isBusy) return <LinearProgress />;
    else
      return (
        <Container
          component="main"
          className={classes.main}
          disableGutters={true}
        >
          <Container>
            <ListContent
              data={this.state.data}
              onChange={this.onChange}
              rank={this.rank}
              removeItem={this.removeItem}
              addItem={this.addItem}
            />
          </Container>
          <Container className={classes.flexbox}>
            <Fab
              color="primary"
              aria-label="add"
              className={classes.fab}
              onClick={() => this.addItem()}
            >
              <AddIcon />
            </Fab>
          </Container>
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

export default withStyles(styles, { withTheme: true })(List);
