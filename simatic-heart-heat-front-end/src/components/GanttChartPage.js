import React from 'react'
import {Table, Spin, Icon} from 'antd';
import Moment from 'moment'
import _ from 'underscore'
import * as d3 from "d3";

class GanttChartPage extends React.Component {

  constructor(props) {
    super(props);

    var xScale = d3.scaleTime()
      .domain([0, 0]) //numbers to be represented
      .range([0, 0]) //area in pixels in which distribute the domain


      this.state = {
        topPadding: 10,
        bottomPadding: 20,
        leftPadding: 30,
        rightPadding: 60,
        height: 600,
        width: 800,
        ganttObjectsHeight: 10,
        ganttObjectsSpacing: 1,
      };

  }

  componentWillMount(){
    var today = Moment().format('YYYY-MM-DDT[12:11:00]')
    setInterval(() => this.props.getAllClientsHistory(true, today), 1000)
    this.props.getAllClientsHistory(true, today)
  }

  render() {

    var todayClientsHistory = this.props.analytics.clientsHistory.aggregatedByLatency

    //sort
    this.props.analytics.clientsHistory.aggregatedByLatency.forEach(function(c,i){
      var downtimeDuration = 0
      c.DataPoints.forEach(function(d, j){
        if(c.DataPoints[j + 1] && !d.IsClientUp){
          downtimeDuration = downtimeDuration + Moment(c.DataPoints[j + 1].StartTime).unix()*1000 - Moment(d.StartTime).unix()*1000
        }
      })
      if(downtimeDuration == 0){
        //c.downtimeDuration = i * (-1)
        c.downtimeDuration = downtimeDuration
      }else{
        c.downtimeDuration = downtimeDuration
      }

    })

    //this.props.analytics.clientsHistory.aggregatedByLatency.sort((a,b) => a.Name < b.Name ? -1 : 1)
    //this.props.analytics.clientsHistory.aggregatedByLatency.sort((a,b) => a.downtimeDuration >= b.downtimeDuration ? -1 : 1)
    this.props.analytics.clientsHistory.aggregatedByLatency.sort(function(a, b){
      if(a.downtimeDuration > b.downtimeDuration){
        return -1
      }
      if(a.downtimeDuration < b.downtimeDuration){
        return 1
      }
      return a.Name < b.Name ? -1 : 1
    })

    var maximumX = Math.max.apply(Math, todayClientsHistory.map(function(o){return Math.max.apply(Math, o.DataPoints.map(function(e){return Moment(e.StartTime).unix()*1000;}))}))
    var minimumX = Math.min.apply(Math, todayClientsHistory.map(function(o){return Math.min.apply(Math, o.DataPoints.map(function(e){return Moment(e.StartTime).unix()*1000;}))}))

    var xScale = d3.scaleTime()
      .domain([minimumX, maximumX]) //numbers to be represented
      .range([0, this.state.width - this.state.rightPadding]); //area in pixels in which distribute the domain

    // define the y axis
    var xAxis = d3.axisBottom()
      .ticks(12)
      .scale(xScale)

    var graph = d3.select("#graph")

    if(graph && graph._groups[0] && graph._groups[0][0])
    {
      if(graph._groups[0][0].getAttribute("meta-data-event-set") == 0){
        console.log("event set");
        //graph.on("mousemove", () => this.mousemove())
        graph.attr("meta-data-event-set", 1)
      }else{
        //console.log("event already set");
      }
    }

    var valueline = d3.line()
      .x(function(d) { return xScale(Moment(d.StartTime).unix()*1000); }.bind(this))
      .curve(d3.curveCardinal);

if(this.props.analytics.clientsHistory.aggregatedByLatency[0]){

  var ganttObjects = this.props.analytics.clientsHistory.aggregatedByLatency.map(function(c, j){
    var label = <text  className="gantt-label" transform="translate(4,8)">{c.Name}</text>
    var gantLine = c.DataPoints.map((d, i) => {
      var width = 0
      if(c.DataPoints[i + 1]){
        width = xScale(Moment(c.DataPoints[i + 1].StartTime).unix()*1000) - xScale(Moment(d.StartTime).unix()*1000)
      }

      return <rect key={i}
        transform={"translate(" + ( + xScale(Moment(d.StartTime).unix()*1000)) + ",0)"}
        width={width}
        className = {d.IsClientUp ? "gantt-object-up" : "gantt-object-down"}
        height={this.state.ganttObjectsHeight}
        />
    })
    return <g key={j} transform={"translate("+ this.state.leftPadding + "," + j*(this.state.ganttObjectsHeight + this.state.ganttObjectsSpacing) + ")"}>
    {gantLine}
    {label}
    </g>
  }.bind(this))
}


    return (
      <div>
      <div className="section-1-header" id="clients">
        <span className="text-spacing"></span>
      </div>


        <svg id="graph" viewBox={"0 0 " + this.state.width + " " + this.state.height} preserveAspectRatio="none" meta-data-event-set="0">
          <g>
            <g className="xAxis axis" transform={"translate(" + (this.state.leftPadding) + ", " + (this.props.analytics.clientsHistory.aggregatedByLatency.length * (this.state.ganttObjectsHeight + this.state.ganttObjectsSpacing)) + ")"} ref={node => d3.select(node).call(xAxis)} />
            {ganttObjects}
          </g>
        </svg>
      </div>
    );
  }
}

export default GanttChartPage
