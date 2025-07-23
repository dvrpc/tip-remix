export async function getProjects() {
  const data = await fetch("https://www.dvrpc.org/data/TIP/2026/list");
  return await data.json();
}

export async function getProject(id: string) {
  const data = await fetch(`https://www.dvrpc.org/data/TIP/2026/id/${id}`);
  return await data.json();
}

export async function searchProjects(
  keyword: string | null,
  filters = "",
  mapped = true
) {
  const data = await fetch(
    `https://www.dvrpc.org/data/TIP/2026/list/${
      keyword ? keyword : "_"
    }/${filters}?mapped=${mapped ? 1 : 0}`
  );
  return await data.json();
}
