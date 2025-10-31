export async function getFunds() {
  const res = await fetch(
    "https://apis.dvrpc.org/internal/njtip2024comment/tip/funds"
  );
  const data = await res.json();
  return data.items;
}
