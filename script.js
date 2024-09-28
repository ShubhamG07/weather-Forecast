const apiKey = '8R87UFWY68A5AU7KZSD3KPBDY'; 
const currenContainer = document.getElementById("currentContainer");
const currentDetails = document.getElementById('currentdetails');
const currentImage = document.getElementById('currentimage');

document.getElementById('searchButton').addEventListener('click', () => {
    const location = document.getElementById('inputLocation').value;
    fetchWeatherData(location);
});

function fetchWeatherData(location) {

    

    currentDetails.innerHTML = '';
    currentImage.innerHTML = '';

    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(location)}?unitGroup=metric&key=${apiKey}&contentType=json`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Location not found');
            }
            return response.json();
        })
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            currenContainer.classList.remove("hide");
            currenContainer.classList.add("currentDetailsError");
            currentDetails.innerHTML = `<p style="font-weight:bold; font-size:25px">${error.message}</p>`;
        });
}

function displayWeather(data) {

    currenContainer.classList.remove("currentDetailsError");

    const title = `Weather in ${data.address } (${data.days[0].datetime})`;
    const temperature = `Temperature : ${data.currentConditions.temp} °C  ( feels like ${data.currentConditions.feelslike} )`;
    const condtion = ` Condition: ${data.currentConditions.conditions}`;
    const humidity = ` Humidity: ${data.currentConditions.humidity}%`;
    const currentCondition = data.currentConditions.conditions;
    const windSpeed=`Wind : ${data.currentConditions.windspeed} km/h`


currenContainer.classList.remove("hide");
    const weatherHTML = `
        <h2> ${title}</h2>
        <p>${temperature } </p>
        <p>${condtion}</p>
        <p>${humidity}</p>
        <img src="icons/${data.currentConditions.icon}.png" alt="${data.currentConditions.conditions}" >
    `;
  
    // currentResult.innerHTML = weatherHTML;

    let item1 = document.createElement("h2");
    item1.innerHTML=title;
    item1.classList.add("title");
    let item2= document.createElement("p");
    item2.innerHTML=temperature;
    item2.classList.add('text-xl' ,'my-5');
    let item3= document.createElement("p");
    item3.innerHTML=condtion;
    item3.classList.add('text-xl' ,'my-5');
    let item4= document.createElement("p");
    item4.innerHTML=humidity;
    item4.classList.add('text-xl' ,'my-5');
    let item7= document.createElement("p");
    item7.innerHTML=windSpeed;
    item7.classList.add('text-xl' ,'my-5');
    let item5 =document.createElement("div");
    item5.classList.add("weatherimage");
    
    item5.innerHTML= `<img src="icons/${data.currentConditions.icon}.png" alt="${data.currentConditions.conditions}" height=100px width=100px >`;

    let item6 =document.createElement("p");
    item6.innerHTML=`${data.currentConditions.conditions}`;

    
    currentDetails.appendChild(item1);
    currentDetails.appendChild(item2);
    currentDetails.appendChild(item3);
    currentDetails.appendChild(item4);
    currentDetails.appendChild(item7);
    currentImage.appendChild(item5);
    currentImage.appendChild(item6);
    
}
