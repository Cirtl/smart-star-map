import React from 'react';
import { Viewer, CzmlDataSource ,} from 'resium';
import czml from 'czml-writer';
import _ from 'lodash';
import {Button, InputNumber} from 'antd';
import * as Cesium from "cesium";
import {Cartesian3} from "cesium";
import { Layout } from 'antd';
import Input from "antd/es/input/Input";

const { Header,  Sider, Content } = Layout;
const fs = require('fs');
function a(){

}
export default class App extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      name:'',
      v1: 450,
      v2:450,
      v3:45,
      v4:180,
      v5:180,
      satelliteData:[],
      path:null,
      newSatellite:{
        apogee: _.random(400.0, 500.0), // km
        perigee: _.random(400.0, 500.0), // km
        inclination: _.random(0.0, 90.0), // deg
        rightAscension: _.random(0.0, 360.0), // deg
        argumentOfPeriapsis: _.random(0.0, 360.0), // deg
      },
    }
  }
  set_name(e) {
    let value = e.target.value;
    this.setState({
      name: value
    })
  }
  set_1(e) {
    let value = e.target.value;
    this.setState({
      v1: value
    })
  }
  set_2(e) {
    let value = e.target.value;
    this.setState({
      v2: value
    })
  }
  set_3(e) {
    let value = e.target.value;
    this.setState({
      v3: value
    })
  }
  set_4(e) {
    let value = e.target.value;
    this.setState({
      v4: value
    })
  }
  set_5(e) {
    let value = e.target.value;
    this.setState({
      v5: value
    })
  }
  path_self(){
    this.state.satelliteData=[];
    this.setState({
      satelliteData:this.state.satelliteData
    })

      this.state.newSatellite={
          apogee: parseInt(this.state.v1), // km
          perigee: parseInt(this.state.v2), // km
          inclination:  parseInt(this.state.v3), // deg
          rightAscension:  parseInt(this.state.v4), // deg
          argumentOfPeriapsis:  parseInt(this.state.v5), // deg
        }
    console.log(this.state.newSatellite);
      const newOr = new czml.orbit.fromParams(this.state.newSatellite);
      const newC = newOr.czml();

        newC[1].id = this.state.name;
        newC[1].label.text = this.state.name;
    this.state.satelliteData =[...this.state.satelliteData, ...newC];


      newC[1].id = this.state.name;
      newC[1].label.text = this.state.name;
      newC[1].label.fillColor.rgba = [0, 0, 0, 255];//标签颜色
      newC[1].path.material.solidColor.color.rgba = [255, 255,0, 255];//轨道颜色
    this.state.satelliteData =[...this.state.satelliteData, newC[1]]
    this.setState({
      satelliteData:this.state.satelliteData
    })
console.log(this.state.satelliteData)
  }
  render() {
    // let satelliteData = [];
    // add 5 dummy satellites

    // let satelliteData = [];
    //   const newSatellite = {
    //     apogee: _.random(400.0, 500.0), // km
    //     perigee: _.random(400.0, 500.0), // km
    //     inclination: _.random(0.0, 90.0), // deg
    //     rightAscension: _.random(0.0, 360.0), // deg
    //     argumentOfPeriapsis: _.random(0.0, 360.0), // deg
    //   };
      const newOrbit = new czml.orbit.fromParams(this.state.newSatellite);
      const newCzml = newOrbit.czml();

      const formattedName = `Satellite`;


        newCzml[1].id = formattedName;
        newCzml[1].label.text = formattedName;
        this.state.satelliteData = [...this.state.satelliteData, ...newCzml];

      newCzml[1].id = formattedName;
      newCzml[1].label.text = formattedName;
      newCzml[1].label.fillColor.rgba = [0, 0, 0, 255];//标签颜色
      newCzml[1].path.material.solidColor.color.rgba = [255, 255, 255, 255];//轨道颜色
      this.state.satelliteData = [...this.state.satelliteData, newCzml[1]];
  return (
      <Layout>
        <Header style={{backgroundColor:'#FFFFFF'}}>
          <span style={{marginRight:'70px'}}>智慧星图logo</span>
        <span style={{marginRight:'20px'}}>自定义</span>
        <span>现有</span>
      </Header>

        <Layout>
          <Sider style={{backgroundColor:'rgb(0,0,0,0.9)',color:'#FFFFFF'}}>
            <div style={{textAlign:'center',marginTop:'20px',fontSize:'16px'}}>请输入自定义数据</div>
            <div style={{marginTop:'20px',marginLeft:'10px',}}>请输入卫星名称</div>
            <Input style={{marginTop:'10px',marginLeft:'10px',width:180}}
                   value={this.state.name}
                   onChange={(e) => { this.set_name(e) }}
                   placeholder="请输入卫星名称" />
            <div style={{marginTop:'20px',marginLeft:'10px',}}>请输入远地点</div>
            <Input type='number'style={{marginTop:'10px',marginLeft:'10px',width:180}}
                   value={this.state.v1}
                   onChange={(e) => { this.set_1(e) }}
                placeholder="请输入远地点" />
            <div style={{marginTop:'20px',marginLeft:'10px',}}>请输入近地点</div>
            <Input type='number'style={{marginTop:'10px',marginLeft:'10px',width:180}}
                   value={this.state.v2}
                   onChange={(e) => { this.set_2(e) }}
                   placeholder="请输入近地点" />
            <div style={{marginTop:'20px',marginLeft:'10px',}}>请输入轨道倾角</div>
            <Input type='number' style={{marginTop:'10px',marginLeft:'10px',width:180}}
                   value={this.state.v3}
                   onChange={(e) => { this.set_3(e) }}
                   placeholder="请输入轨道倾角" />
            <div style={{marginTop:'20px',marginLeft:'10px',}}>请输入升交点赤经</div>
            <Input type='number'style={{marginTop:'10px',marginLeft:'10px',width:180}}
                   value={this.state.v4}
                   onChange={(e) => { this.set_4(e) }}
                   placeholder="请输入升交点赤经" />
            <div style={{marginTop:'20px',marginLeft:'10px',}}>请输入近地点幅角</div>
            <Input type='number'style={{marginTop:'10px',marginLeft:'10px',width:180}}
                   value={this.state.v5}
                   onChange={(e) => { this.set_5(e) }}
                   placeholder="请输入近地点幅角" />
            <div style={{marginTop:'20px',marginBottom:'10px',}}>
              <Button  style={{backgroundColor:'rgb(0,0,0,250)',display:'block',margin:'0 auto',color:'#FFF'}} onClick={()=>{this.path_self()}}>生成卫星轨道</Button>
            </div>
          </Sider>
          <Content>
            <Viewer shouldAnimate >
              <CzmlDataSource data={this.state.satelliteData}/>
            </Viewer>
          </Content>
        </Layout>
      </Layout>

  );
};}
// export default App;
