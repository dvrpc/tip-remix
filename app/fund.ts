export async function getFunds() {
  const res = await fetch("https://apps.dvrpc.org/ords/patip2025_p/tip/funds");
  const data = await res.json();
  return data.items;
}
