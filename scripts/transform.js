import { monitorEventLoopDelay } from 'perf_hooks';
import OrginalData from '../data/datav2.json' assert { type: 'json' };
import { createRequire } from "module";
import { text } from 'express';
import { Agent } from 'http';
import { emitKeypressEvents } from 'readline';
const require = createRequire(import.meta.url);

var fs = require('fs');
const info = [];
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const getdata = async (Query_value) => {
    const license = '執照類別=使用執照';
    try {
        const response = await fetch(`http://build.hccg.gov.tw/opendata/OpenDataSearchUrl.do?d=OPENDATA&c=BUILDLIC&Start=${Query_value}&${license}`);
        const processdata = JSON.parse((await response.text()).slice(0, -1)).data;

        for (const element of processdata) {
            if (element['門牌'][0] != null && element['門牌'][0]['行政區'] != '' && element['門牌'][0]['號'] != '' && element['竣工日期'] != '年月日') {
                const latlon = await geocoding(element['門牌'][0]['行政區'] + element['門牌'][0]['路街段巷弄'] + element['門牌'][0]['號']);
                // console.log(element);
                fs.appendFile('../data/processdata.json',`${JSON.stringify([element['門牌'][0]['行政區'] + element['門牌'][0]['路街段巷弄'] + element['門牌'][0]['號'],latlon,element['竣工日期']])}, \n`,(err)=>{
                    if (err) throw err;
                    console.log('The "data to append" was appended to file!');
                })
                info.push([element['門牌'][0]['行政區'] + element['門牌'][0]['路街段巷弄'] + element['門牌'][0]['號'],latlon,element['竣工日期']]);
                // Add a delay of 1 second (1000 milliseconds) between requests
                // await delay(100);
            }
        }
    } catch (err) {
        console.log(err);
    }
};

const geocoding = async (address) => {
    const apiKey = 'AIzaSyCbpvbDVpMZqFXxIRMAPfXIWvXpm50-_8o'; // Replace with your actual API key
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.status === 'OK') {
            const location = data.results[0].geometry.location;
            const latitude = location.lat;
            const longitude = location.lng;
            return `${latitude}, ${longitude}`;
        } else {
            console.error(`無法找到 ${address} 對應的經緯度`);
        }
    } catch (err) {
        console.log(err);
    }
};

const fetchData = async () => {
    for (let index = 1; index < 20701; index = index + 100) {
        const data=await getdata(index)
        // info.push(data)
    }

    return info
};

await fetchData();
console.log(info)

// await getdata(1)
// const info=[]
// const getdata=async(Query_value)=>{
//     const license='執照類別=使用執照'
//     try{
//         const response=await fetch(`http://build.hccg.gov.tw/opendata/OpenDataSearchUrl.do?d=OPENDATA&c=BUILDLIC&Start=${Query_value}&${license}`)
//         const processdata=JSON.parse((await response.text()).slice(0, -1)).data
        
//         processdata.forEach(async element => {
           
//             if (element['門牌'][0] != null && element['門牌'][0]['行政區'] != ''){
//                 const latlon=await geocoding(element['門牌'][0]['行政區']+element['門牌'][0]['路街段巷弄']+element['門牌'][0]['號'])
//                 console.log(latlon)
//                 return latlon
//             }
//         });
//     }catch (err){
//         console.log(err)
//     }
// }

// const geocoding=async(address)=>{
//     const apiKey = 'AIzaSyCbpvbDVpMZqFXxIRMAPfXIWvXpm50-_8o';
//     const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
//     try{
//         const response=await fetch(url)
//         const data= await response.json()
//         if (data.status === 'OK') {
//             const location = data.results[0].geometry.location;
//             const latitude = location.lat;
//             const longitude = location.lng;
//             return `${latitude}, ${longitude}`
//           } else {
//             console.error(`無法找到 ${address} 對應的經緯度`);
//           }

//     }catch (err){
//         console.log(err)
//     }
// }


// for (let index = 1; index<20701; index=index+100) {
//     console.log(index)
//     const data=await getdata(index)
//     info.push(data)
// }

// console.log(info)

