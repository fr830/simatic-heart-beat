import React from 'react'
import {Table, Spin, Icon} from 'antd';
import Moment from 'moment'
import _ from 'underscore'
import * as d3 from "d3";

class LineChartPage extends React.Component {

  constructor(props) {
    super(props);

    var yScale = d3.scaleLinear()
      .domain([0, 0]) //numbers to be represented
      .range([0, 0]) //area in pixels in which distribute the domain

    var xScale = d3.scaleTime()
      .domain([0, 0]) //numbers to be represented
      .range([0, 0]); //area in pixels in which distribute the domain

    this.state = {
      aggregatedTodayClientsHistory: [],
      todayClientsHistory: [],
      maximumX: 0,
      minimumX: 0,
      maximumY: 0,
      topPadding: 10,
      bottomPadding: 20,
      leftPadding: 30,
      rightPadding: 60,
      height: 200,
      width: 800,
      yScale: yScale,
      xScale: xScale,
    };

  }

  componentWillMount(){
    this.props.getAllClientsHistory(true, "2017-12-12T00:00:00")
  }

  componentWillReceiveProps(nextProps){
    var today = Moment().format('YYYY-MM-DDT[00:00:00]')
    var tmpClientsInHistory = []

    var todayClientsHistory = nextProps.analytics.clientsHistory.aggregatedByLatency

    var maximumX = Math.max.apply(Math, todayClientsHistory.map(function(o){return Math.max.apply(Math, o.DataPoints.map(function(e){return Moment(e.StartTime).unix()*1000;}))}))
    var minimumX = Math.min.apply(Math, todayClientsHistory.map(function(o){return Math.min.apply(Math, o.DataPoints.map(function(e){return Moment(e.StartTime).unix()*1000;}))}))
    var maximumY = Math.max.apply(Math, todayClientsHistory.map(function(o){return Math.min.apply(Math, o.DataPoints.map(function(e){return e.PingRoundTripTime}))}))

    var yScale = d3.scaleLinear()
      .domain([0, maximumY]) //numbers to be represented
      .range([this.state.height, 0 + this.state.topPadding]) //area in pixels in which distribute the domain

    var xScale = d3.scaleTime()
      .domain([minimumX, maximumX]) //numbers to be represented
      .range([0, this.state.width - this.state.rightPadding]); //area in pixels in which distribute the domain

    this.setState({
      aggregatedTodayClientsHistory: tmpClientsInHistory,
      todayClientsHistory: todayClientsHistory,
      maximumX,
      minimumX,
      maximumY,
      yScale,
      xScale
    })
  }

  mousemove(){
    var x = d3.mouse(d3.select("#graph").node())[0]

    d3.select("#latency-target-line").attr("x1",x).attr("x2",x)

    if(x < this.state.leftPadding){
      x = 0
    }else{
      x = x - this.state.leftPadding
    }



    var lines = d3.selectAll("path.line")

    var clientsToUpdate = []

    lines._groups[0].forEach(function(l){
      if(l){
        var line = d3.select(l)

        var pathTotalLength = line.node().getTotalLength()

        var pointAtLength = line.node().getPointAtLength(x)

        for(var index = 0; index <= pathTotalLength; index ++ ){
          pointAtLength = line.node().getPointAtLength(index)
          if(Math.floor(pointAtLength.x) == Math.floor(x)){
            break
          }
        }

        var localPingRoundtripTime = this.state.yScale.invert(pointAtLength.y)
        var clientIp = line.attr("meta-data-client-ip")
        clientsToUpdate.push({localPingRoundtripTime, clientIp})
      }
    }.bind(this))

    this.updateClientLocalPingRoundtripTime(clientsToUpdate)
  }

  editVisibility(clientToUpdate){
    var tmpAggregatedTodayClientsHistory = this.state.aggregatedTodayClientsHistory;
    tmpAggregatedTodayClientsHistory.forEach(function(c){
      if(clientToUpdate.Ip == c.Ip){
        c.visible = !c.visible
      }
    })
    this.setState({
      aggregatedTodayClientsHistory: tmpAggregatedTodayClientsHistory
    })
  }

  updateClientLocalPingRoundtripTime(clientsToUpdate){
    var tmpAggregatedTodayClientsHistory = this.props.analytics.clientsHistory.aggregatedByLatency
    clientsToUpdate.forEach(function(clientToUpdate){
      tmpAggregatedTodayClientsHistory.forEach(function(c){
        if(c.Ip == clientToUpdate.clientIp){
          c.localPingRoundtripTime = clientToUpdate.localPingRoundtripTime
        }
      })
    })


    this.setState({
      aggregatedTodayClientsHistory: tmpAggregatedTodayClientsHistory
    })

  }

  renderClientPingRoundtripTime(){
    console.log(this.props.analytics);
    return this.props.analytics.clientsHistory.aggregatedByLatency.map(function(c, i){
      if(c.visible){
        return <div key={i} className="relative col8 text1" onClick={() => this.editVisibility(c)}>
          <div className="background-div absolute" style={{width: (c.localPingRoundtripTime/this.state.maximumY*100) + "%"}}>{c.Name} {Math.floor(c.localPingRoundtripTime)}</div>
          <div className="foreground-div">{c.Name} {Math.floor(c.localPingRoundtripTime)}</div>
        </div>
      }else{
        return <div key={i} className="relative col8 text1" onClick={() => this.editVisibility(c)}>
          <div className="foreground-div disabled">{c.Name} {Math.floor(c.localPingRoundtripTime)}</div>
        </div>
      }

    }.bind(this))
  }

  render() {

    var maximumX = this.state.maximumX
    var minimumX = this.state.minimumX
    var maximumY = this.state.maximumY

    // define the y axis
    var yAxis = d3.axisLeft()
      .ticks(6)
      .scale(this.state.yScale);

    // define the y axis
    var xAxis = d3.axisBottom()
      .ticks(12)
      .scale(this.state.xScale)

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
      .x(function(d) { return this.state.xScale(Moment(d.StartTime).unix()*1000); }.bind(this))
      .y(function(d) { return this.state.yScale(d.PingRoundTripTime); }.bind(this))
      .curve(d3.curveCardinal);

    var paths = this.props.analytics.clientsHistory.aggregatedByLatency.map(function(c, i){
      //if(c.visible){
        return <path key={i} transform={"translate(" + this.state.leftPadding + "," + (-this.state.bottomPadding) + ")"} className="line" d={valueline(c.DataPoints)} meta-data-client-ip = {c.Ip}></path>
      //}
    }.bind(this))


    return (
      <div>
      <div className="section-1-header" id="clients">
        <span className="text-spacing"></span>
      </div>

      <div className="section-1 hidden-overflow">
      {this.renderClientPingRoundtripTime()}
      </div>


        <svg id="graph" viewBox={"0 0 " + this.state.width + " " + this.state.height} preserveAspectRatio="none" meta-data-event-set="0">
          <g>
            <g className="yAxis axis" transform={"translate(" + this.state.leftPadding + ", " + (-this.state.bottomPadding) + ")"} ref={node => d3.select(node).call(yAxis)} />
            <g className="xAxis axis" transform={"translate(" + this.state.leftPadding + ", " + (this.state.height - this.state.bottomPadding) + ")"} ref={node => d3.select(node).call(xAxis)} />
            {paths}
            <line x1="20" y1="0" x2="20" y2={this.state.height} className="target-line" id="latency-target-line"></line>
          </g>
        </svg>
      </div>
    );
  }
}

export default LineChartPage
