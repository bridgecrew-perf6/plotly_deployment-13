function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  console.log(sample);
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    console.log(samples);
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var desiredSampleNbr = samples.filter(sampleObj => sampleObj.id == sample);
    console.log(desiredSampleNbr);
    //  5. Create a variable that holds the first sample in the array.
    var results = desiredSampleNbr[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = results.otu_ids;
    var otu_labels = results.otu_labels;
    var sample_values = results.sample_values;
    console.log(otu_ids);
    console.log(otu_labels);
    console.log(sample_values);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otu_ids.slice(0,10).map(sampleObj => `OTU ${sampleObj}`).reverse();
    console.log(yticks);

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: sample_values.slice(0, 10).reverse(),
      y: yticks,
      type: "bar",
      orientation: "h",
      color: "blue",
      text: otu_labels.slice(0, 10).reverse()
    }];
    console.log(barData);
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures",
      xaxis: { title: "Sample Values"},
      yaxis: { title: "OTU Labels"}   
    };
    console.log(barLayout)
    // 10. Use Plotly to plot the data with the layout. 
       Plotly.newPlot("bar", barData, barLayout)

    // bubble chart
    var bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {color: otu_ids, size: sample_values, colorscale: "Earth"}
    }];

    // layout needed by the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Culture by Sample",
      xaxis: {
        title: "OTU ID",
        height: 800,
        width: 1000},
        showlegend: false,
        margin: {
          l: 50,
          r: 50,
          t: 50,
          b: 25
        }, hovermode: "closest",
    };

    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

   var metadata = data.metadata;

    // 1st sample in the array 
    var firstSample = metadata.filter(metadataObj => metadataObj.id == sample);
    console.log(firstSample); 

    var gaugeResults = firstSample[0];

    // washing frequency
    var wfreq = gaugeResults.wfreq;
    console.log(wfreq);

    // Gauge chart 
    var gaugeData = [{
      title: {text: "<b> Belly Button Washing Frequency </b> <br></br> Scrubs per Week", width: 500, height: 500, },
      value: parseFloat(wfreq),
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: {range: [0,10], tickwidth: 2, tickcolor: "black"},
        bar: {color: "black"},
        steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "orange" },
          { range: [4, 6], color: "yellow" },
          { range: [6, 8], color: "lightgreen" },
          { range: [8, 10], color: "green" }      
        ]
      }
    }];
    
    // layout for gauge chart
    var gaugeLayout = { 
     hovermode: "closest"
    };

    // plot the gauge data with Plotlt
    Plotly.newPlot("gauge", gaugeData, gaugeLayout); 
  });
}
