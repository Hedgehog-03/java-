// 员工信息

import style from "./style.module.css";
import React, { useEffect, useState } from "react";
import {
  Table,
  Card,
  Input,
  Button,
  Modal,
  message,
  Form,
  Select,
  DatePicker,
  InputNumber,
  Radio,
  Pagination,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import moment from "moment";
import { getInfo, putInfo } from "@/request/information";
import { getPosition } from "@/request/position";
import { getQualification } from "@/request/qualification";
const { Search } = Input;
const { Option } = Select;

function Information() {
  // 表格的列(固定值)
  const columns = [
    {
      title: "员工ID",
      dataIndex: "id",
      key: "id",
      ellipsis: true,
      width: 80,
      align: "center",
    },
    {
      title: "姓名",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
      width: 100,
      align: "center",
    },
    {
      title: "身份证",
      dataIndex: "idCard",
      key: "idCard",
      ellipsis: true,
      align: "center",
    },
    {
      title: "年龄",
      dataIndex: "age",
      key: "age",
      ellipsis: true,
      width: 70,
      align: "center",
    },
    {
      title: "性别",
      dataIndex: "sex",
      key: "sex",
      ellipsis: true,
      width: 70,
      align: "center",
    },
    {
      title: "职位",
      dataIndex: "positionName",
      key: "positionName",
      ellipsis: true,
      width: 100,
      align: "center",
    },
    {
      title: "资质",
      dataIndex: "qualificationName",
      key: "qualificationName",
      ellipsis: true,
      width: 120,
      align: "center",
    },
    {
      title: "教育经历",
      dataIndex: "education",
      key: "education",
      ellipsis: true,
      width: 100,
      align: "center",
    },
    {
      title: "入职日期",
      dataIndex: "entryTime",
      key: "entryTime",
      render: (value) => moment(value).format("YYYY-MM-DD"),
      ellipsis: true,
      width: 120,
      align: "center",
    },
    {
      title: "合同到期",
      dataIndex: "contractExpirationTime",
      key: "contractExpirationTime",
      render: (value) => moment(value).format("YYYY-MM-DD"),
      ellipsis: true,
      width: 120,
      align: "center",
    },
    {
      title: "是否在岗",
      dataIndex: "isResigned",
      key: "isResigned",
      render: (value) => (value ? "离职" : "在职"),
      ellipsis: true,
      width: 100,
      align: "center",
    },
    {
      title: "操作",
      dataIndex: "action",
      key: "action",
      render: (_, record) => (
        <a href="#" onClick={(e) => updateByKey(e, record)}>
          编辑
        </a>
      ),
      ellipsis: true,
      width: 100,
      align: "center",
    },
  ];
  // 职位列表
  const [positionList, setPositionList] = useState([]);
  // 资质列表
  const [qualificationList, setQualificationList] = useState([]);
  // 搜索框的数据源(受控组件)
  const [searchValue, setSearchValue] = useState("");
  // 表格数据
  const [data, setData] = useState([]);
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
    if (!e.target.value) handleGetInfo();
  };
  // 页码变化时改变表格数据
  const handleTableChange = (current, size) => {
    setPagination({
      current: current,
      pageSize: size,
    });
  };
  // 监听编辑按钮的点击
  const updateByKey = (e, record) => {
    e.preventDefault();
    record.contractExpirationTime = moment(record.contractExpirationTime);
    record.entryTime = moment(record.entryTime);
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
  const onEditItemModalFinish = async (values) => {
    editItemForm.resetFields();
    if (typeof values.positionName === "string") {
      for (let item of positionList) {
        if (item.name === values.positionName) values.positionName = item.id;
      }
    }
    if (typeof values.qualificationName === "string") {
      for (let item of qualificationList) {
        if (item.name === values.qualificationName)
          values.qualificationName = item.id;
      }
    }
    values.positionId = values.positionName;
    values.qualificationId = values.qualificationName;
    values.entryTime = values.entryTime.valueOf();
    values.contractExpirationTime = values.contractExpirationTime.valueOf();
    delete values.positionName;
    delete values.qualificationName;
    await putInfo(values).then((res) => {
      if (res.data.status !== 200) return message.error("修改失败！");
      message.success("修改成功！");
      handleGetInfo();
    });
    setEditItemModalVisible(false);
  };
  const validateMessages = {
    required: "必填",
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
  // 获取表格数据
  const handleGetInfo = async () => {
    await getInfo(pagination.current, pagination.pageSize, "").then((res) => {
      if (res.data.status !== 200) return message.error("获取表格数据失败！");
      setData(res.data.staffDTOList);
      setTotal(res.data.totalCount);
    });
  };
  // 组件挂载时获取表格数据
  useEffect(() => {
    handleGetInfo();
    getPosition(1, 100, "").then((res) => {
      setPositionList(res.data.positionList);
    });
    getQualification(1, 100, "").then((res) => {
      setQualificationList(res.data.qualificationList);
    });
  }, [pagination]);
  return (
    <div>
      <Card
        title={
          <span style={{ fontSize: "30px", fontWeight: 700 }}>员工信息</span>
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
        <Table
          style={{ marginBottom: "15px" }}
          columns={columns}
          dataSource={data}
          rowKey="id"
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
            label="员工ID"
            rules={[{ required: true }]}
            hasFeedback
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="name"
            label="姓名"
            rules={[
              { required: true },
              { pattern: "^[\u4E00-\u9FA5A-Za-z_]{0,10}$" },
            ]}
            hasFeedback
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="idCard"
            label="身份证号"
            hasFeedback
            rules={[
              {
                pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
                message: "请输入有效的身份证号！",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="age"
            label="年龄"
            rules={[{ required: true }]}
            hasFeedback
          >
            <InputNumber min={1} max={100} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="sex"
            label="性别"
            rules={[{ required: true }]}
            hasFeedback
          >
            <Radio.Group>
              <Radio value={"男"}>男</Radio>
              <Radio value={"女"}>女</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="positionName"
            label="职位"
            hasFeedback
            rules={[{ required: true }]}
          >
            <Select>
              {positionList.map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="qualificationName"
            label="资质"
            hasFeedback
            rules={[{ required: true }]}
          >
            <Select>
              {qualificationList.map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="education"
            label="教育经历"
            rules={[{ required: true }]}
            hasFeedback
          >
            <Select>
              <Option value="本科毕业">本科毕业</Option>
              <Option value="硕士毕业">硕士毕业</Option>
              <Option value="博士毕业">博士毕业</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="entryTime"
            label="入职日期"
            rules={[{ required: true }]}
            hasFeedback
          >
            <DatePicker placeholder="" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="contractExpirationTime"
            label="合同到期"
            hasFeedback
            dependencies={["entryTime"]}
            rules={[
              { required: true },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("entryTime") < value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("合同到期应早于入职日期！"));
                },
              }),
            ]}
          >
            <DatePicker placeholder="" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="isResigned"
            label="是否在职"
            rules={[{ required: true }]}
            hasFeedback
          >
            <Radio.Group>
              <Radio value={false}>是</Radio>
              <Radio value={true}>否</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 6 }} hasFeedback>
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

export default Information;
