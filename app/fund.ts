export async function getFunds() {
  const res = await fetch(
    "https://apis.dvrpc.org/internal/njtip2026comment/tip/funds"
  );
  const data = await res.json();
  return data.items;
}
