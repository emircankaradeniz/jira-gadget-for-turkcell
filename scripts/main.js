function renderGadget() {
  // Get the project key
  var projectKey = gadgets.util.getUrlParameters().projectKey;
  if (!projectKey) {
    document.getElementById('content').innerHTML = 'No project selected.';
    return;
  }

  // Fetch the issues for the selected project
  var url = "/rest/api/2/search?jql=project=" + projectKey + "&fields=labels";
  gadgets.io.makeRequest(url, function(response) {
    if (response.rc !== 200) {
      document.getElementById('content').innerHTML = 'Failed to fetch issues.';
      return;
    }

    var issues = JSON.parse(response.text).issues;
    var labelCounts = {};

    // Count the labels
    issues.forEach(function(issue) {
      issue.fields.labels.forEach(function(label) {
        if (!labelCounts[label]) {
          labelCounts[label] = 0;
        }
        labelCounts[label]++;
      });
    });

    // Render the chart
    var labels = Object.keys(labelCounts);
    var data = labels.map(function(label) { return labelCounts[label]; });
    renderChart(labels, data);
  });
}

function renderChart(labels, data) {
  var ctx = document.getElementById('chart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Number of Issues',
        data: data
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: {
          beginAtZero: true
        },
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

gadgets.util.registerOnLoadHandler(renderGadget);
