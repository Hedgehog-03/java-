// 系统用户

import style from "./style.module.css";
import React, { useEffect, useState } from "react";
import {
  Table,
  Card,
  Input,
  Button,
  Alert,
  Modal,
  message,
  Form,
  Pagination,
} from "antd";
import {
  DeleteOutlined,
  SearchOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { getUser, postUser, deleteUser, putUser } from "@/request/user";
const { Search } = Input;
const { confirm } = Modal;

function User() {
  // 表格的列(固定值)
  const columns = [
    {
      title: "用户ID",
      dataIndex: "id",
      key: "id",
      ellipsis: true,
      align: "center",
    },
    {
      title: "员工ID",
      dataIndex: "staffId",
      key: "staffId",
      ellipsis: true,
      align: "center",
    },
    {
      title: "用户名",
      dataIndex: "username",
      key: "username",
      ellipsis: true,
      align: "center",
    },
    {
      title: "密码",
      dataIndex: "password",
      key: "password",
      ellipsis: true,
      align: "center",
    },
    {
      title: "员工姓名",
      dataIndex: "staffName",
      key: "staffName",
      ellipsis: true,
      align: "center",
    },
    {
      title: "操作",
      dataIndex: "action",
      key: "action",
      render: (_, record) => (
        <div>
          <a
            href="#"
            className={style.actionLink}
            onClick={(e) => deleteByKey(e, record.id)}
          >
            删除
          </a>
          <a
            href="#"
            className={`${style.actionLink} ${style.lastActionLink}`}
            onClick={(e) => editByKey(e, record)}
          >
            编辑
          </a>
        </div>
      ),
      ellipsis: true,
      align: "center",
    },
  ];
  // 搜索框的数据源(受控组件)
  const [searchValue, setSearchValue] = useState("");
  // 批量删除对话框里的表格列
  const noActionColumns = columns.filter(
    (_, index) => index !== columns.length - 1
  );
  // 表格数据
  const [data, setData] = useState([]);
  // 表格选中项的key
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  // 批量删除按钮的loading
  const [loading, setLoading] = useState(false);
  // 批量删除对话框的显示与隐藏
  const [batchDeleteModalVisible, setBatchDeleteModalVisible] = useState(false);
  // 批量删除对话框里表格数据
  const [intersectionArr, setIntersectionArr] = useState([]);
  // 新建元素对话框的显示与隐藏
  const [newItemModalVisible, setNewItemModalVisible] = useState(false);
  // 新建元素对话框里form表单
  const [newItemForm] = Form.useForm();
  // 编辑对话框的显示与隐藏
  const [editItemModalVisible, setEditItemModalVisible] = useState(false);
  // 编辑对话框表单的默认值
  const [editFormValues, setEditFormValues] = useState({});
  // 编辑对话框里的form表单
  const [editItemForm] = Form.useForm();
  // 分页器
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  // 监听搜索输入框的改变
  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
    if (!e.target.value) handleGetUser();
  };
  // 页码变化时改变表格数据
  const handleTableChange = (current, size) => {
    setPagination({
      current: current,
      pageSize: size,
    });
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
        await handleDeleteUser(id);
        await handleGetUser();
      },
      onCancel() {
        message.info("已取消删除！");
      },
    });
  };
  // 监听批量删除按钮的点击事件
  const batchDelete = () => {
    setLoading(true);
    setBatchDeleteModalVisible(true);
    const arr = [];
    console.log(data);
    data.forEach((x) => {
      selectedRowKeys.forEach((y) => {
        if (x.id === y)
          // 交集，表示要显示在确认删除页面里的数据
          arr.push(x);
      });
    });
    console.log(arr);
    setIntersectionArr(arr);
  };
  // 监听批量删除对话框的确认事件
  const handleBatchDeleteOk = () => {
    selectedRowKeys.forEach((item) => handleDeleteUser(item));
    setSelectedRowKeys([]);
    setBatchDeleteModalVisible(false);
    setLoading(false);
  };
  // 监听批量删除对话框的取消事件
  const handleBatchDeleteCancel = () => {
    setBatchDeleteModalVisible(false);
    setLoading(false);
    message.info("已取消删除！");
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
    values.staffId = Number(values.staffId);
    console.log(values);
    postUser(values).then((res) => {
      console.log(res);
      if (res.data.status !== 200)
        return message.error("新建失败：员工id不存在！");
      handleGetUser();
      message.success("新建成功！");
    });
    setNewItemModalVisible(false);
  };
  // 监听编辑按钮的点击
  const editByKey = (e, record) => {
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
    console.log(values);
    editItemForm.resetFields();
    delete values.staffName;
    putUser(values).then(res => {
      if (res.data.status !== 200) return message.error("修改失败！");
      message.success("修改成功！");
      handleGetUser();
    })
    setEditItemModalVisible(false);
  }
  // 获取表格数据
  const handleGetUser = () => {
    getUser(pagination.current, pagination.pageSize, "").then((res) => {
      // console.log(res);
      if (res.data.status !== 200) return message.error("获取表格数据失败！");
      setData(res.data.userDTOList);
      setTotal(res.data.totalCount);
    });
  };
  // 删除表格数据
  const handleDeleteUser = (id) => {
    deleteUser(id).then((res) => {
      if (res.status !== 200) return message.error("删除失败！");
      message.success("删除成功！");
    });
  };
  const hasSelected = selectedRowKeys.length > 0;
  const validateMessages = {
    required: "${label} 不能为空 !",
    types: {
      number: "请输入数字 !",
    },
    number: {
      range: "${label} 必须在 ${min} - ${max}之间",
    },
    pattern: {
      mismatch: "${label}只能由中文或英文组成，且长度不超过10位！",
    },
  };
  // 组件挂载时获取表格数据
  useEffect(() => {
    handleGetUser();
  }, [pagination]);
  return (
    <div>
      <Card
        title={
          <span style={{ fontSize: "30px", fontWeight: 700 }}>系统用户</span>
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
        <div>
          <Button
            type="primary"
            onClick={(e) => setNewItemModalVisible(true)}
            size="middle"
            icon={<PlusOutlined />}
            className={style.btn}
          >
            新建
          </Button>
          <Button
            type="danger"
            onClick={batchDelete}
            disabled={!hasSelected}
            loading={loading}
            size="middle"
            icon={<DeleteOutlined />}
            className={style.btn}
          >
            批量删除
          </Button>
        </div>
        <Alert
          className={style.alert}
          type="info"
          message={
            `一共 ${data.length} 项---` +
            (hasSelected
              ? `已选择 ${selectedRowKeys.length} 项`
              : "请选择要操作的项来执行更多功能")
          }
        />
        <Table
          columns={columns}
          dataSource={data}
          style={{ marginBottom: "15px" }}
          rowKey="id"
          rowSelection={{
            selectedRowKeys,
            onChange: (selectedRowKeys) => setSelectedRowKeys(selectedRowKeys),
          }}
          pagination={false}
        />
        <Pagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={total}
          onChange={handleTableChange}
        ></Pagination>
      </Card>
      <Modal
        title="注意：你正在删除数据，执行之后不可恢复"
        visible={batchDeleteModalVisible}
        onOk={handleBatchDeleteOk}
        onCancel={handleBatchDeleteCancel}
        okText="删除"
        cancelText="取消"
        width={1000}
      >
        <Alert type="warning" message={`一共${intersectionArr.length}项`} />
        <Table
          rowKey="id"
          columns={noActionColumns}
          dataSource={intersectionArr}
        />
      </Modal>
      <Modal
        title="新建用户"
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
            name="staffId"
            label="员工ID"
            hasFeedback
            rules={[
              {
                required: true,
                type: "number",
                transform(value) {
                  if (value) {
                    return Number(value);
                  }
                },
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="username"
            label="用户名"
            hasFeedback
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="密码"
            hasFeedback
            rules={[{ required: true }]}
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
      <Modal
        title="编辑"
        visible={editItemModalVisible}
        onCancel={handleEditItemCancel}
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
            label="用户id"
            hasFeedback
            rules={[
              {
                required: true,
                type: "number",
                transform(value) {
                  if (value) {
                    return Number(value);
                  }
                },
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="staffId"
            label="员工id"
            hasFeedback
            rules={[
              {
                required: true,
                type: "number",
                transform(value) {
                  if (value) {
                    return Number(value);
                  }
                },
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="staffName"
            label="员工姓名"
            hasFeedback
            rules={[
              { required: true },
              { pattern: "^[\u4E00-\u9FA5A-Za-z_]{0,10}$" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="username"
            label="用户名"
            hasFeedback
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="密码"
            hasFeedback
            rules={[{ required: true }]}
          >
            <Input />
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
    </div>
  );
}

export default User;
