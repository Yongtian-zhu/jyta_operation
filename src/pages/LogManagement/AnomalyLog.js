// 日志管理--异常日志
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

@connect(({ anomalylog, loading }) => ({
  anomalylog,
  loading: loading.models.anomalylog,
}))
@Form.create()
class AnomalyLog extends PureComponent {
  state = {
    selectedRows: [],
    formValues: {},
    columns: [
      {
        title: '操作功能',
        width: 150,
        dataIndex: 'operation',
        render: (text) => {
          return (
            <Ellipsis lines={1} title={text}>
              {text}
            </Ellipsis>
          )
        },
      },
      {
        title: '操作账号',
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
        title: '操作时间',
        width: 180,
        dataIndex: 'date',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:ss:mm')}</span>,
      },
      {
        title: '异常信息',
        width: 150,
        dataIndex: 'message',
        render: (text) => {
          return (
            <Ellipsis lines={1} title={text}>
              {text}
            </Ellipsis>
          )
        },
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
      type: 'anomalylog/fetch',
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
      type: 'anomalylog/fetch',
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
      anomalylog: { data },//, formList
      loading,
    } = this.props;
    const { columns } = this.state;
    const formList = [
      {
        field: "name",
        label: "操作账号",
        placeholder: "请输入",
        type: "text",
        defaultValue: "",
        queryType: "包含"
      },
      {
        field: "date",
        label: "操作时间",
        placeholder: "请输入",
        type: "range_picker",
        defaultValue: "",
        queryType: "包含"
      },
      {
        field: "content",
        label: "操作内容",
        placeholder: "请输入",
        type: "text",
        defaultValue: "",
        queryType: "包含"
      }
    ];

    return (
      <Card bordered={false}>
        <div className={styles.tableList}>
          <SearchForm
            formList={formList}
            type="anomalylog/fetch"
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

export default AnomalyLog;
