import React from 'react';
import { Viewer, CzmlDataSource, } from 'resium';
import czml from 'czml-writer';
import _ from 'lodash';
import { Button, InputNumber, Select, Modal, Tabs, message } from 'antd';
import * as Cesium from "cesium";
import { Cartesian3 } from "cesium";
import { Layout } from 'antd';
import Input from "antd/es/input/Input";
import axios from 'axios';
import { SearchOutlined } from '@ant-design/icons';

const { Header, Sider, Content } = Layout;
const fs = require('fs');
function a() {

}
export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.choose_one = this.choose_one.bind(this)
    this.callback = this.callback.bind(this)
    this.state = {
      modal_visible: false,
      findloading: false,
      pageOn: true,
      name: '',
      v1: 450,
      v2: 450,
      v3: 45,
      v4: 180,
      v5: 180,
      satelliteData: [],
      path: null,
      newSatellite: {
        apogee: _.random(400.0, 500.0), // km
        perigee: _.random(400.0, 500.0), // km
        inclination: _.random(0.0, 90.0), // deg
        rightAscension: _.random(0.0, 360.0), // deg
        argumentOfPeriapsis: _.random(0.0, 360.0), // deg
      },
      username: "2376846435@qq.com",
      password: "526306tjj20020906",
      Tle: [{ name: "", tle: "" }],
      norad_cat_id: "",
      object_name: "",
      query_way: 1
    }
  }
  getApi() {
    let params = {
      identity: this.state.username,
      password: this.state.password,
      query: "https://www.space-track.org/basicspacedata/query/class/gp/EPOCH/%3Enow-30/format/3le"
    }
    axios.post("/ajaxauth/login", params).then((response) => {
      if (response.status == 200) {
        let tles = response.data.split(/[(\r\n)\r\n]+/);
        let a = [];
        tles.forEach((element, index) => {
          if (element[0] == '0') {
            let single_tle = {
              name: element.slice(2),
              tle: element + "\n" + tles[index + 1] + "\n" + tles[index + 2]
            }
            a.push(single_tle);
          }
        });
        this.setState({
          Tle: a
        })
        console.log(this.state.Tle);
      }
    })
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
  path_self() {
    this.state.satelliteData = [];
    this.setState({
      satelliteData: this.state.satelliteData
    })

    this.state.newSatellite = {
      apogee: parseInt(this.state.v1), // km
      perigee: parseInt(this.state.v2), // km
      inclination: parseInt(this.state.v3), // deg
      rightAscension: parseInt(this.state.v4), // deg
      argumentOfPeriapsis: parseInt(this.state.v5), // deg
    }
    console.log(this.state.newSatellite);
    const newOr = new czml.orbit.fromParams(this.state.newSatellite);
    const newC = newOr.czml();

    newC[1].id = this.state.name;
    newC[1].label.text = this.state.name;
    this.state.satelliteData = [...this.state.satelliteData, ...newC];


    newC[1].id = this.state.name;
    newC[1].label.text = this.state.name;
    newC[1].label.fillColor.rgba = [0, 0, 0, 255];//标签颜色
    newC[1].path.material.solidColor.color.rgba = [255, 255, 0, 255];//轨道颜色
    this.state.satelliteData = [...this.state.satelliteData, newC[1]]
    this.setState({
      satelliteData: this.state.satelliteData
    })
    console.log(this.state.satelliteData)
  }
  Go_Page1() {
    this.setState({
      pageOn: true
    })
    this.show_orbit()
  }
  Go_Page2() {
    this.setState({
      pageOn: false
    })
    this.show_orbit()
  }
  choose_one(key) {
    console.log(key)
    let tle = this.state.Tle[key].tle
    var orbit = new czml.orbit.fromTle(tle)
    var newC = orbit.czml();

    this.state.satelliteData = [];
    this.setState({
      satelliteData: this.state.satelliteData
    })
    this.state.satelliteData = [...this.state.satelliteData, ...newC];
    newC[1].label.fillColor.rgba = [0, 0, 0, 255];//标签颜色
    newC[1].path.material.solidColor.color.rgba = [255, 255, 0, 255];//轨道颜色
    this.state.satelliteData = [...this.state.satelliteData, newC[1]]
    this.setState({
      satelliteData: this.state.satelliteData
    })
    console.log(this.state.satelliteData)
  }
  callback(key) {
    this.setState({
      query_way: key
    })
    console.log("query_way:" + key)
  }
  showModal() {
    this.setState({
      modal_visible: true
    })
  }
  findOrbit() {
    // 查询卫星轨道
    this.setState({
      findloading: true
    })
    if ((this.state.query_way == 1 && this.state.norad_cat_id == "") || (this.state.query_way == 2 && this.state.object_name == "")) {
      message.warning("请输入查询数据!")
      this.setState({
        findloading: false,
      })
      return;
    }
    let base_query1 = "https://www.space-track.org/basicspacedata/query/class/gp/"
    let base_query2 = "/EPOCH/%3Enow-30/limit/1/format/3le"
    if (this.state.query_way == 1) {
      let query_url = base_query1 + "NORAD_CAT_ID/" + this.state.norad_cat_id + base_query2
      let params = {
        identity: this.state.username,
        password: this.state.password,
        query: query_url
      }
      axios.post("/ajaxauth/login", params).then(response => {
        if (response.status == 200) {
          console.log(response)
          if (response.data != "") {
            var orbit = new czml.orbit.fromTle(response.data)
            var newC = orbit.czml();
            this.state.satelliteData = [];
            this.setState({
              satelliteData: this.state.satelliteData
            })
            this.state.satelliteData = [...this.state.satelliteData, ...newC];
            newC[1].label.fillColor.rgba = [0, 0, 0, 255];//标签颜色
            newC[1].path.material.solidColor.color.rgba = [255, 255, 0, 255];//轨道颜色
            this.state.satelliteData = [...this.state.satelliteData, newC[1]]
            this.setState({
              satelliteData: this.state.satelliteData,
              findloading: false,
              modal_visible: false,
              norad_cat_id: ""
            })
          } else {
            message.warning("未查询到相应卫星数据!")
            this.setState({
              findloading: false,
              norad_cat_id: ""
            })
          }
        } else {
          message.error(response.data)
        }
      })
    } else {
      let query_url = base_query1 + "object_name/" + this.state.object_name + base_query2
      let params = {
        identity: this.state.username,
        password: this.state.password,
        query: query_url
      }
      axios.post("/ajaxauth/login", params).then(response => {
        if (response.status == 200) {
          console.log(response)
          if (response.data != "") {
            var orbit = new czml.orbit.fromTle(response.data)
            var newC = orbit.czml();
            this.state.satelliteData = [];
            this.setState({
              satelliteData: this.state.satelliteData
            })
            this.state.satelliteData = [...this.state.satelliteData, ...newC];
            newC[1].label.fillColor.rgba = [0, 0, 0, 255];//标签颜色
            newC[1].path.material.solidColor.color.rgba = [255, 255, 0, 255];//轨道颜色
            this.state.satelliteData = [...this.state.satelliteData, newC[1]]
            this.setState({
              satelliteData: this.state.satelliteData,
              findloading: false,
              modal_visible: false,
              object_name: ""
            })
          } else {
            message.warning("未查询到相应卫星数据!")
            this.setState({
              findloading: false,
              object_name: ""
            })
          }
        } else {
          message.error(response.data)
        }
      })
    }
  }
  componentDidMount() {
    this.getApi();
    this.show_orbit();
  }
  show_orbit() {
    // 渲染初始轨道
    this.state.satelliteData = [];
    this.setState({
      satelliteData: this.state.satelliteData
    })
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
    this.setState({
      satelliteData: this.state.satelliteData
    })
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
    const { Option } = Select;
    const child = [];
    this.state.Tle.forEach((ele, index) => {
      child.push(<Option key={index}>{ele.name}</Option>)
    })
    const { TabPane } = Tabs;

    return (
      <Layout>
        <Header style={{ backgroundColor: '#FFFFFF', fontSize: "18px", fontWeight: "600" }}>
          <span style={{ marginRight: '70px' }}>智慧星图logo</span>
          <span style={{ marginRight: '70px', cursor: "pointer" }} onClick={() => { this.Go_Page1() }}>自定义</span>
          <span style={{ marginRight: '20px', cursor: "pointer" }} onClick={() => { this.Go_Page2() }}>现有</span>
        </Header>

        <Layout>
          {
            this.state.pageOn ?
              <Sider style={{ backgroundColor: 'rgb(0,0,0,0.9)', color: '#FFFFFF' }}>
                <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '16px' }}>请输入自定义数据</div>
                <div style={{ marginTop: '20px', marginLeft: '10px', }}>请输入卫星名称</div>
                <Input style={{ marginTop: '10px', marginLeft: '10px', width: 180 }}
                  value={this.state.name}
                  onChange={(e) => { this.set_name(e) }}
                  placeholder="请输入卫星名称" />
                <div style={{ marginTop: '20px', marginLeft: '10px', }}>请输入远地点</div>
                <Input type='number' style={{ marginTop: '10px', marginLeft: '10px', width: 180 }}
                  value={this.state.v1}
                  onChange={(e) => { this.set_1(e) }}
                  placeholder="请输入远地点" />
                <div style={{ marginTop: '20px', marginLeft: '10px', }}>请输入近地点</div>
                <Input type='number' style={{ marginTop: '10px', marginLeft: '10px', width: 180 }}
                  value={this.state.v2}
                  onChange={(e) => { this.set_2(e) }}
                  placeholder="请输入近地点" />
                <div style={{ marginTop: '20px', marginLeft: '10px', }}>请输入轨道倾角</div>
                <Input type='number' style={{ marginTop: '10px', marginLeft: '10px', width: 180 }}
                  value={this.state.v3}
                  onChange={(e) => { this.set_3(e) }}
                  placeholder="请输入轨道倾角" />
                <div style={{ marginTop: '20px', marginLeft: '10px', }}>请输入升交点赤经</div>
                <Input type='number' style={{ marginTop: '10px', marginLeft: '10px', width: 180 }}
                  value={this.state.v4}
                  onChange={(e) => { this.set_4(e) }}
                  placeholder="请输入升交点赤经" />
                <div style={{ marginTop: '20px', marginLeft: '10px', }}>请输入近地点幅角</div>
                <Input type='number' style={{ marginTop: '10px', marginLeft: '10px', width: 180 }}
                  value={this.state.v5}
                  onChange={(e) => { this.set_5(e) }}
                  placeholder="请输入近地点幅角" />
                <div style={{ marginTop: '20px', marginBottom: '10px', }}>
                  <Button style={{ backgroundColor: 'rgb(0,0,0,250)', display: 'block', margin: '0 auto', color: '#FFF' }} onClick={() => { this.path_self() }}>生成卫星轨道</Button>
                </div>
              </Sider>
              :
              <Sider style={{ backgroundColor: 'rgb(0,0,0,0.9)', color: '#FFFFFF' }}>
                <Button
                  type="primary"
                  shape="round"
                  icon={<SearchOutlined />}
                  size="large" style={{ width: '90%', textAlign: 'center', marginTop: '50px', marginLeft: '10px', }}
                  onClick={() => { this.showModal() }}
                >
                  查询轨道</Button>
                <div style={{ marginTop: '50px', marginLeft: '10px', }}>请选择要查看的卫星</div>
                <Select style={{ width: '90%', textAlign: 'center', marginTop: '20px', fontSize: '16px', marginLeft: '10px', }} placeholder="请选择卫星" onChange={this.choose_one}>
                  {child}
                </Select>

                <Modal
                  title="输入卫星信息"
                  visible={this.state.modal_visible}
                  onOk={() => { this.findOrbit() }}
                  confirmLoading={this.state.findloading}
                  onCancel={() => { this.setState({ modal_visible: false }) }}
                >
                  <Tabs defaultActiveKey="1" onChange={this.callback} centered>
                    <TabPane tab="编号查询" key="1">
                      <div style={{ marginTop: '10px', marginLeft: '10px', }}>请输入待查询卫星的5位编号</div>
                      <Input style={{ marginTop: '10px', marginLeft: '10px', width: 250 }}
                        value={this.state.norad_cat_id}
                        onChange={(e) => { this.setState({ norad_cat_id: e.target.value }) }}
                        placeholder="请输入待查询卫星编号" />
                    </TabPane>
                    <TabPane tab="名称查询" key="2">
                      <div style={{ marginTop: '10px', marginLeft: '10px', }}>请输入待查询卫星的公用名称</div>
                      <Input style={{ marginTop: '10px', marginLeft: '10px', width: 250 }}
                        value={this.state.object_name}
                        onChange={(e) => { this.setState({ object_name: e.target.value }) }}
                        placeholder="请输入待查询卫星名称" />
                    </TabPane>
                  </Tabs>
                </Modal>

              </Sider>
          }

          <Content>
            <Viewer shouldAnimate >
              <CzmlDataSource data={this.state.satelliteData} />
            </Viewer>
          </Content>
        </Layout>
      </Layout >

    );
  };
}
// export default App;
