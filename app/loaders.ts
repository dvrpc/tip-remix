export async function getPoints(ids: string) {
  const data = await fetch(
    `https://arcgis.dvrpc.org/portal/rest/services/Transportation/NJTIP_FY2024_2027_Point/FeatureServer/0/query?`,
    {
      method: "POST",
      body: `where=1=1&outFields=*&f=geojson`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  return await data.json();
}

export async function getLines(ids: string) {
  const data = await fetch(
    `https://arcgis.dvrpc.org/portal/rest/services/Transportation/NJTIP_FY2024_2027_Line/FeatureServer/0/query`,
    {
      method: "POST",
      body: `where=1=1&outFields=*&f=geojson`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  return await data.json();
}
