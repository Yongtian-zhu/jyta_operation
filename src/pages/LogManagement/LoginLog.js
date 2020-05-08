// 日志管理--登录日志
import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Button, Card, Divider, Badge, Form, Modal } from 'antd';
import StandardTable from '@/components/StandardTable';
import Ellipsis from '@/components/Ellipsis';
import SearchForm from '@/components/SearchForm';
import styles from '@/commonTableList.less';
import router from "umi/router";

const { confirm } = Modal;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ loginlog, loading }) => ({
  loginlog,
  loading: loading.models.loginlog,
}))
@Form.create()
class LoginLog extends PureComponent {
  state = {
    selectedRows: [],
    formValues: {},
    columns: [
      {
        title: '账号',
        width: 100,
        dataIndex: 'name',
      },
      {
        title: '姓名',
        dataIndex: 'username',
        width: 150,
        render: (text) => {
          return (
            <Ellipsis lines={1} title={text}>
              {text}
            </Ellipsis>
          )
        },
      },
      {
        title: '主属部门',
        width: 150,
        dataIndex: 'workaddr',
        render: (text) => {
          return (
            <Ellipsis lines={1} title={text}>
              {text}
            </Ellipsis>
          )
        },
      },
      {
        title: '终端型号',
        width: 120,
        dataIndex: 'model',
      },
      {
        title: '操作系统',
        width: 120,
        dataIndex: 'sys',
      },
      {
        title: 'IP',
        width: 200,
        dataIndex: 'IP',
        sorter: (a, b) => {
          return a.IP.localeCompare(b.IP);
        },
      },
      {
        title: '操作状态',
        width: 100,
        dataIndex: 'status',
        sorter: (a, b) => {
          return a.status.localeCompare(b.status);
        },
        align: 'center',
        render(text) {
          return text === "成功" ? <Badge color="#52c41a" text={text} /> : <Badge color="#f04134" text={text} />
        }
      },
      {
        title: '操作信息',
        width: 120,
        dataIndex: 'message',
      },
      {
        title: '登录时间',
        width: 180,
        dataIndex: 'date',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:ss:mm')}</span>,
      },
    ],
    visible: false,
  };

  componentDidMount() {
    // 获取初始化表单数据
    const { dispatch } = this.props;
    const params = {
      currentPage: 1,
      pageSize: 10,
    };
    dispatch({
      type: 'loginlog/fetch',
      payload: params,
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    dispatch({
      type: 'loginlog/fetch',
      payload: params,
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  render() {
    const {
      loginlog: { data }, // , formList
      loading,
    } = this.props;
    const { columns } = this.state;
    const formList = [
      {
        field: "name",
        label: "登录账号",
        placeholder: "请输入",
        type: "text",
        defaultValue: "",
        queryType: "包含"
      },
      {
        field: "username",
        label: "姓名",
        placeholder: "请输入",
        type: "text",
        defaultValue: "",
        queryType: "包含"
      },
      {
        field: "ip",
        placeholder: "请输入",
        label: "IP地址",
        type: "text",
        defaultValue: "",
        queryType: "="
      },
      {
        field: "date",
        label: "登录时间",
        placeholder: "请输入",
        type: "range_picker",
        defaultValue: "",
        queryType: "包含"
      },
      {
        field: "status",
        placeholder: "请选择",
        label: "操作状态",
        type: "select",
        defaultValue: "",
        queryType: "=",
        options: [
          { text: "成功", value: "成功" },
          { text: "失败", value: "失败" }
        ]
      }
    ];
    return (
      <Card bordered={false}>
        <div className={styles.tableList}>
          <SearchForm
            formList={formList}
            type="loginlog/fetch"
            rightButton={<Fragment>
              <Button>导出列表</Button>
            </Fragment>}
          />
          <StandardTable
            selectedRows={[]}
            notSelected
            loading={loading}
            data={data}
            rowKey={record => record.commid}
            columns={columns}
            onSelectRow={this.handleSelectRows}
            onChange={this.handleStandardTableChange}
          />
        </div>
      </Card>
    );
  }
}

export default LoginLog;
