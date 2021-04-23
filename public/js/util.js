
// daily chart data
function buildChartData(data, casesType) {
      
    let chartData = [];
    let lastDataPoint;
    for (let date in data.cases) {
      if (lastDataPoint) {
        let newDataPoint = {
          x: date,
          y: Math.abs(data[casesType][date] - lastDataPoint),
        };
        chartData.push(newDataPoint);
      }
      lastDataPoint = data[casesType][date];
    }
    return chartData;
  };

  // sort countries high to low
  const sortData = (data) => {
    let sortedData = [...data];
    sortedData.sort((a, b) => {
      if (a.cases > b.cases) {
        return -1;
      } else {
        return 1;
      }
    });
    return sortedData;
  };

  function PreparePieChartData(data){
    let chartData=[]
    chartData.push(Math.round((data.cases/data.cases)*360))
   chartData.push(Math.round((data.deaths/data.cases)*360))
   chartData.push(Math.round((data.recovered/data.cases)*360))
   return chartData

  }

  function AddRemoveClass(element){
    var current = document.getElementsByClassName("active");
    // If there is active class
    if (current.length > 0) {
      current[0].className = current[0].className.replace(" active", "");
    }
    element.className += " active";
  }