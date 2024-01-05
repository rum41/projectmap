import {map} from './map.js'
document.addEventListener('DOMContentLoaded',()=>{
    //開啟收闔選單
    let context = document.getElementById('Opencontext');
    context.addEventListener('click',(event)=>{
        let GetElement=document.getElementById('TextSearch')
        let child=GetElement.children
        let getValue=child[1].value
        if (window.getComputedStyle(child[1]).display == 'none') {
            child[1].style.transition= "2s"
            child[1].style.display = 'block'
        } else {
            child[1].style.display = 'none'
        }
    });
    //搜尋地址並轉跳至該地址之經緯度
    let buttom = document.getElementById('serachbuttom');
    buttom.addEventListener('click',()=>{
        let gettextvalue=document.getElementById('textbox')
        fetch(`https://api.tomtom.com/search/2/geocode/${gettextvalue.value}.json?countrySet=TW&language=zh-TW&key=O4r3SdzA3z4XLoOqj4K6XyJHp20EEPSG`)
        .then(res=>res.json())
        .then(data=>{let d=data.results[0].position;map.flyTo([d.lat,d.lon],20);console.log(d)})
        .catch(err=>console.log(err))
        // fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${gettextvalue.value}.json?access_token=pk.eyJ1IjoicnVtNDEiLCJhIjoiY2xqbzdvOTdoMWNhODNycGtjNm05MDk3ayJ9.bDxNYRGSXJ9k2ZyKJnC2KA`)
        // .then(res=>res.json())
        // .then(data=>{
        //     let latlng =[data.features[0].geometry.coordinates[1],data.features[0].geometry.coordinates[0]]
        //     console.log(latlng)
        //     map.flyTo(latlng,15)
        // })
        
    });
})
