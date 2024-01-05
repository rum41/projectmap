// import data from 'http://rumm41.ddns.net/leafjs/data/tgosdata.json' assert{type:'json'}
// import geojson from '../data/TOWN_MOI_1120825.json' assert{type:'json'}
// import {createRequire} from 'module';
// const require = createRequire(import.meta.url)
// require('leaflet-graphicscale');
//OPENSTREET圖資https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
// const baseEMAP = L.tileLayer('https://wmts.nlsc.gov.tw/wmts/EMAP6/default/GoogleMapsCompatible/{z}/{y}/{x}', {
//   maxNativeZoom: 50,
//   maxZoom: 19
// });
// let map = L.map('map', {
//     layers: [baseEMAP],
//     center: [24.802009, 120.9869], // 台灣中心點24.80395, 120.9647
//     zoom: 19
// });
const fetchdata=async()=>{
  const res=await fetch('data/tgosdata.json')
  const data=await res.json()
  return data
}

const fetchgeo= async()=>{
  const res = await fetch('data/TOWN_MOI_1120825.json')
  const data=await res.json()
  return data
}
const data= await fetchdata()
const geodata=await(fetchgeo())

const baseEMAP = L.tileLayer('https://wmts.nlsc.gov.tw/wmts/EMAP6/default/GoogleMapsCompatible/{z}/{y}/{x}', {
  attribution:"© OpenStreetMap | © Scale nerik",
  maxNativeZoom: 50,
  maxZoom: 19
});
let map = L.map('map', {
    layers: [baseEMAP],
    center: [24.802009, 120.9869], // 台灣中心點24.80395, 120.9647
    zoom: 11
});

let geolayer = L.geoJSON(geodata).bindPopup(function (layer) {
  return layer.feature.properties.T_Name;
}).addTo(map);
map.fitBounds(geolayer.getBounds());

var graphicScale = L.control.graphicScale({doubleLine:true, fill:'fill'}).addTo(map);

let marker=[]
let cluster = L.markerClusterGroup({
  // spiderfyOnMaxZoom: true,
  // showCoverageOnHover: true,
  // zoomToBoundsOnClick: true,
  disableClusteringAtZoom:19  // 當地圖縮放到19級時停止聚合
})




let colordata={
    '#100a05':[39,50],
    '#372311':[51,60],
    '#5f3b1c':[61,70],
    '#865428':[71,80],
    '#ad6c34':[81,90],
    '#c9854b':[91,100],
    '#d5a072':[101,110],
    '#e1ba99':[111,112]
}

function getcolor(year) {
    for (const [keys, value] of Object.entries(colordata)) {
        if (year >= value[0] && year <= value[1]) {
            return keys;
        }
    }
    // If no match is found, you may want to return a default color or handle this case accordingly.
    return '#000';
}

const ROCyear=(dateprocess)=>{
  if(dateprocess.length == 4){
    return parseInt(dateprocess-1911)
  }else{
    return parseInt(dateprocess)
  }
}

  for (var i = 0; i < data.length; i++) {
    const dateprocess= data[i][4].slice(0,data[i][4].indexOf('年'))
    const year = ROCyear(dateprocess)
    var location = [data[i][3], data[i][2]];
    let color= getcolor(year)
    if (year<111){
      var circleMarker = L.circleMarker(location, {
        fillColor: color,
        color: color,
        weight: 10,
        // fillOpacity: 0.1,
        opacity:0.7,
        radius: 3
      })
      marker.push(circleMarker)
      
      cluster.addLayer(circleMarker);
      circleMarker.bindPopup("<b>" + data[i][1] + "</b><br>" + "竣工日期: " + data[i][4]+"</b><br>"+"屋齡:"+String(ny()-parseInt(year)));
      
    }
    
    
    
  
    // Add popup information
    
  }
  
map.addLayer(cluster)
function ny(){
  const date=new Date()
  return date.getFullYear()-1911;
}

export{map}