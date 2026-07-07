

const bttn=document.getElementById("bttn");
const srch=document.getElementById("srch")

const image=document.getElementById("image")
const weathericon=document.getElementById("weathericon")

const temp=document.getElementById("temp");
const cityName=document.getElementById("cityName");
const description=document.getElementById("description");
const humidity=document.getElementById("humidity");
const wind=document.getElementById("wind");
const hum=document.getElementById("hum");
const win=document.getElementById("win")

const btn=document.getElementById("btn");
const fav=document.getElementById("fav");
const heart=document.getElementById("heart")
const favoriteList=document.getElementById("favoriteList")
const loading=document.getElementById("loading")


btn.addEventListener("click", ()=>{
    document.body.classList.toggle("dark")

 if(document.body.classList.contains("dark")){
    btn.textContent= "🌙 "
 }
 else{
    btn.textContent="☀️"
 }
});



srch.addEventListener("input",()=>{
    debounce(()=>{
        const city=srch.value.trim();
        if(city!==""){
            getWeather(city);
        }
    },600)
});
//debounce fn
let timer;
function debounce(callback,delay){
    clearTimeout(timer);
    timer=setTimeout(()=>{
        callback();
    },delay)
}

let isFavorite=false;
let favoriteCities=JSON.parse(localStorage.getItem("favorites")) || [];
fav.addEventListener("click",()=>{
    const city=cityName.textContent;
    if(city==="" || city==="City not found"){
        return
    }
    if(isFavorite){
        heart.src="emptylove.png";
        isFavorite=false;

        favoriteCities=favoriteCities.filter(
            favoriteCities => favoriteCities !== city
        );
    }else{
        heart.src="filledlove.png";
        isFavorite=true;

        if(!favoriteCities.includes(city)){
            favoriteCities.push(city);
        }
    }
    localStorage.setItem("favorites",JSON.stringify(favoriteCities));
    showfavorites()
});


const API_KEY="963d234f2e58acc8a5da1b1df3a5433f";

async function getWeather(city){
try{
    loading.style.display="block";
    const url=`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

    const response= await fetch(url);
    const data=await response.json();
        // console.log(data)

            if(data.cod=="404"){
                loading.style.display="none";
                cityName.textContent="City not found";
                description.textContent="";
                temp.textContent="";
                humidity.textContent="";
                wind.textContent="";
                hum.style.display="none";
                win.style.display="none";

                weathericon.style.display="flex";

                return;
    }

    temp.textContent=Math.round(data.main.temp)+"°C";
    cityName.textContent=data.name;

    isFavorite=favoriteCities.includes(data.name);
    if(isFavorite){
        heart.src="filledlove.png";
    }else{
        heart.src="emptylove.png"
    }

    description.textContent=data.weather[0].description;
    humidity.textContent="Humidity: "+data.main.humidity+"%";
    wind.textContent="Wind: "+data.wind.speed+"m/s";

    hum.style.display="flex";
    win.style.display="flex";

     image.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
     weathericon.style.display="flex";
     loading.style.display="none";
}catch(error){
    loading.style.display="none";
    console.log(error);
    alert("something went wrong")
}
}


function showfavorites(){
     favoriteList.innerHTML="";

     favoriteCities.forEach((city)=>{
        const p=document.createElement("p");
        p.textContent=city;
        p.style.cursor="pointer"; 
        p.addEventListener("click", (e)=>{
            getWeather(city);
            srch.value = city;
        });

         const removeBtn=document.createElement("span");
         removeBtn.textContent="❌";
         removeBtn.style.cursor="pointer";

         removeBtn.addEventListener("click",(e)=>{
            e.stopPropagation(); 
            favoriteCities=favoriteCities.filter(c=>c!==city);
            localStorage.setItem("favorites",JSON.stringify(favoriteCities));

            if(cityName.textContent===city){
                isFavorite=false;
                heart.src="emptylove.png"
            }
            showfavorites();
         });
         p.appendChild(removeBtn);
        favoriteList.appendChild(p);
     });

}

    showfavorites()
