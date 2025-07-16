import styles from "./CategoryIcon.css";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export default function CategoryIcon({
  categoryName,
}: {
  categoryName: string;
}) {
  if (categoryName) {
    return (
      <img
        title={categoryName}
        src={`https://www.dvrpc.org/tip/icons/${categoryName.replace(
          / |\//g,
          "-"
        )}.svg`}
        className="-mr-2 h-[62px] inline-block object-none scale-75 w-[62px]"
      />
    );
  } else {
    return null;
  }
}
