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
        src={`https://dvrpc.org/tip/icons/${categoryName.replace(/ |\//g, "-")}.svg`}
        className="inline-block w-[62px] h-[62px] scale-75 -mr-2 object-none"
      />
    );
  } else {
    return null;
  }
}
