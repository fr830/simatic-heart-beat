import React from 'react'
import {Table, Spin, Icon, Button, Input, Tag} from 'antd';
import Moment from 'moment'
import _ from 'underscore'
import * as d3 from "d3";
import { DatePicker } from 'antd';
const { RangePicker } = DatePicker;
const { detect } = require('detect-browser');
const browser = detect();

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
        height: 1100,
        width: 800,
        ganttObjectsHeight: 10,
        ganttObjectsSpacing: 1,
        filterName: '',
        highlightedClient: undefined,
        selectedClient: undefined,
        observedPeriodStart: undefined,
        observedPeriodEnd: undefined,
        showDowntimeOccurrences: false,
        updateFetching: false,
      };
      this.handleFilterNameEdit= this.handleFilterNameEdit.bind(this);
      this.onOk= this.onOk.bind(this);
  }

  handleFilterNameEdit = (event) => {

    this.setState({
      filterName: event.target.value
    });
  }

  highlightClient(client){
    this.setState({
      highlightedClient: client
    });
  }

  setSelectedClient(client){
    this.setState({
      selectedClient: client
    });
  }

  highlightClientOut(){
    this.setState({
      highlightedClient: undefined
    });
  }

  showDowntimeOccurrences(){
    if(this.state.showDowntimeOccurrences){
      this.setState({
        showDowntimeOccurrences: false
      });
    }else{
      this.setState({
        showDowntimeOccurrences: true
      });
    }
  }

  componentWillReceiveProps(nextProps){

    var maximumX = Math.max.apply(Math, nextProps.analytics.clientsHistory.aggregatedByLatency.filter((c) => c.visible).map(function(o){return Math.max.apply(Math, o.DataPoints.map(function(e){return Moment(e.StartTime).unix()*1000;}))}))
    var minimumX = Math.min.apply(Math, nextProps.analytics.clientsHistory.aggregatedByLatency.filter((c) => c.visible).map(function(o){return Math.min.apply(Math, o.DataPoints.map(function(e){return Moment(e.StartTime).unix()*1000;}))}))
/*
    if(this.state.observedPeriodEnd){
      console.log(Moment(maximumX));
      console.log(Moment(minimumX));
      console.log(this.state.observedPeriodEnd.diff(Moment(maximumX), 'seconds') + " " + this.state.observedPeriodStart.diff(Moment(minimumX), 'seconds'));
    }*/
    if(this.state.observedPeriodEnd){
      if(this.state.observedPeriodEnd.diff(Moment(maximumX), 'seconds') == 0 && this.state.observedPeriodStart.diff(Moment(minimumX), 'seconds') == 0){
        this.setState({
          updateFetching: false
        });
      }
    }

  }


  componentWillMount(){
    this.props.setPolling(false);
    this.props.setAnalyticsPolling(false);
    var today = Moment().format('YYYY-MM-DDT[00:00:00]')
    //var today = '2018-01-25T00:11:00'
    //var end = '2018-01-25T10:21:00'
    this.setState({
      observedPeriodStart: Moment(today),
      //observedPeriodEnd: Moment(end)
    });
    this.props.getAllClientsHistory(true, this.state.observedPeriodStart, this.state.observedPeriodEnd)
    var intervalManager = setInterval(() => this.props.getAllClientsHistory(false, this.state.observedPeriodStart, this.state.observedPeriodEnd), 1000)
    this.props.setAnalyticsPolling(true, intervalManager);
  }

  onChange(value, dateString) {
  }

  onOk(value) {
    console.log(value);
    this.setState({
      observedPeriodStart: value[0],
      observedPeriodEnd: value[1],
      updateFetching: true
    })
  }

  renderDowntimeOccurrences(){
    const columns = [{
        title: 'Time',
        dataIndex: 'formattedStartTime',
        key: 'formattedStartTime'
      }, {
        title: 'State',
        dataIndex: 'formattedStatus',
        key: 'formattedStatus',
      }];

      this.state.selectedClient.DataPoints.forEach(function(d){
        d.formattedStartTime = Moment(d.StartTime).format('YYYY-MM-DD hh:mm:ss')
        d.formattedStatus = d.IsClientUp ? <Tag color="#27ae60" className="tag">Node up</Tag> : <Tag color="#c0392b" className="tag">Node down</Tag>
      })

      return <Table columns={columns} dataSource={this.state.selectedClient.DataPoints} />
  }

  render() {
    //sort
    this.props.analytics.clientsHistory.aggregatedByLatency.forEach(function(c,i){
      var downtimeDuration = 0

      if(this.state.observedPeriodEnd){

        c.DataPoints = c.DataPoints.filter(function(d){
          if(this.state.observedPeriodEnd.diff(Moment(d.StartTime), 'seconds') < 0){
            return false
          }else{
            return true
          }
        }.bind(this))
        /*
        c.DataPoints.forEach(function(d){
          //this.state.observedPeriodEnd.diff(Moment(d.StartTime), 'seconds') < 0
          if(this.state.observedPeriodEnd.diff(Moment(d.StartTime), 'seconds') < 0){
            console.log(this.state.observedPeriodEnd.diff(Moment(d.StartTime), 'seconds'));
            console.log(this.state.observedPeriodEnd);
            console.log(d);
          }

        }.bind(this))*/
      }


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

      if(this.state.filterName.length > 0){
        if(c.Name.toLowerCase().includes(this.state.filterName.toLowerCase())){
          c.visible = true
        }else{
          c.visible = false
        }
      }
      else{
        c.visible = true
      }

      if(this.state.highlightedClient != undefined){
        if(c.Name == this.state.highlightedClient.Name){
          c.highlighted = true
        }
        else{
          c.highlighted = false
        }
      }else{
        c.highlighted = false
      }
    }.bind(this))

    this.props.analytics.clientsHistory.aggregatedByLatency.sort(function(a, b){
      if(a.downtimeDuration > b.downtimeDuration){
        return -1
      }
      if(a.downtimeDuration < b.downtimeDuration){
        return 1
      }
      return a.Name < b.Name ? -1 : 1
    })

    var maximumX = Math.max.apply(Math, this.props.analytics.clientsHistory.aggregatedByLatency.filter((c) => c.visible).map(function(o){return Math.max.apply(Math, o.DataPoints.map(function(e){return Moment(e.StartTime).unix()*1000;}))}))
    var minimumX = Math.min.apply(Math, this.props.analytics.clientsHistory.aggregatedByLatency.filter((c) => c.visible).map(function(o){return Math.min.apply(Math, o.DataPoints.map(function(e){return Moment(e.StartTime).unix()*1000;}))}))

    var xScale = d3.scaleTime()
      .domain([minimumX, maximumX]) //numbers to be represented
      .range([0, this.state.width - this.state.rightPadding]); //area in pixels in which distribute the domain

    // define the y axis
    var xAxis = d3.axisBottom()
      .ticks(12)
      .scale(xScale)

      /*

    var graph = d3.select("#graph")

    if(graph && graph._groups[0] && graph._groups[0][0])
    {
      if(graph._groups[0][0].getAttribute("meta-data-event-set") == 0){
        //console.log("event set");
        //graph.on("mousemove", () => this.mousemove())
        graph.attr("meta-data-event-set", 1)
      }else{
        //console.log("event already set");
      }
    }

    var valueline = d3.line()
      .x(function(d) { return xScale(Moment(d.StartTime).unix()*1000); }.bind(this))
      .curve(d3.curveCardinal);
*/
if(this.props.analytics.clientsHistory.aggregatedByLatency[0]){
  var ganttObjects = this.props.analytics.clientsHistory.aggregatedByLatency.filter((c) => c.visible).map(function(c, j){
    var label = <text  className="gantt-label" transform="translate(4,8)">{c.Name}</text>
    if(c.highlighted){
      label = <text  className="gantt-label" transform="translate(4,8)">{c.Name + ' • ' + c.Ip + ' • total downtime duration: ' + Math.floor(Moment.duration(c.downtimeDuration).asHours()) + Moment.utc(c.downtimeDuration).format(":mm:ss")}</text>
    }
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
    return <g key={j}
    onClick={() => this.setSelectedClient(c)}
    className = "cursor-pointer"
    transform={"translate("+ this.state.leftPadding + "," + j*(this.state.ganttObjectsHeight + this.state.ganttObjectsSpacing) + ")"}>
    {gantLine}
    {label}
    </g>
  }.bind(this))
}


    return (
      <div>
      <div className="section-1-header" id="clients" >
        <Input value={this.state.filterName} onChange={(value) => this.handleFilterNameEdit(value)} style={{ width: '20%' }} prefix={<Icon type="filter" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Filter Names"/>&#32;&#32;<RangePicker
        showTime={{ format: 'hh:mm' }}
        format="YYYY-MM-DD hh:mm"
        placeholder={['Start Time', 'End Time']}
        defaultValue={[this.state.observedPeriodStart? this.state.observedPeriodStart : Moment(), this.state.observedPeriodEnd? this.state.observedPeriodEnd : Moment()]}
        onChange={this.onChange}
        onOk={this.onOk}
        disabledDate={function(currentDate){
            var today = Moment().format('YYYY-MM-DD')
            // evreything that is further than 7 days in the past or in the future must be ignored
            if(currentDate){
              if(currentDate.diff(today, 'days') > -7 && currentDate.diff(today, 'days') < 1){
                return false
              }

            }
            return true
          }
        }
        />
        <span className="text-spacing"></span>
        {this.state.selectedClient &&
          <div className="client-status-information align-left">
            {this.state.selectedClient.Name + ' • ' + this.state.selectedClient.Ip}
            <br/>
            <span className="text1">
              Observed between {this.state.observedPeriodStart.format("dddd, MMMM Do YYYY, h:mm:ss a") + ' and ' + (this.state.observedPeriodEnd? this.state.observedPeriodEnd.format("dddd, MMMM Do YYYY, h:mm:ss a") : Moment().format("dddd, MMMM Do YYYY, h:mm:ss a"))}
            </span>
            <br/><br/>
            <span className="text1">
              Total downtime duration: {Math.floor(Moment.duration(this.state.selectedClient.downtimeDuration).asHours()) + Moment.utc(this.state.selectedClient.downtimeDuration).format(":mm:ss")}<br/>
              Number of state change occurrences: {this.state.selectedClient.DataPoints.length}
              <div className="align-center">
                <Button type="dashed" onClick={() => this.showDowntimeOccurrences()}>{this.state.showDowntimeOccurrences? "Hide Occurrences":"Show Occurrences"}</Button> <Button type="danger" onClick={() => this.setSelectedClient(undefined)}>Close Client Details</Button>
              </div>

              {this.state.showDowntimeOccurrences && this.renderDowntimeOccurrences()}
            </span>
          </div>
        }
      </div>

        {(this.props.analytics.fetching || this.state.updateFetching) && <div className="full-width align-center padded-20 gantt-spinner"><Spin /></div>}

        {!this.props.analytics.fetching && browser && browser.name != 'ie' &&
          <svg id="graph" viewBox={"0 0 " + this.state.width + " " + this.state.height} className = {(this.props.analytics.fetching || this.state.updateFetching) ? "gantt-blurred" : ""}>
            <g>
              <g className="xAxis axis" transform={"translate(" + (this.state.leftPadding) + ", " + (this.props.analytics.clientsHistory.aggregatedByLatency.filter((c) => c.visible).length * (this.state.ganttObjectsHeight + this.state.ganttObjectsSpacing)) + ")"} ref={node => d3.select(node).call(xAxis)} />
              {ganttObjects}
            </g>
          </svg>
        }

        {browser && browser.name == 'ie' &&
          <svg id="graph" width="100%" height="900px" viewBox={"0 0 " + this.state.width + " " + this.state.height} className = {(this.props.analytics.fetching || this.state.updateFetching) ? "gantt-blurred" : ""}>
            <g>
              <g className="xAxis axis" transform={"translate(" + (this.state.leftPadding) + ", " + (this.props.analytics.clientsHistory.aggregatedByLatency.filter((c) => c.visible).length * (this.state.ganttObjectsHeight + this.state.ganttObjectsSpacing)) + ")"} ref={node => d3.select(node).call(xAxis)} />
              {ganttObjects}
            </g>
          </svg>
        }

      </div>
    );
  }
}

export default GanttChartPage

//preserveAspectRatio="none"
