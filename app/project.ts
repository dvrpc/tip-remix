export async function getProjects() {
  const res = await fetch(
    "https://apis.dvrpc.org/internal/njtip2026comment/tip/projects/list/_?limit=300"
  );
  const data = await res.json();
  return data.items;
}

export async function getProject(id: string) {
  const data = await fetch(
    `https://apis.dvrpc.org/internal/njtip2026comment/tip/projects/id/${id}`
  );
  return await data.json();
}

export async function searchProjects(
  keyword: string | null,
  filters = "",
  mapped = true
) {
  const res = await fetch(
    `https://apis.dvrpc.org/internal/njtip2026comment/tip/projects/list/_${filters}?mapped=${
      mapped ? 1 : 0
    }&limit=300`
  );
  const data = await res.json();
  return data.items;
}
