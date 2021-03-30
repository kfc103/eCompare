import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import { useStyles } from "./Styles";

export default function TableContent({ data, ...args }) {
  const classes = useStyles();
  return (
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
              <TableCell>
                <TextField
                  name="price"
                  size="small"
                  type="number"
                  fullWidth
                  value={item.price}
                  onChange={args.updateFieldChanged(index)}
                />
              </TableCell>
              <TableCell align="right">
                <TextField
                  name="quantity"
                  size="small"
                  type="number"
                  fullWidth
                  value={item.quantity}
                  onChange={args.updateFieldChanged(index)}
                />
              </TableCell>
              <TableCell align="right">{item.unitprice}</TableCell>
              <TableCell align="right">{item.rank}</TableCell>
              <TableCell align="right">
                <IconButton
                  aria-label="delete"
                  onClick={() => args.removeItem(item)}
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
                  return args.addItem();
                }}
              >
                <AddIcon />
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
