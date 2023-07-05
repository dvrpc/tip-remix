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
    const className = `category-${categoryName.replace(/ /g, "_")}`;
    return (
      <img
        title={categoryName}
        src="https://tiles.dvrpc.org/data/styles/dvrpc-pa-tip/sprite.png"
        className={`inline-block w-[62px] h-[62px] scale-75 -mr-2 object-none ${className}`}
      />
    );
  } else {
    return null;
  }
}
