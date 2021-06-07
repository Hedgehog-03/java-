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
  DatePicker,
  Space
} from "antd";
import moment from 'moment'
import { SearchOutlined, PlusOutlined,DeleteOutline,ExclamationCircleOutlined } from "@ant-design/icons";
import { getPosition, postPosition, putPosition,delPosition } from "@/request/position";
const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;
const { confirm } = Modal;

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
      title: "职位名称",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
    },
    {
      title: "基本工资",
      dataIndex: "basicWage",
      key: "basicWage",
      ellipsis: true,
      
    },
    {
      title: "数量",
      dataIndex: "count",
      key: "count",
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
        <Space size="middle">
      <Button type="primary" onClick={(e) => editByKey(e, record)}>编辑</Button>
      <Button type="primary" onClick={(e) => deleteByKey(e, record)}>删除</Button>
      </Space>
       ),
      ellipsis: true,
      
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
    if (!e.target.value) handleGetPosition();
  };
   // 监听单行删除按钮的点击
   const deleteByKey = (e, id) => {
    e.preventDefault();
    // 确认删除对话框
    confirm({
      title: "确定删除吗?",
      icon: <ExclamationCircleOutlined />,
      okText: "确认",
      cancelText: "取消",
      async onOk() {
        await handleDeleteTrain(id);
        await handleGetPosition();
      },
      onCancel() {
        message.info("已取消删除！");
      },
    });
  };
  const handleDeleteTrain = (id) => {
    console.log('id',id);
    delPosition(id.id).then((res) => {
      if (res.status !== 200) return message.error("删除失败！");
      message.success("删除成功！");
    });
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
    values.user.id = Number(values.user.id);
    values.user.basicWage = Number(values.user.basicWage);
    values.user.count = Number(values.user.count);
    console.log(values);
    postPosition(values.user).then((res) => {
      if (res.data.status !== 200) return message.error("新建失败！");
      message.success("新建成功！");
      handleGetPosition();
    });
    setNewItemModalVisible(false);
  };
  // 监听编辑按钮的点击
  const editByKey = (e, record) => {
    e.preventDefault();
    console.log(record);
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
    
    values.id = Number(values.id)
    values.basicWage = Number(values.basicWage)
    values.count = Number(values.count)
    console.log('values',values);
    
    putPosition(values).then((res) => {
      
      console.log('res',res);
      if (res.data.status !== 200) return message.error("修改失败！");
      handleGetPosition();
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
  const handleGetPosition = () => {
    getPosition(pagination.current, pagination.pageSize, "").then((res) => {
      console.log(res);
      if (res.data.status !== 200) return message.error("获取表格数据失败！");
      console.log(res.data);
      setData(res.data.positionList);
      setTotal(res.data.totalCount);
    });
  };
  useEffect(() => {
    handleGetPosition();
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
          name="id"
          label="id"
          rules={[
            {
              required:true,
              type:'number',
              message: 'The input is not valid Number!',
            }
          ]}
        >
          <Input onChange={e=>handleInputChange(e)} name="id"/>
        </Form.Item>
        <Form.Item
          name="name"
          label="职位名称"
          rules={[
            {
              required: true,
              
            },{
              max:10,
              message: '姓名不能大于10个字符',
            }
          ]}
        >
          <Input onChange={e=>handleInputChange(e)} name="name"/>
        </Form.Item>
        <Form.Item
          name="count"
          label="总数"
          rules={[
            {
              required:true,
            },
          ]}
        >
          <Input onChange={e=>handleInputChange(e)} name="arrive"/>
          {/* <DatePicker 
          onChange={(value)=>{console.log(value)}}
          showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }} /> */}
        </Form.Item>
        <Form.Item name="basicWage" label="基础工资">
          <Input onChange={e=>handleInputChange(e)} name="leave"/>
          {/* <DatePicker 
          onChange={(value)=>{console.log(value);}} 
          showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}/> */}
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
            name={['user', 'id']}
            label="ID"
            hasFeedback
            rules={[
              { required: true },
              
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
          name={['user', 'count']}
          label="总数"
          hasFeedback
          rules={[
            {
              required:true,
            },
          ]}
        >
          <Input />
          
        </Form.Item>
        <Form.Item
          name={['user', 'basicWage']}
          label="基础工资"
          hasFeedback
          rules={[
            {
              required:true,
            },
          ]}
        >
          <Input />
          
        </Form.Item>
        <Form.Item
          name={['user', 'name']}
          label="职位名称"
          hasFeedback
          rules={[
            {
              required:true,
            },
          ]}
        >
          <Input />
          
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
