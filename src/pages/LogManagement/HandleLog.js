// 日志管理---操作日志
import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Button, Card, Divider, Badge, Form, Modal, Tabs, Table } from 'antd';
import StandardTable from '@/components/StandardTable';
import DescriptionList from '@/components/DescriptionList';
import Ellipsis from '@/components/Ellipsis';
import SearchForm from '@/components/SearchForm';
import styles from '@/commonTableList.less';

const { Description } = DescriptionList;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ handlelog, loading }) => ({
  handlelog,
  loading: loading.models.handlelog,
}))
@Form.create()
class HandleLog extends PureComponent {
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
        title: '操作结果',
        width: 100,
        dataIndex: 'message',
        sorter: (a, b) => {
          return a.message.localeCompare(b.message);
        },
        align: 'center',
        render(text, record) {
          return record.status === "成功" ? <Badge color="#52c41a" text={text} /> : <Badge color="#f04134" text={text} />
        }
      },
      {
        title: '账号',
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
        title: '操作时间',
        width: 180,
        dataIndex: 'date',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:ss:mm')}</span>,
      },
      {
        title: '操作内容',
        width: 150,
        dataIndex: 'content',
        render: (text) => {
          return (
            <Ellipsis lines={1} title={text}>
              {text}
            </Ellipsis>
          )
        },
      },
      {
        title: '操作',
        width: 80,
        render: (text, record) => {
          return (
            <div className={styles.columnsnowrap}>
              <a onClick={() => this.showModal(record)}>详情</a>
            </div>
          );
        },
      },

    ],
    columns2: [
      {
        title: '操作内容',
        dataIndex: 'title',
        width: 120,
      },
      {
        title: '原值',
        dataIndex: 'oldVal',
      },
      {
        title: '新值',
        dataIndex: 'newVal',
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
      type: 'handlelog/fetch',
      payload: params,
    });
  }

  showModal = (item) => {
    const dataSource = [
      {
        id: 1,
        newVal: '关于进一步加强特殊行业电动三轮车过渡期管理政策的建议',
        oldVal: '关于加强特殊行业电动三轮车过渡期管理政策的建议',
        title: "案件标题",
      },
      {
        id: 2,
        newVal: '黄毅,谭仲然,李胜飞,杨勤,熊永强,应宪,郭丽',
        oldVal: '黄毅,谭仲然,李胜飞',
        title: "附议人",
      },
      {
        id: 3,
        newVal: '人口问题已成为当今世界面临的重要社会问题之一。中国尤为突出。如何有效的控制人口增长已被各级政府所重视，并取得了卓有说服力的成绩，一九九六年来。我国总人口为12.24亿，全国人口自然增长率为10.42‰，而深圳市96年人口自然增长率为11.53‰，...',
        oldVal: '人口问题已成为当今世界面临的重要社会问题之一。中国尤为突出。如何有效的控制人口增长已被各级政府所重视，并取得了卓有说服力的成绩，一九九六年来。我国总人口为12.24亿，全国人口自然增长率为10.42‰，而深圳市96年人口自然增长率为11.53‰，...',
        title: "内容",
      },
    ];
    this.setState({ visible: true, listData: item, tableListData: dataSource })
  }

  handleCancel = () => {
    this.setState({ visible: false })
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
      type: 'handlelog/fetch',
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
      handlelog: { data }, //, formList
      loading,
    } = this.props;
    const { columns, visible, listData = {}, columns2, tableListData } = this.state;
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
        placeholder: "请输入",
        label: "操作内容",
        type: "text",
        defaultValue: "",
        queryType: "="
      }
    ];

    return (
      <Card bordered={false}>
        <div className={styles.tableList}>
          <SearchForm
            formList={formList}
            type="handlelog/fetch"
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
        <Modal
          visible={visible}
          title="操作详情"
          width={800}
          bodyStyle={{ padding: '18px 28px' }}
          onCancel={this.handleCancel}
          footer={null}
        >
          <DescriptionList size="small" col="2">
            <Description style={{ paddingBottom: 15 }} term="操作功能">{listData.operation}</Description>
            <Description style={{ paddingBottom: 15 }} term="操作结果">{listData.message}</Description>
            <Description style={{ paddingBottom: 15 }} term="操作账号">{listData.username}</Description>
            <Description style={{ paddingBottom: 15 }} term="姓名">{listData.workaddr}</Description>
            <Description style={{ paddingBottom: 15 }} term="IP地址">{listData.IP}</Description>
            <Description style={{ paddingBottom: 15 }} term="操作时间">{moment(listData.date).format('YYYY-MM-DD HH:ss:mm')}</Description>
          </DescriptionList>
          <Table pagination={false} rowKey={record => record.id} dataSource={tableListData} columns={columns2} />
        </Modal>
      </Card>
    );
  }
}

export default HandleLog;

