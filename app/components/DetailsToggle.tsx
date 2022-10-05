import ReactSelect, { MultiValue, SingleValue } from "react-select";

export default function DetailsToggle({
  filter,
  setFilter,
  name,
  title,
  options,
  submit,
  multiple = false,
  deselect = false,
  onChange = (val: any) => {
    setFilter(val);
    setTimeout(() => submit(), 1);
  },
}: {
  filter:
    | MultiValue<{
        value: string;
        label: string;
      }>
    | SingleValue<{
        value: string;
        label: string;
      }>;
  setFilter: (
    filter:
      | MultiValue<{
          value: string;
          label: string;
        }>
      | SingleValue<{
          value: string;
          label: string;
        }>
  ) => void;
  name: string;
  title: string;
  options:
    | MultiValue<{
        value: string;
        label: string;
      }>
    | SingleValue<{
        value: string;
        label: string;
      }>;
  submit: () => void;
  multiple?: boolean;
  deselect?: boolean;
  onChange?: Function;
}) {
  if (options === undefined || options === null) {
    return null;
  }
  const opts =
    Object(options[0]) === options[0]
      ? options
      : options.map((o) => ({ value: o, label: o }));

  return (
    <ReactSelect
      value={filter && filter[0]?.value?.length ? filter : null}
      onChange={onChange}
      options={opts}
      className="react-select"
      classNamePrefix="react-select"
      isMulti={multiple}
      name={name}
      placeholder={title}
      isClearable={deselect}
    />
  );
}
