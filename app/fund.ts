export async function getFunds() {
  const data = await fetch("https://www.dvrpc.org/data/tip/2025/funds");
  return await data.json();
}
