interface InputProps {
  label: string;
  value: string;
  styles?: object;
  type?: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}

export default function Input({
  label,
  value,
  styles,
  type,
  setValue,
}: InputProps) {
  return (
    <label style={styles}>
      {label}:
      <input
        type={type ? type : ""}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="appearance-none bg-stone-600 flex-1 p-2 placeholder:text-stone-300 rounded shadow-[inset_0_0_0_1000px] shadow-stone-600 w-full"
      />
    </label>
  );
}
