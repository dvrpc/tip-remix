export async function getPoints(ids: string) {
  const param = ids.split(',').map(id => `'${id}'`)
  const data = await fetch(
    `https://arcgis.dvrpc.org/portal/rest/services/Transportation/NJTIP_FY2024_2027_Point/FeatureServer/0/query`,
    {
      method: "POST",
      body: `where=dbnum in (${param.toString()}) and mapfea <> 'Linear'&returnGeometry=true&outSR=4326&outFields=*&f=geojson`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  return await data.json();
}

export async function getLines(ids: string) {
  const param = ids.split(',').map(id => `'${id}'`)
  const data = await fetch(
    `https://arcgis.dvrpc.org/portal/rest/services/Transportation/NJTIP_FY2024_2027_Line/FeatureServer/0/query`,
    {
      method: "POST",
      body: `where=dbnum in (${param.toString()})&outFields=*&returnGeometry=true&outSR=4326&f=geojson`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  return await data.json();
}
