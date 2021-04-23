// Dom elements 
let select=document.getElementById('drop-down');
let totalCases=document.getElementById('total')
let totalDeaths=document.getElementById('death')
let totalRecover=document.getElementById('recover')
let tbodyRef = document.getElementById('countriesData').getElementsByTagName('tbody')[0];

// event listeners  - register
select.addEventListener('change',OnCountryChange)
totalCases.addEventListener('click',TotalCases)
totalDeaths.addEventListener('click',TotalDeaths)
totalRecover.addEventListener('click',TotalRecovered)

// Using a aysnc function to fetch all data  from server.  Should run once when page loads
async function FetchAllData(){

    GetCountries()
    GetCountryData('world wide')
    GetCountriesData();
    PrepareGraph('cases','Cases')
    PrepareMap({ lat: 34.80746, lng: -40.4796 },3,'cases')
    PreparePieChart('world wide','World Wide')

}


// Drop down of countries and their names
function GetCountries(){
  // http request to server using ajax
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {

            var countries=JSON.parse(this.response)
              countries.data.map(country=>{
               let option =document.createElement('option')
               option.value=country.value
               option.textContent=country.name
               select.appendChild(option)
            })
        }
      };
      xhttp.open("GET", "/countries", true);
      xhttp.send();
}

// putting the country data in the card once a country is selected
function GetCountryData(country){
  
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {

              var countrtyData=JSON.parse(this.response)
              totalCases.childNodes[3].childNodes[1].textContent=prettyPrintStat(countrtyData.data.todayCases)
              
              // numeral is used to format data
              totalCases.childNodes[3].childNodes[3].textContent=`${numeral(countrtyData.data.cases).format("0.0a")} Total`

              totalDeaths.childNodes[3].childNodes[1].textContent=prettyPrintStat(countrtyData.data.todayDeaths)
              totalDeaths.childNodes[3].childNodes[3].textContent=`${numeral(countrtyData.data.deaths).format("0.0a")} Total`

              totalRecover.childNodes[3].childNodes[1].textContent=prettyPrintStat(countrtyData.data.todayRecovered)
              totalRecover.childNodes[3].childNodes[3].textContent=`${numeral(countrtyData.data.recovered).format("0.0a")} Total`

              //  Global variables for map with initial load values
              window.lat=34.80746
              window.long= -40.4796
              window.mapZoom=3
              if(country!='world wide'){
                let lat=countrtyData.data.countryInfo.lat
                let long=countrtyData.data.countryInfo.long
                window.lat=lat
                window.long=long
                window.mapZoom=5
                PrepareMap({lat:lat,lng:long},5)
              }
              else{
                PrepareMap({lat:window.lat,lng:window.long},window.mapZoom)
              }
              
            }
      };

      xhttp.open("POST", "/getCountryData", true);
      xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhttp.send(`country=${country}`);
}

// Get the Data to show it in the countries table
function GetCountriesData(){
  
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {

            var countriesData=JSON.parse(this.response)

              countriesData=sortData(countriesData.data)
              countriesData.map(data=>{
                 
            var newRow = tbodyRef.insertRow();

             var newCell1 = newRow.insertCell();
             var newCell2 = newRow.insertCell();

             var newText1 = document.createTextNode(data.country);
             var newText2 = document.createTextNode(numeral(data.cases).format("0.0a"));
             newCell1.appendChild(newText1);
             newCell2.appendChild(newText2);
              })

}
      };
      xhttp.open("GET", "/getCoutriesData", true);
      xhttp.send();
}

// This function will run when user selects a country from the dropdown box. cards and chart
function OnCountryChange(e){

    GetCountryData(e.target.value)
    PreparePieChart(e.target.value,e.target.selectedOptions[0].innerText)
}

// Card formatting
const prettyPrintStat = (stat) =>
  stat ? `+${numeral(stat).format("0.0a")}` : "+0";

 // Line Graph
  function PrepareGraph(casesType,title){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {

            var data=JSON.parse(this.response)
            
            let chartData=buildChartData(data.data,casesType)

          
            var config={
                type:'line',
                data:{
                  datasets: [
                    {
                      
                      backgroundColor: "rgba(204, 16, 52, 0.5)",
                      borderColor: "#CC1034",
                      data: chartData,
                    },
                  ],
                },
                options : {
                    legend: {
                      display: false,
                    },
                    
                    title:      {
                        display: true,
                        text:    `Total ${title}`
                    },
                    elements: {
                      point: {
                        radius: 0,
                      },
                    },
                    maintainAspectRatio: true,
                    tooltips: {
                      mode: "index",
                      intersect: false,
                      callbacks: {
                        label: function (tooltipItem, data) {
                          return numeral(tooltipItem.yLabel).format("+0,0");
                        },
                      },
                    },
                    scales: {
                      xAxes: [
                        {
                          type: "time",
                           time: {
                            format: "MM/DD/YY",
                            tooltipFormat: "ll",
                          },
                        },
                      ],
                      yAxes: [
                        {
                          gridLines: {
                            display: false,
                          },
                          ticks: {
                            
                            callback: function (value, index, values) {
                              return numeral(value).format("0a");
                            },
                          },
                        },
                      ],
                    },
                  }
            }
         
            // line graph population
            var ctx = document.getElementById("canvas").getContext("2d");

            // destroying old charts - not sure if you need to do this
            if (window.myLine) {
                window.myLine.destroy()
            }

            // new Chart
            window.myLine = new Chart(ctx, config);
           
           
        }
      };
      xhttp.open("GET", "/historicalData", true);
      xhttp.send();
  }
  
  // Changing cards
  function TotalCases(){


    AddRemoveClass(this)
    
    PrepareGraph('cases','Cases')
    PrepareMap({lat:window.lat,lng:window.long},window.mapZoom,'cases')
  }

  function TotalDeaths(){

    AddRemoveClass(this)

    PrepareGraph('deaths','Deaths')
     PrepareMap({lat:window.lat,lng:window.long},window.mapZoom,'deaths')

  }
  function TotalRecovered(){

    AddRemoveClass(this)

    PrepareGraph('recovered','Recovered')
    PrepareMap({lat:window.lat,lng:window.long},window.mapZoom,'recovered')
  }

  // Preparing map initial zoom, map centre 
  function PrepareMap(center,zoom,casesType='cases'){

    
    if (window.myMap != undefined) { window.myMap.remove(); }

    // crearing an instance of map
    window.myMap=L.map('map', {
      center: center,
      zoom: zoom
  });

  // map type 
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(window.myMap)

        var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var countriesData=JSON.parse(this.response)
            countriesData.data.map(country=>{
              // pop up data 
              let popupData=PopUpData(country.countryInfo.flag,country.country,country.cases,country.recovered,country.deaths)

              // Circle for each country on the map, colour lat and long
               L.circle([country.countryInfo.lat, country.countryInfo.long],{
                color:casesTypeColors[casesType].hex,
                fillColor:casesTypeColors[casesType].hex,
                fillOpacity:0.4,
                radius:Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
              }).bindPopup(popupData).addTo(window.myMap)
            
            })
 }
      };
      xhttp.open("GET", "/getCoutriesData", true);
      xhttp.send();
       
  }

  // Pie chart based on users selection
  function PreparePieChart(country,countryName){
    
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){

    if (this.readyState == 4 && this.status == 200){

      var countrtyData=JSON.parse(this.response)

      let pieChartData=PreparePieChartData(countrtyData.data)

      // data added + colour style
      var data = {
        labels: ["Cases", "Deaths","Recovered"],
          datasets: [
            {
                fill: true,
                backgroundColor: [
                    '#007bff',
                    '#dc3545',
                    '#17a2b8'],
                data: pieChartData,
                borderColor: "#fff"
            }
        ]
    };
    
    // Pie chart, set name and values
    var options = {
      title: {
                display: true,
                text: `Covid-19 Stats of ${countryName}`,
                position: 'top'
            },
            tooltips: {
              enabled: false
         },
         responsive:true
      
};

      var ctx=document.getElementById('pie-chart').getContext('2d')

      if (window.pieChart) {
        window.pieChart.destroy()
    }

      window.pieChart = new Chart(ctx, {
        type: 'pie',
        data: data,
        options: options
    });

    }   
  } 

    xhttp.open("POST", "/getCountryData", true);
      xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhttp.send(`country=${country}`);


  }

  function PopUpData(flag,name,cases,recovered,deaths){
    let div=`<div class="info-container">
    <div class="info-flag" style="background-image:url(${flag})">
    </div>
    <div class="info-name">${name}</div>
    <div class="info-confirmed">
            Cases: ${numeral(cases).format("0,0")}
          </div>
          <div class="info-recovered">
            Recovered: ${numeral(recovered).format("0,0")}
          </div>
          <div class="info-deaths">
            Deaths: ${numeral(deaths).format("0,0")}
          </div>
    </div>`
    return div

  }

  const casesTypeColors = {
    cases: {
      hex: "#CC1034",
      rgb: "rgb(204, 16, 52)",
      half_op: "rgba(204, 16, 52, 0.5)",
      multiplier: 200,
    },
    recovered: {
      hex: "#7dd71d",
      rgb: "rgb(125, 215, 29)",
      half_op: "rgba(125, 215, 29, 0.5)",
      multiplier: 200,
    },
    deaths: {
      hex: "#fb4443",
      rgb: "rgb(251, 68, 67)",
      half_op: "rgba(251, 68, 67, 0.5)",
      multiplier: 200,
    },
  };


 