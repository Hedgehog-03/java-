// 员工绩效

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
  DatePicker,
  Pagination,
} from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import moment from "moment";
import { getPerformance, postPerformance } from "@/request/performance";
const { Search } = Input;

function Performance() {
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
      title: "日期",
      dataIndex: "date",
      key: "date",
      render: (value) => moment(value).format("YYYY-MM-DD"),
      ellipsis: true,
    },
    {
      title: "奖金",
      dataIndex: "bonus",
      key: "bonus",
      ellipsis: true,
    },
  ];
  // 表格数据
  const [data, setData] = useState([]);
  // 新建元素对话框的显示与隐藏
  const [newItemModalVisible, setNewItemModalVisible] = useState(false);
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
    if (!e.target.value) handleGetPerformance();
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
    form.resetFields();
    setNewItemModalVisible(false);
    message.info("已取消新建列表项！");
  };
  // 监听新建对话框的确认事件(表单的onFinish替代)
  const onNewItemModalFinish = (values) => {
    form.resetFields();
    values.staffId = Number(values.id);
    delete values.id;
    values.bonus = Number(values.bonus);
    values.date = values.date.valueOf();
    console.log(values);
    postPerformance(values).then((res) => {
      console.log(res);
      if (res.data.status !== 200) return message.error("新建失败！");
      handleGetPerformance();
      message.success("新建成功！");
    });
    setNewItemModalVisible(false);
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
  const handleGetPerformance = () => {
    getPerformance(pagination.current, pagination.pageSize, "").then((res) => {
      if (res.status !== 200) return message.error("获取表格数据失败！");
      setData(res.data.performanceDTOList);
      setTotal(res.data.totalCount);
    });
  };
  useEffect(() => {
    handleGetPerformance();
  }, [pagination]);
  return (
    <div>
      <Card
        title={
          <span style={{ fontSize: "30px", fontWeight: 700 }}>员工绩效</span>
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
        title="新建员工绩效"
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
            name="date"
            label="日期"
            hasFeedback
            rules={[{ required: true }]}
          >
            <DatePicker placeholder="" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="bonus"
            label="奖金"
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

export default Performance;
