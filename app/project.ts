export async function getProjects() {
  const res = await fetch(
    "https://apis.dvrpc.org/internal/patip2025_p/tip/projects/list/_?limit=300"
  );
  const data = await res.json();
  return data.items;
}

export async function getProject(id: string) {
  const data = await fetch(
    `https://apis.dvrpc.org/internal/patip2025_p/tip/projects/id/${id}`
  );
  return await data.json();
}

export async function searchProjects(keyword: string | null, filters = "") {
  const res = await fetch(
    `https://apis.dvrpc.org/internal/patip2025_p/tip/projects/list/${
      keyword || "_"
    }?limit=300&${filters}`
  );
  const data = await res.json();
  return data.items;
}
