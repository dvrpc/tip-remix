export async function getProjects() {
  const data = await fetch("https://www.dvrpc.org/data/TIP/2025/list");
  return await data.json();
}

export async function getProject(id: string) {
  const data = await fetch(`https://www.dvrpc.org/data/TIP/2025/id/${id}`);
  return await data.json();
}

export async function searchProjects(keyword: string | null, filters = "") {
  const data = await fetch(
    `https://www.dvrpc.org/data/TIP/2025/list/${
      keyword ? keyword : "_"
    }/${filters}`
  );
  return await data.json();
}
