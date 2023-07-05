export async function getFunds() {
  const data = await fetch("https://www.dvrpc.org/data/tip/2023/funds");
  return await data.json();
}