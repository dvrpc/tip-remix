export async function getProjects() {
  const data = await fetch("https://www.dvrpc.org/data/TIP/2023/list");
  return await data.json();
}

export async function getProject(id) {
  const data = await fetch(`https://www.dvrpc.org/data/TIP/2023/id/${id}`);
  return await data.json();
}

export async function searchProjects(keyword = "", filters = "") {
  console.log(
    "searchProjects",
    `https://www.dvrpc.org/data/TIP/2023/list/${keyword}/${filters}`
  );
  const data = await fetch(
    `https://www.dvrpc.org/data/TIP/2023/list/${keyword}/${filters}`
  );
  return await data.json();
}
