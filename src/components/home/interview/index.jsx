// 员工面试

import style from "./style.module.css";
import React, { useState, useEffect } from "react";
import {
  Table,
  Card,
  Input,
  Button,
  Modal,
  message,
  Form,
  Select,
  Pagination,
} from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import { getInterview, postInterview, putInterview } from "@/request/interview";
const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;

function Interview() {
  // 搜索框的数据源(受控组件)
  const [searchValue, setSearchValue] = useState("");
  // 表格的列(固定值)
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      ellipsis: true,
    },
    {
      title: "姓名",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
    },
    {
      title: "手机号",
      dataIndex: "telephone",
      key: "telephone",
      ellipsis: true,
    },
    {
      title: "面试状态",
      dataIndex: "interviewStatus",
      key: "interviewStatus",
      ellipsis: true,
    },
    {
      title: "面试信息",
      dataIndex: "interviewSituation",
      key: "interviewSituation",
      ellipsis: true,
    },
    {
      title: "操作",
      dataIndex: "action",
      key: "action",
      render: (_, record) => (
        <a href="#" onClick={(e) => editByKey(e, record)}>
          编辑
        </a>
      ),
      ellipsis: true,
      width: 100,
      align: "center",
    },
  ];
  // 表格数据
  const [data, setData] = useState([]);
  // 新建元素对话框的显示与隐藏
  const [newItemModalVisible, setNewItemModalVisible] = useState(false);
  // 新建元素对话框里form表单
  const [newItemForm] = Form.useForm();
  // 编辑元素对话框里的form表单
  const [editItemForm] = Form.useForm();
  // 编辑对话框的显示与隐藏
  const [editItemModalVisible, setEditItemModalVisible] = useState(false);
  // 编辑对话框表单的默认值
  const [editFormValues, setEditFormValues] = useState({});
  // 分页器
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  // 监听搜索输入框的改变
  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
    if (!e.target.value) handleGetInterview();
  };
  // 页码变化时改变表格数据
  const handleTableChange = (current, size) => {
    setPagination({
      current: current,
      pageSize: size,
    });
  };
  // 监听新建对话框的取消事件
  const handleNewItemCancel = () => {
    newItemForm.resetFields();
    setNewItemModalVisible(false);
    message.info("已取消新建列表项！");
  };
  // 监听新建对话框的确认事件(表单的onFinish替代)
  const onNewItemModalFinish = (values) => {
    newItemForm.resetFields();
    console.log(values);
    postInterview(values).then((res) => {
      if (res.data.status !== 200) return message.error("新建失败！");
      message.success("新建成功！");
      handleGetInterview();
    });
    setNewItemModalVisible(false);
  };
  // 监听编辑按钮的点击
  const editByKey = (e, record) => {
    console.log('record',record);
    e.preventDefault();
    setEditFormValues(record);
    setEditItemModalVisible(true);
  };
  // 监听编辑对话框的取消事件
  const handleEditItemCancel = () => {
    setEditItemModalVisible(false);
    editItemForm.resetFields();
    message.info("已取消编辑！");
  };
  // 监听编辑对话框的确认事件(表单的onFinish替代)
  const onEditItemModalFinish = (values) => {
    console.log('values',values);
    editItemForm.resetFields();
    if (typeof values.interviewStatus === "string") {
      switch (values.interviewStatus) {
        case "未面试":
          values.interviewStatus = "0";
          break;
        case "已面试":
          values.interviewStatus = "1";
          break;
        case "面试通过":
          values.interviewStatus = "2";
          break;
        case "面试不通过":
          values.interviewStatus = "3";
          break;
        default:
          values.interviewStatus = null;
      }
    }
    putInterview(values).then((res) => {
      console.log(res);
      if (res.data.status !== 200) return message.error("修改失败！");
      handleGetInterview();
      message.success("修改成功！");
    });
    setEditItemModalVisible(false);
  };
  const validateMessages = {
    required: "必填",
    types: {
      number: "请输入数字 !",
    },
    pattern: {
      mismatch: "${label}只能由中文或英文组成，且长度不超过10位！",
    },
  };
  const handleGetInterview = () => {
    getInterview(pagination.current, pagination.pageSize, "").then((res) => {
      if (res.data.status !== 200) return message.error("获取表格数据失败！");
      setData(res.data.employeeInterviewList);
      setTotal(res.data.totalCount);
    });
  };
  useEffect(() => {
    handleGetInterview();
  }, [pagination]);
  return (
    <div>
      <Card
        title={
          <span style={{ fontSize: "30px", fontWeight: 700 }}>员工面试</span>
        }
        style={{ width: "100%", marginTop: "20px" }}
      >
        <Search
          value={searchValue}
          placeholder="请输入员工ID"
          allowClear
          enterButton={
            <Button type="primary" icon={<SearchOutlined />}>
              查询
            </Button>
          }
          size="large"
          onChange={handleInputChange}
          onSearch={(val) => {
            val && setData(data.filter((item) => item.id === Number(val)));
          }}
          addonBefore={<span>ID:</span>}
          className={style.searchInput}
        />
        <div style={{ marginBottom: "15px" }}>
          <Button
            type="primary"
            onClick={(e) => setNewItemModalVisible(true)}
            size="middle"
            icon={<PlusOutlined />}
            className={style.btn}
          >
            新建
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={data}
          style={{ marginBottom: "15px" }}
          rowKey="id"
          pagination={false}
        />
        <Pagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={total}
          onChange={handleTableChange}
        />
      </Card>
      <Modal
        title="编辑"
        visible={editItemModalVisible}
        onCancel={handleEditItemCancel}
        width={800}
        footer={null}
        getContainer={false}
      >
        <Form
          validateMessages={validateMessages}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 15 }}
          form={editItemForm}
          onFinish={onEditItemModalFinish}
          initialValues={editFormValues}
        >
          <Form.Item
            name="id"
            label="ID"
            hasFeedback
            rules={[{ required: true }]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="name"
            label="姓名"
            hasFeedback
            rules={[
              { required: true },
              { pattern: /^[\u4E00-\u9FA5A-Za-z_]{0,10}$/ },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="telephone"
            label="手机"
            hasFeedback
            rules={[
              {
                required: true,
              },
              {
                pattern:
                  /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/,
                message: "请输入有效的手机号码！",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="interviewStatus"
            label="面试状态"
            hasFeedback
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="0">未面试</Option>
              <Option value="1">已面试</Option>
              <Option value="2">面试通过</Option>
              <Option value="3">面试不通过</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="interviewSituation"
            label="面试信息"
            hasFeedback
            rules={[{ required: true }]}
          >
            <TextArea />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 6 }}>
            <Button type="primary" htmlType="submit" className={style.btn}>
              确认
            </Button>
            <Button
              htmlType="button"
              onClick={handleNewItemCancel}
              className={style.btn}
            >
              取消
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="新建员工面试"
        visible={newItemModalVisible}
        onCancel={handleNewItemCancel}
        footer={null}
        getContainer={false}
      >
        <Form
          validateMessages={validateMessages}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 15 }}
          form={newItemForm}
          onFinish={onNewItemModalFinish}
        >
          <Form.Item
            name="name"
            label="姓名"
            hasFeedback
            rules={[
              { required: true },
              { pattern: /^[\u4E00-\u9FA5A-Za-z_]{0,10}$/ },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="telephone"
            label="手机"
            hasFeedback
            rules={[
              {
                required: true,
              },
              {
                pattern:
                  /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/,
                message: "请输入有效的手机号码！",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="interviewStatus"
            label="面试状态"
            hasFeedback
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="0">未面试</Option>
              <Option value="1">已面试</Option>
              <Option value="2">面试通过</Option>
              <Option value="3">面试不通过</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="interviewSituation"
            label="面试信息"
            hasFeedback
            rules={[{ required: true }]}
          >
            <TextArea />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 6 }}>
            <Button type="primary" htmlType="submit" className={style.btn}>
              新建
            </Button>
            <Button
              htmlType="button"
              onClick={handleNewItemCancel}
              className={style.btn}
            >
              取消
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Interview;
