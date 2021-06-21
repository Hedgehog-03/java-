// 员工工资单
import style from "./style.module.css";
import React, { useState, useEffect } from "react";
import {
  Table,
  Card,
  Input,
  Button,
  message,
  Pagination,
} from "antd";
import moment from 'moment'
import { SearchOutlined } from "@ant-design/icons";
import { getPay } from "@/request/payment";
const { Search } = Input;

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
      title: "基本工资",
      dataIndex: "basicWage",
      key: "basicWage",
      ellipsis: true,
    },
    {
      title: "奖金",
      dataIndex: "bonus",
      key: "bonus",
      ellipsis: true,
      
    },
    {
      title: "日期",
      dataIndex: "date",
      key: "date",
      ellipsis: true,
      render: (text) => <a>{moment(text).format('YYYY/MM/DD hh:mm:ss')}</a>
    },
    {
      title: "总计",
      dataIndex: "total",
      key: "total",
      ellipsis: true,
    },
    {
      title: "员工姓名",
      dataIndex: "staffName",
      key: "staffName",
      ellipsis: true,
    },
  ];
  // 表格数据
  const [data, setData] = useState([]);
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
  const handleGetInterview = () => {
    getPay(pagination.current, pagination.pageSize, "").then((res) => {
      console.log(res);
      if (res.data.status !== 200) return message.error("获取表格数据失败！");
      console.log(res.data);
      setData(res.data.payRollDTOList);
      setTotal(res.data.totalCount);
    });
  };
  useEffect(() => {
    handleGetInterview();
  }, [pagination]);
  return (
    <Card
        title={
          <span style={{ fontSize: "30px", fontWeight: 700 }}>员工工资单</span>
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
  );
}

export default Interview;
