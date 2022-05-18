export async function getPoints(ids: string) {
  const data = await fetch(
    `https://arcgis.dvrpc.org/portal/rest/services/Transportation/PATIP_FY2023_2026_Point/FeatureServer/0/query`,
    {
      method: "POST",
      body: `where=MPMS_ID in (${ids}) and mappingfea <> 'Linear'&outFields=*&returnGeometry=true&outSR=4326&f=geojson`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  return await data.json();
}

export async function getLines(ids: string) {
  const data = await fetch(
    `https://arcgis.dvrpc.org/portal/rest/services/Transportation/PATIP_FY2023_2026_Line/FeatureServer/0/query`,
    {
      method: "POST",
      body: `where=MPMS_ID in (${ids})&outFields=*&returnGeometry=true&outSR=4326&f=geojson`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  return await data.json();
}
