// 主页面

import style from './style.module.css';
import React, { useState } from 'react';
import { Link, withRouter, Switch, Route } from 'react-router-dom';
import { Layout, Menu, Avatar, Button } from 'antd';
import {
  HomeOutlined,
  UserOutlined,
  BarsOutlined,
} from '@ant-design/icons';
// import { renderRoutes } from 'react-router-config';
import AuthRoute from '@/router/AuthRoute'
import User from '../user';
import noAuth from '../../error/403';
import notFound from '../../error/404';
const { Header, Content, Footer, Sider } = Layout;

function HomeMain(props) {
  const [collapsed, setCollapsed] = useState(false);
  const logOut = () => {
    window.sessionStorage.clear();
    props.history.push("/login");
  }
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={e => setCollapsed(!collapsed)}>
        <div className={style.logo}>
          {collapsed || "React Admin"}
        </div>
        <Menu theme="dark" mode="inline" selectedKeys={[props.history.location.pathname]} >
          <Menu.Item key="/home/information" icon={<HomeOutlined />}>
            <Link exact to="/home/information">员工信息</Link>
          </Menu.Item>
          <Menu.Item key="/home/train" icon={<BarsOutlined />}>
            <Link exact to="/home/train">员工培训</Link>
          </Menu.Item>
          <Menu.Item key="/home/performance" icon={<BarsOutlined />}>
            <Link exact to="/home/performance">员工绩效</Link>
          </Menu.Item>
          <Menu.Item key="/home/interview" icon={<BarsOutlined />}>
            <Link exact to="/home/interview">员工面试</Link>
          </Menu.Item>
          <Menu.Item key="/home/vacate" icon={<BarsOutlined />}>
            <Link exact to="/home/vacate">请假记录</Link>
          </Menu.Item>
          <Menu.Item key="/home/check" icon={<BarsOutlined />}>
            <Link exact to="/home/check">员工考勤</Link>
          </Menu.Item>
          <Menu.Item key="/home/payment" icon={<BarsOutlined />}>
            <Link exact to="/home/payment">员工工资单</Link>
          </Menu.Item>
          <Menu.Item key="/home/position" icon={<BarsOutlined />}>
            <Link exact to="/home/position">员工职位</Link>
          </Menu.Item>
          {
            window.sessionStorage.getItem("role") === "root" ? 
            (<Menu.Item key="/home/user" icon={<BarsOutlined />}>
              <Link exact to="/home/user">系统用户</Link>
            </Menu.Item>) : null
          }
        </Menu>
      </Sider>
      <Layout>
        <Header className={style.siteLayoutBackground} style={{ padding: 0 }}>
          <div className={style.profile}>
            <a href="#" >
              <Avatar size="small" icon={<UserOutlined />} className={style.avatar} />
              Hedgehog
            </a>
            <Button href="" style={{marginLeft: "10px"}} size="middle" danger onClick={logOut}>退出</Button>
          </div>
        </Header>
        <Content style={{ margin: '0 16px' }}>
          {/* 第一种方法实现登录鉴权 */}
          {/* {
            sessionStorage.getItem("token") ? renderRoutes(props.route.routes) : <Redirect to="/login" />
          } */}
          {/* 第二种方法实现登录鉴权 */}
          <Switch>
            {
              props.route.routes.map(({path, component, ...routes}) => 
              <AuthRoute exact key={path} path={path} component={component} {...routes}/>)
            }
            {/* root根用户的权限 */}
            {
              window.sessionStorage.getItem("role") === "root" ? <Route to="/home/user" component={User}/> : <Route exact to="/home/user" component={noAuth}/>
            }
            <Route component={notFound}/>
          </Switch>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
      </Layout>
    </Layout>
  );
}

export default withRouter(HomeMain);
