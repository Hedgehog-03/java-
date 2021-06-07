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
  DatePicker
} from "antd";
import moment from 'moment'
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import { getVacate, postVacate, putVacate } from "@/request/vacate";
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
      dataIndex: "staffName",
      key: "staffName",
      ellipsis: true,
    },
    {
      title: "截止时间",
      dataIndex: "leaveEndTime",
      key: "leaveEndTime",
      ellipsis: true,
      render: (text) => <a>{moment(text).format('YYYY/MM/DD hh:mm:ss')}</a>
    },
    {
      title: "离开时间",
      dataIndex: "leaveStartTime",
      key: "leaveStartTime",
      ellipsis: true,
      render: (text) => <a>{moment(text).format('YYYY/MM/DD hh:mm:ss')}</a>
    },
    {
      title: "离职原因",
      dataIndex: "leaveReason",
      key: "leaveReason",
      ellipsis: true,
    },
    {
      title: "持续时间",
      dataIndex: "lastTime",
      key: "lastTime",
      ellipsis: true,
    },
    {
      title: "审批人",
      dataIndex: "approcverName",
      key: "approcverName",
      ellipsis: true,
    },
    {
      title: "审批状态",
      dataIndex: "pass",
      key: "pass",
      ellipsis: true,
    },
    
    {
      title: "操作",
      dataIndex: "action",
      key: "action",
      render: (_, record) => (
        // <a href="#" onClick={(e) => editByKey(e, record)}>
        //   编辑
        // </a>
      <Button type="primary" onClick={(e) => editByKey(e, record)}>编辑</Button>
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
    values.user.approcverId = Number(values.user.approcverId);
    values.user.staffId = Number(values.user.staffId);
    values.user.id = Number(values.user.id);
    values.user.leaveEndTime = values.user.leaveEndTime.valueOf()
    values.user.leaveStartTime = values.user.leaveStartTime.valueOf()
    console.log('values',values);
    postVacate(values.user).then((res) => {
      console.log('res',res);
      if (res.data.status !== 200) return message.error("新建失败！");
      message.success("新建成功！");
      handleGetInterview();
    });
    setNewItemModalVisible(false);
  };
  // 监听编辑按钮的点击
  const editByKey = (e, record) => {
    record.leaveStartTime = moment(record.leaveStartTime);
    record.leaveEndTime = moment(record.leaveEndTime);
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
    editItemForm.resetFields();
    if(values.pass==="未审核"){
      values.pass = "0"
    }else if(values.pass==="审核"){
      values.pass = "1"
    }else{
      values.pass = "2"
    }
    values.leaveEndTime = values.leaveEndTime.valueOf()
    values.leaveStartTime = values.leaveStartTime.valueOf()
    values.staffId = Number(values.id)
    values.approcverId = Number(values.id)
    delete values.staffName
    
    console.log('values',values);
    
    putVacate(values).then((res) => {
      
      console.log('res',res);
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
    getVacate(pagination.current, pagination.pageSize, "").then((res) => {
      console.log(res);
      if (res.data.status !== 200) return message.error("获取表格数据失败！");
      console.log(res.data);
      setData(res.data.leaveRecordDTOList);
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
          <span style={{ fontSize: "30px", fontWeight: 700 }}>员工考勤</span>
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
            name='approcverName'
            label="审核人"
            hasFeedback
            rules={[
              { required: true },
              
            ]}
          >
            <Input onChange={e=>handleInputChange(e)} name="approcverName"/>
          </Form.Item>
          <Form.Item
            name="id"
            label="id"
            hasFeedback
            rules={[
              { required: true },
              
            ]}
          >
            <Input onChange={e=>handleInputChange(e)} name="id"/>
          </Form.Item>
          <Form.Item
            name="lastTime"
            label="持续"
            hasFeedback
            rules={[
              { required: true },
              
            ]}
          >
            <Input onChange={e=>handleInputChange(e)} name="lastTime"/>
          </Form.Item>
          <Form.Item
            name="staffName"
            label="员工姓名"
            hasFeedback
            rules={[
              { required: true },
              
            ]}
          >
            <Input onChange={e=>handleInputChange(e)} name="staffName"/>
          </Form.Item>
          <Form.Item
            name="leaveReason"
            label="离开原因"
            hasFeedback
            rules={[
              { required: true },
              
            ]}
          >
            <Input  onChange={e=>handleInputChange(e)} name="leaveReason"/>
          </Form.Item>
          <Form.Item
            name="pass"
            label="审核状态"
            hasFeedback
            rules={[
              { required: true },
              
            ]}
          >
             <Select>
            <Option value="未审核">未审核</Option>
            <Option value="通过">通过</Option>
            <Option value="不通过">不通过</Option>
          </Select>
          </Form.Item>
          <Form.Item name="leaveStartTime" label="开始时间" hasFeedback>
        <DatePicker placeholder="" />
        </Form.Item>
         
          <Form.Item
          name="leaveEndTime"
          label="结束时间"
          hasFeedback
          rules={[
            {
              required:true,
            },
          ]}
        >
          {/* <Input /> */}
          <DatePicker placeholder="" />
        </Form.Item>
          <Form.Item wrapperCol={{ offset: 6 }}>
            <Button type="primary" htmlType="submit" className={style.btn}>
              确认
            </Button>
            <Button
              htmlType="button"
              onClick={handleEditItemCancel}
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
            name={['user', 'staffId']}
            label="员工ID"
            hasFeedback
            rules={[
              { required: true },
              
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={['user', 'id']}
            label="id"
            hasFeedback
            rules={[
              { required: true },
              
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={['user', 'lastTime']}
            label="持续"
            hasFeedback
            rules={[
              { required: true },
              
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={['user', 'approcverId']}
            label="审核人ID"
            hasFeedback
            rules={[
              { required: true },
              
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={['user', 'leaveReason']}
            label="离开原因"
            hasFeedback
            rules={[
              { required: true },
              
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={['user', 'pass']}
            label="审核状态"
            hasFeedback
            rules={[
              { required: true },
              
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item name={['user', 'leaveStartTime']} label="开始时间" hasFeedback>
        <DatePicker onChange={(value)=>{console.log(value);}} />
        </Form.Item>
         
          <Form.Item
          name={['user', 'leaveEndTime']}
          label="结束时间"
          hasFeedback
          rules={[
            {
              required:true,
            },
          ]}
        >
          {/* <Input /> */}
          <DatePicker onChange={(value)=>{console.log(value);}} />
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
