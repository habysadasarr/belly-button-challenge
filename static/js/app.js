// Function to build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    // Get the metadata field
    var metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    var result = metadata.filter(meta => meta.id.toString() === sample)[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    var demographicInfo = d3.select("#sample-metadata");

    // Use `.html("")` to clear any existing metadata
    demographicInfo.html("");

    // Append key-value pairs to the panel
    Object.entries(result).forEach(([key, value]) => {
      demographicInfo.append("h5").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// Function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    // Get the samples field
    var samples = data.samples;

    // Filter the samples for the object with the desired sample number
    var result = samples.filter(s => s.id === sample)[0];

    // Get the otu_ids, otu_labels, and sample_values
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;

    // Build a Bar Chart
    var barData = [{
      x: sample_values.slice(0, 10).reverse(),
      y: otu_ids.slice(0, 10).map(d => `OTU ${d}`).reverse(),
      text: otu_labels.slice(0, 10).reverse(),
      marker: { color: 'blue' },
      type: "bar",
      orientation: "h"
    }];

    var barLayout = {
      title: "Top 10 Bacteria cultures Found",
      margin: { l: 100, r: 100, t: 100, b: 30 }
    };

    Plotly.newPlot("bar", barData, barLayout);

    // Build a Bubble Chart
    var bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids
      }
    }];

    var bubbleLayout = {
      xaxis: { title: "OTU ID" },
      height: 600,
      width: 1000
    };

    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  });
}

// Function to initialize the dashboard
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    // Get the names field
    var names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    var dropdown = d3.select("#selDataset");

    // Populate the select options
    names.forEach((name) => {
      dropdown.append("option").text(name).property("value", name);
    });

    // Get the first sample from the list
    var firstSample = names[0];

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
