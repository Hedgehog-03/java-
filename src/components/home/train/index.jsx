// 员工参与的公司培训

import style from "./style.module.css";
import React, { useEffect, useState } from "react";
import {
  Table,
  Card,
  Input,
  Button,
  Alert,
  Tag,
  Modal,
  message,
  Form,
  DatePicker,
  Pagination,
} from "antd";
import {
  DeleteOutlined,
  SearchOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { getTrain, deleteTrain, postTrain } from "@/request/train";
const { Search } = Input;
const { confirm } = Modal;

function Train() {
  // 搜索框的数据源(受控组件)
  const [searchValue, setSearchValue] = useState("");
  // 表格的列(固定值)
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      ellipsis: true,
      width: 70,
      align: "center",
    },
    {
      title: "姓名",
      dataIndex: "staffName",
      key: "staffName",
      ellipsis: true,
      width: 100,
      align: "center",
    },
    {
      title: "训练",
      dataIndex: "trainingMethod",
      key: "trainingMethod",
      render: (value) => <Tag color="success">{value}</Tag>,
      ellipsis: true,
      width: 110,
      align: "center",
    },
    {
      title: "开始时间",
      dataIndex: "startTime",
      key: "startTime",
      render: (value) => moment(value).format("YYYY-MM-DD"),
      ellipsis: true,
      align: "center",
    },
    {
      title: "结束时间",
      dataIndex: "endTime",
      key: "endTime",
      render: (value) => moment(value).format("YYYY-MM-DD"),
      ellipsis: true,
      align: "center",
    },
    {
      title: "持续时间",
      dataIndex: "lastTime",
      key: "lastTime",
      ellipsis: true,
      align: "center",
    },
    {
      title: "评分",
      dataIndex: "score",
      key: "score",
      ellipsis: true,
      align: "center",
    },
    {
      title: "操作",
      dataIndex: "action",
      key: "action",
      render: (_, record) => (
        <a
          href="#"
          onClick={(e) => deleteByKey(e, record.id)}
        >
          删除
        </a>
      ),
      ellipsis: true,
      align: "center",
    },
  ];
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
  // 新建元素对话框的显示与隐藏
  const [newItemModalVisible, setNewItemModalVisible] = useState(false);
  // 批量删除对话框里表格数据
  const [intersectionArr, setIntersectionArr] = useState([]);
  // 新建元素对话框里form表单
  const [form] = Form.useForm();
  // 分页器
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  // 监听搜索输入框的改变
  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
    if (!e.target.value) handleGetTrain();
  };
  // 页码变化时改变表格数据
  const handleTableChange = (current, size) => {
    setPagination({
      current: current,
      pageSize: size,
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
    selectedRowKeys.forEach((item) => handleDeleteTrain(item));
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
        await handleGetTrain();
      },
      onCancel() {
        message.info("已取消删除！");
      },
    });
  };
  // 监听新建对话框的取消事件
  const handleNewItemCancel = () => {
    form.resetFields();
    setNewItemModalVisible(false);
    message.info("已取消新建列表项！");
  };
  // 监听新建对话框的确认事件(表单的onFinish替代)
  const onNewItemModalFinish = (values) => {
    form.resetFields();
    values.staffId = Number(values.id);
    delete values.id;
    values.score = Number(values.score);
    values.startTime = values.startTime.valueOf();
    values.endTime = values.endTime.valueOf();
    postTrain(values).then((res) => {
      console.log(res);
      if (res.data.status !== 200) return message.error("新建失败！");
      handleGetTrain();
      message.success("新建成功！");
    });
    setNewItemModalVisible(false);
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
  // 删除表格数据
  const handleDeleteTrain = (id) => {
    deleteTrain(id).then((res) => {
      if (res.status !== 200) return message.error("删除失败！");
      message.success("删除成功！");
    });
  };
  // 获取表格数据
  const handleGetTrain = () => {
    getTrain(pagination.current, pagination.pageSize, "").then((res) => {
      if (res.data.status !== 200) return message.error("获取表格数据失败！");
      setData(res.data.trainingDTOList);
      setTotal(res.data.totalCount);
    });
  };
  // 组件挂载时获取表格数据
  useEffect(() => {
    handleGetTrain();
  }, [pagination, total]);
  return (
    <div>
      <Card
        title={
          <span style={{ fontSize: "30px", fontWeight: 700 }}>员工培训</span>
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
        />
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
        title="新建员工培训表"
        visible={newItemModalVisible}
        onCancel={handleNewItemCancel}
        footer={null}
        getContainer={false}
      >
        <Form
          validateMessages={validateMessages}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 15 }}
          form={form}
          onFinish={onNewItemModalFinish}
        >
          <Form.Item
            name="id"
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
            name="trainingMethod"
            label="训练项目"
            hasFeedback
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="startTime"
            label="开始日期"
            hasFeedback
            rules={[{ required: true }]}
          >
            <DatePicker placeholder="" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="endTime"
            label="结束日期"
            hasFeedback
            dependencies={["startTime"]}
            rules={[
              {
                required: true,
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("startTime") < value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("开始日期应早于结束日期！"));
                },
              }),
            ]}
          >
            <DatePicker placeholder="" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="score"
            label="评分"
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
                min: 0,
                max: 100,
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

export default Train;
