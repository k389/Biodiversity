// create a dropdown menu of ID numbers dynamically
function init() {
  var selector = d3.select("#selDataset");

  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    optionChanged(sampleNames[0]);
  })
}



// buildMetadata fuction to populate the Demographics table based on ID numbers
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var PANEL = d3.select("#sample-metadata");

    PANEL.html("");
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
    // PANEL.append("h6").text(`ID: ${result.id}`);
    // PANEL.append("h6").text(`ETHNICITY: ${result.ethnicity}`);
    // PANEL.append("h6").text(`GENDER: ${result.gender}`);
    // PANEL.append("h6").text(`AGE: ${result.age}`);
    // PANEL.append("h6").text(`LOCATION: ${result.location}`);
    // PANEL.append("h6").text(`BBTYPE: ${result.bbtype}`);
    // PANEL.append("h6").text(`WFREQ: ${result.wfreq}`);
    
    // Gauge data pulling
    buildGauge(result.wfreq);
  
  });
}
//buildMetadata();


//Create bar chart and bubble chart
function buildCharts(sample) {
  d3.json("samples.json").then((data) => {
    var sample_values = data.samples;
    var resultsArray = sample_values.filter(sampledata => sampledata.id == sample);
    var result = resultsArray[0];

    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var samplevalues = result.sample_values;

    var filteredData = otu_ids.slice(0, 10).map(otuID => `OTU${otuID}`).reverse();

    //Create Bar chart - top ten bacterial species
    var trace = {
      x: samplevalues.slice(0, 10).reverse(),
      y: filteredData,
      text: otu_labels.slice(0, 10).reverse(),
      orientation: "h",
      type: "bar",
      marker: {
        color: "mediumseagreen",
      }
    };
    var data = [trace];
    var layout = {
      title: "<b>Bacterial Species per Sample</b>",
      margin: { t: 30, l: 100 },
      xaxis: { title: "Sample Values" },
    };
    Plotly.newPlot("bar", data, layout);

    //Create bubble chart -- relative frequency of all bacterial species
    var trace1 = {
      x: otu_ids,
      y: samplevalues,
      text: otu_labels,
      type: "scatter",
      mode: 'markers',
      marker: {
        color: otu_ids,
        colorscale: 'Portland',
        opacity: 0.8,
        size: samplevalues,
        //sizeref: 2.0 * Math.max(samplevalues) / (40**2),
        sizemode: 'diameter'
      }
    };
    var data = [trace1];
    var layout = {
      title: "<b>All the Bacterial Species per Sample</b>",
      xaxis: { title: "OTU ID" },
      showlegend: false,
      height: 600,
      width: 1200
    };
    Plotly.newPlot("bubble", data, layout);

  });

}

//Create the gauge - belly button washing frequency
function buildGauge(wfreq) {
  //frequencey between 0 and 180
  var level = parseFloat(wfreq) * 20;
  //math calculations for the meter point using MathPI
  var degrees = 180 - level;
  var radius = 0.5;
  var radians = (degrees * Math.PI)/180;
  var x = radius * Math.cos(radians);
  var y = radius * Math.sin(radians);
  // creating main path
  var mainPath = "M -.0 -0.05 L .0 0.05 L";
  var paX = String(x);
  var space = " ";
  var paY = String(y);
  var pathEnd = "Z";
  var path = mainPath.concat(paX, space, paY, pathEnd);
  
  var data = [
      {
          type: "scatter",
          x: [0],
          y: [0],
          marker: {size:12, color: "85000"},
          showlegend: false,
          name: "Freq",
          text: level,
          hoverinfo: "text+name"
      },
      {
          values: [50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50],
          rotation: 90, 
          text: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
          textinfo: "text",
          textposition: "inside",
          marker: {
              colors: [
                  "rgba(0, 105, 11, .5)",
                  "rgba(10, 120, 22, .5)",
                  "rgba(14, 127, 0, .5)",
                  "rgba(110, 154, 22, .5)",
                  "rgba(170, 202, 42, .5)",
                  "rgba(202, 209, 95, .5)",
                  "rgba(210, 206, 145, .5)",
                  "rgba(232, 226, 202, .5)",
                  "rgba(240, 230, 215, .5)",
                  "rgba(255, 255, 255, 0)",
              ]
          },
      labels: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
      hoverinfo: "label",
      hole: 0.5,
      type: "pie",
      showlegend: false
      },
  ];
  var layout = {
      shapes: [
          {
              type: "path",
              path: path,
              fillcolor: "850000",
              line: {
                  color: "850000"
              }
          }
      ],
      title: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week",
      height: 500,
      width: 500,
      xaxis: {
          zeroline: false,
          showticklabels: false,
          showgrid: false,
          range: [-1,1]
      },
      yaxis: {
          zeroline: false,
          showticklabels: false,
          showgrid: false,
          range: [-1,1]
      }
  };
  var gauge = document.getElementById("gauge");
  Plotly.newPlot(gauge,data,layout);
}
// optionChanged function to change the data based on dropdown value 
// function optionChanged(newSample) {
//     console.log(newSample);
//   }
function optionChanged(newSample) {
  buildMetadata(newSample);
  buildCharts(newSample);
  buildGauge(newSample);
}

init();

