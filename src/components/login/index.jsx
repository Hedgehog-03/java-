// 登录页面

import style from "./style.module.css";
import React, { useState, useEffect } from "react";
import { Form, Input, Button, message } from "antd";
import {
  UserOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import { login } from "@/request/login";

function Login(props) {
  const [loginForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const onFormChange = (values) => {
    loginForm.setFieldsValue(values);
  };
  // 提交用户名和密码
  const handleSubmit = async () => {
    setLoading(true);
    const values = await loginForm.validateFields();
    login(values).then((res) => {
      setLoading(false);
      if (res.data.status !== 200) return message.error("登录失败！");
      message.success("登录成功！")
      // 将登陆成功之后的token，保存到客户端的sessionStorage中
      // - 项目中除了登录之外的其他API接口，必须在登录之后才能访问
      // - token只应在当前网站打开期间生效，所以将token保存在sessionStorage中
      window.sessionStorage.setItem("token", res.data.token);
      window.sessionStorage.setItem("role", values.username);
      // 跳转到后台主页
      props.history.push("/home/information");
    })
  }
  // 自动填入默认账号密码
  useEffect(() => {
    loginForm.setFieldsValue({
      username: "root",
      password: "123456",
    });
  }, []);
  return (
    <div>
      <Form
        form={loginForm}
        onValuesChange={onFormChange}
        wrapperCol={{ span: 8, offset: 8 }}
        style={{ margin: "200px auto" }}
      >
        <div className={style.loginHeader}>
          <img
            className={style.loginHeaderIcon}
            alt="react-admin"
            src="https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2030278735,2628483606&fm=26&gp=0.jpg"
          ></img>
          <span className={style.loginHeaderTitle}>React-Admin</span>
        </div>
        <Form.Item
          name="username"
          rules={[{ required: true, message: "必填" }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Username" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "必填" }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            name="password"
            type="password"
            placeholder="Password"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            onClick={handleSubmit}
          >
            {loading ? "登录中..." : "登录"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default Login;
