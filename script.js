const apiKey = '8R87UFWY68A5AU7KZSD3KPBDY'; 
const currenContainer = document.getElementById("currentContainer");
const currentDetails = document.getElementById('currentdetails');
const currentImage = document.getElementById('currentimage');
const forecastContainer =document.getElementById("forecast");
const locationInput = document.getElementById('inputLocation');
const suggestionsContainer = document.getElementById('suggestionsContainer');

let searchedLocations = JSON.parse(sessionStorage.getItem('searchedLocations')) || [];

locationInput.addEventListener('input', () => {
    const inputValue = locationInput.value.toLowerCase();
    suggestionsContainer.innerHTML = '';

    const suggestions = searchedLocations.filter(location => location.toLowerCase().includes(inputValue));

    suggestions.forEach(location => {
        const suggestionItem = document.createElement('div');
        suggestionItem.textContent = location;
        suggestionItem.classList.add('suggestion-item');
        suggestionItem.onclick = () => {
            locationInput.value = location; // Set input to the selected suggestion
            suggestionsContainer.innerHTML = ''; // Clear suggestions
            // fetchWeatherData(location); // Fetch weather for the selected location
        };
        suggestionsContainer.appendChild(suggestionItem);
    });
});

document.getElementById('searchButton').addEventListener('click', () => {
    const location = locationInput.value.trim();
    if (location) {
        // Add the location to the list and save to localStorage
        if (!searchedLocations.includes(location)) {
            searchedLocations.push(location);
            sessionStorage.setItem('searchedLocations', JSON.stringify(searchedLocations));
        }
       
    }
});


document.getElementById('searchButton').addEventListener('click', () => {
    const location = document.getElementById('inputLocation').value;
    fetchWeatherData(location);
});

function fetchWeatherData(location) {

    forecastContainer.innerHTML = '';

    currentDetails.innerHTML = '';
    currentImage.innerHTML = '';

    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(location)}?unitGroup=metric&key=${apiKey}&contentType=json`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Location not found. Please Check for Spelling Mistake !');
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


// using current location button 

document.getElementById('currentLocation').addEventListener('click', () => {
    console.log("search button clicked");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            reverseGeocode(lat, lon);
        }, error => {
            console.error(error);
            alert("Unable to retrieve your location. Please check your browser settings.");
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
});

function reverseGeocode(lat, lon) {
    const reverseGeocodeUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;

    fetch(reverseGeocodeUrl)
        .then(response => response.json())
        .then(data => {
            const locationName = data.display_name; 
            fetchWeatherData(locationName);
        })
        .catch(error => {
            console.error("Error fetching location name:", error);
            alert("Could not retrieve location name.");
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
forecastContainer.classList.remove("hide");
document.getElementById("forecastTitle").classList.remove("hide");
    // const weatherHTML = `
    //     <h2> ${title}</h2>
    //     <p>${temperature } </p>
    //     <p>${condtion}</p>
    //     <p>${humidity}</p>
    //     <img src="icons/${data.currentConditions.icon}.png" alt="${data.currentConditions.conditions}" >
    // `;
  
    // // currentResult.innerHTML = weatherHTML;

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
    
//  let item8 = document.createElement("p");
//  item8.innerHTML=`test : ${data.days[1].cloudcover}`
    
    currentDetails.appendChild(item1);
    currentDetails.appendChild(item2);
    currentDetails.appendChild(item3);
    currentDetails.appendChild(item4);
    currentDetails.appendChild(item7);
    // currentDetails.appendChild(item8);
    currentImage.appendChild(item5);
    currentImage.appendChild(item6);

    // loop function for 5 day forecast 

    for(let i=1;i<6;i++){

        // craeting each card for 1 day data 

        let dataContainer =document.createElement("div");
      

        // creating and storing data of forecast for each day 

        let data1 =document.createElement("p");
        data1.innerHTML=`${data.days[i].datetime}`;
        let data2 =document.createElement("p");
        data2.innerHTML=`<img src="icons/${data.days[i].icon}.png" alt="${data.days[i].conditions}" >`;
        let data3 =document.createElement("p");
        data3.innerHTML=`Temp : ${data.days[i].temp} °C `;
        let data4 =document.createElement("p");
        data4.innerHTML=`Wind : ${data.days[i].windspeed} km/hr`;
        let data5 =document.createElement("p");
        data5.innerHTML=`Humidity : ${data.days[i].humidity} %`;

        // appending all data to our container 

        dataContainer.appendChild(data1);
        dataContainer.appendChild(data2);
        dataContainer.appendChild(data3);
        dataContainer.appendChild(data4);
        dataContainer.appendChild(data5);

        dataContainer.classList.add("forecastCard");
      
        //appending it tour html div

        forecastContainer.appendChild(dataContainer);

    }
    
}
