import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import { useStyles } from "./Styles";

function unitValue(type, name, scale, stdUnit) {
  return `{ "type": "${type}", "name": "${name}", "scale": "${scale}", "stdUnit": "${stdUnit}" }`;
}

export default function UnitSelect({ data, ...args }) {
  const classes = useStyles();
  return (
    <FormControl className={classes.formControl} fullWidth>
      <InputLabel htmlFor="grouped-native-select">Unit</InputLabel>
      <Select
        native
        defaultValue=""
        id="grouped-native-select"
        onChange={args.onChange(args.index)}
      >
        <option aria-label="None" value="" />
        <optgroup label="Piece">
          <option value={unitValue("piece", "piece", "1", "piece")}>
            Piece
          </option>
        </optgroup>
        <optgroup label="Weight">
          <option value={unitValue("weight", "g", "0.001", "kg")}>g</option>
          <option value={unitValue("weight", "kg", "1", "kg")}>kg</option>
        </optgroup>
      </Select>
    </FormControl>
  );
}
