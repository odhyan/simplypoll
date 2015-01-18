Template.pollPage.helpers({ 
	hasVoted: function() {
    var userId = Meteor.userId();
    if (!userId || (userId && !_.include(this.voters, userId))) {
      return false; 
    } else {
      return true; 
    }
  }
});

Template.pollResult.rendered = function() {

  function drawChart(o) {
    var totalVotes = 0;
    for(var i = 0; i < o.options.length; i++) {
      totalVotes += o.votes[o.options[i].id];
    }

    var ctx = document.getElementById('chart' + o._id).getContext("2d");

    var labels = [];
    var data = [];
    for(var i = 0; i < o.options.length; i++) {
        labels.push(o.options[i].option);
        data.push(parseInt(o.votes[o.options[i].id], 10));
    }

    var oData = {
      labels: labels,
      datasets: [{
        data: data,
        fillColor: '#5b90bf',
        strokeColor: '#5b90bf'
      }]
    };

    Chart.defaults.global.scaleFontSize = 16;
    Chart.defaults.global.scaleLineWidth = 2;
    Chart.defaults.global.scaleLineColor = '#999';
    Chart.defaults.global.tooltipTemplate = "<%if (label){%><%=label%>: <%}%><%= value %> <%if(value == 1) {%>vote<%} else {%>votes<%}%>";

    myChart = new Chart(ctx).Bar(oData, {
      scaleShowGridLines: false
    });
  }

  drawChart(this.data);
  
}