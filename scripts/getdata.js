import { createRequire } from "module";
const require = createRequire(import.meta.url);
var fs = require('fs');


let LicenseClass = '執照類別=使用執照';
let info = [];

async function fetchData(DataNumber) {
    try {
        const response = await fetch(`https://build.hccg.gov.tw/opendata/OpenDataSearchUrl.do?d=OPENDATA&c=BUILDLIC&Start=${DataNumber}&%E5%9F%B7%E7%85%A7%E9%A1%9E%E5%88%A5=%E4%BD%BF%E7%94%A8%E5%9F%B7%E7%85%A7`);
        const data_txt = await response.text();
        const data = JSON.parse(data_txt.slice(0, -1));

        data.data.forEach((element, index) => {
            if (element['地號'].length !== 0 && element['竣工日期'] !== '年月日') {
                element['地號'].forEach(data => {
                    info.push([data['行政區'] + data['地段'], data['地號母號'] +'-'+ data['地號子號'], element['竣工日期']]);
                });
            }
        });
    } catch (err) {
        console.log(err);
    }
}

// Example: Fetch data for DataNumber from 1 to 5
for (let i = 1; i <= 20601; i=i+100) {
    console.log(i)
    await fetchData(i.toString());
}
// await fetchData(1);
// info array now contains accumulated data from all fetch calls
// console.log(info);
fs.appendFile('./info.json',`${JSON.stringify(info)},\n`,(err)=>{
    if (err != null) {
        console.log(err)
        }
    })