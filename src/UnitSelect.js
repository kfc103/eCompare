import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import { useStyles } from "./Styles";

export function unitValueJSON(type, name, scale, stdUnit) {
  return `{"type":"${type}","name":"${name}","scale":"${scale}","stdUnit":"${stdUnit}"}`;
}

export default function UnitSelect({ name, value, ...args }) {
  const classes = useStyles();

  let units = [];
  units.push({
    type: "Piece",
    values: [unitValueJSON("piece", "piece", "1", "piece")]
  });
  units.push({
    type: "Weight",
    values: [
      unitValueJSON("weight", "g", "1000", "kg"),
      unitValueJSON("weight", "kg", "1", "kg")
    ]
  });
  units.push({
    type: "Volume",
    values: [
      unitValueJSON("volume", "ml", "1000", "L"),
      unitValueJSON("volume", "L", "1", "L")
    ]
  });

  return (
    <FormControl className={classes.formControl} fullWidth>
      <InputLabel htmlFor="grouped-native-select">Unit</InputLabel>
      <Select
        name={name}
        native
        defaultValue={
          value
            ? JSON.stringify(value)
            : unitValueJSON("piece", "piece", "1", "piece")
        }
        id="grouped-native-select"
        onChange={args.onChange(args.index)}
      >
        {units.map((unit) => (
          <optgroup label={unit.type} key={unit.type}>
            {unit.values.map((value) => {
              const obj = JSON.parse(value);
              return (
                <option value={value} key={unit.type + obj.name}>
                  {obj.name}
                </option>
              );
            })}
          </optgroup>
        ))}
      </Select>
    </FormControl>
  );
}

//export { unitValue, UnitSelect };
