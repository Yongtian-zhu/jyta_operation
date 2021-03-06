//  角色权限管理----应用资源
import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Row, Col, Button, Input, Select, Card, Divider, Radio, InputNumber, Tag, Form, Modal, Tabs } from 'antd';
import StandardTable from '@/components/StandardTable';
import DescriptionList from '@/components/DescriptionList';
import SearchForm from '@/components/SearchForm';
import styles from '@/commonTableList.less';

const { confirm } = Modal;
const FormItem = Form.Item;
const { Option } = Select;
const { TabPane } = Tabs;
const { Description } = DescriptionList;
const { TextArea } = Input;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const CreateForm = Form.create()(props => {
  const { form, visible, initData, modalName, handleSubmit, handleCancel } = props;
  const {
    form: { getFieldDecorator },
  } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (!err) {
        form.resetFields();
        handleSubmit(fieldsValue);
      }
    });
  };
  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 19 },
  };
  const modalFooter = { okText: '确定', onOk: okHandle, onCancel: handleCancel };
  const getModalContent = () => {
    return (
      <Form layout="horizontal">
        <Row>
          <Col span={24}>
            <FormItem {...formItemLayout} label="资源ID:">
              {getFieldDecorator('resid', {
                initialValue: initData.id,
                rules: [{ required: true, message: '请输入' }],
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formItemLayout} label="资源名称:">
              {getFieldDecorator('resname', {
                initialValue: initData.name,
                rules: [{ required: true, message: '请输入' }],
              })(
                <Input placeholder="添加用户" />
              )}
            </FormItem>
          </Col>

          <Col span={24}>
            <FormItem {...formItemLayout} label="资源类型:">
              {getFieldDecorator('restype', {
                initialValue: initData.type,
                rules: [{ required: true, message: '请选择' }],
              })(
                <Radio.Group>
                  <Radio value="接口">接口</Radio>
                  <Radio value="页面">页面</Radio>
                </Radio.Group>,
              )}
            </FormItem>
          </Col>

          <Col span={24}>
            <FormItem {...formItemLayout} label="访问级别:">
              {getFieldDecorator('resrank', {
                initialValue: initData.rank,
                rules: [{ required: true, message: '请选择' }]
              })(
                <Radio.Group>
                  <Radio value="匿名">匿名</Radio>
                  <Radio value="登录">登录</Radio>
                  <Radio value="授权">授权</Radio>
                </Radio.Group>
              )}
            </FormItem>
          </Col>

          <Col span={24}>
            <FormItem {...formItemLayout} label="资源地址:">
              {getFieldDecorator('reqaddr', {
                initialValue: initData.address,
                rules: [{ required: true, message: "请输入" }],
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>

          <Col span={24}>
            <FormItem {...formItemLayout} label="备注:">
              {getFieldDecorator('remarks', {
                initialValue: initData.remarks,
                rules: [{ required: false, message: "请输入" }],
              })(
                <TextArea rows={4} placeholder="请输入" />
              )}
            </FormItem>
          </Col>

        </Row>
      </Form>
    );
  };
  return (
    <Modal
      title={modalName}
      className={styles.standardListForm}
      width={640}
      bodyStyle={{ padding: '28px 18px' }}
      destroyOnClose
      visible={visible}
      {...modalFooter}
    >
      {getModalContent()}
    </Modal>
  )
});

@connect(({ rolemenu, loading }) => ({
  rolemenu,
  loading: loading.models.rolemenu,
}))
@Form.create()
class RoleMenu extends PureComponent {
  state = {
    selectedRows: [],
    formValues: {},
    columns: [
      {
        title: '资源ID',
        width: 200,
        dataIndex: 'id',
      },
      {
        title: '资源名称',
        dataIndex: 'name',
        width: 100,
      },

      {
        title: '资源类型',
        dataIndex: 'reqaddr',
        width: 100,

        render: (text) => {
          return text === "页面" ? <Tag color="#40a9ff">{text}</Tag> : text === "接口" ?
            <Tag color="#73d13d">{text}</Tag> : <Tag color="#ff9900">{text}</Tag>
        }
      },

      {
        title: '访问级别',
        dataIndex: 'rank',
        width: 100,
      },
      {
        title: '请求方法',
        dataIndex: 'url',
        width: 100,

      },

      {
        title: '资源地址',
        dataIndex: 'reqaddr',
        // width: 200,

        sorter: (a, b) => {
          return a.reqaddr.localeCompare(b.reqaddr);
        },
        render: (text) => {
          return text === null ? "-" : text
        },
      },
      {
        title: '操作',
        width: 100,
        render: (text, record) => {
          return (
            <div className={styles.columnsnowrap}>
              <a onClick={() => this.showModal("修改菜单", 'edit', record)}>修改</a>
              <Divider type="vertical" />
              <a onClick={() => this.showModal2(record)}>查看</a>
            </div>
          );
        },
      },
    ],
    // 查看
    columns2: [
      {
        title: '角色名称',
        dataIndex: 'name',
      },
      {
        title: '添加人',
        dataIndex: 'addname',
      },
      {
        title: '添加日期',
        dataIndex: 'date',
      },
    ],
    visible: false,
    visible2: false,
  };


  componentDidMount() {
    // 获取初始化表单数据
    const { dispatch } = this.props;
    const params = {
      currentPage: 1,
      pageSize: 10,
    };
    dispatch({
      type: 'rolemenu/fetch',
      payload: params,
    });

  }

  // 新建、修改
  showModal = (key, name, item) => {
    this.setState({
      visible: true,
      modalName: key,
      itemData: name === 'add' ? undefined : item,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  handleSubmit = (fieldsValue) => {
    const { dispatch } = this.props;
    const { itemData, modalName } = this.state;
    console.log(fieldsValue)
    // dispatch({
    //   type: 'branch/fetch',
    // });
    this.setState({
      visible: false
    });
  };

  // 查看
  showModal2 = (item) => {
    const dataSource = [
      {
        addname: "admin",
        date: '2019-10-01',
        id: 1,
        name: '市人大',
      },
      {
        addname: "admin",
        date: '2019-10-01',
        id: 2,
        name: '办理单位',
      },
      {
        addname: "admin",
        date: '2019-10-01',
        id: 3,
        name: '人大代表',
      },
      {
        addname: "admin",
        date: '2019-10-01',
        id: 4,
        name: '议案组',
      },
    ];
    this.setState({ visible2: true, listData: item, tableListData: dataSource })
  }

  handleCancel2 = () => {
    this.setState({
      visible2: false,
    });
  };


  // 删除
  handleDel = () => {
    const { selectedRows } = this.state;
    if (selectedRows.length === 0) {
      Modal.warning({
        title: '请先勾选数据',
        okText: "确定",
      });
    } else {
      // 调用删除的接口
      /* dispatch({
         type: '/remove',
         payload: {
           key: selectedRows.map(row => row.key),
         },
         callback: () => {
           this.setState({
             selectedRows: [],
           });
         },
       });*/

      let _this = this;
      confirm({
        title: '删除确认',
        content: <p>将删除 <span className={styles.orgColor}>{selectedRows.length}</span><span>条记录，你还要继续吗？</span></p>,
        okText: "继续",
        onOk() {
          _this.handleDelSuccess(selectedRows.length);
        }
      });
    }

  };

  // 删除成功
  handleDelSuccess = (item) => {
    const { dispatch } = this.props;
    Modal.success({
      title: '删除成功',
      content: <p>已删除<span className={styles.orgColor}>{item}</span><span> 条记录</span></p>,
      okText: "确定",
    });
    this.setState({
      selectedRows: [],
    });
    const params = {
      currentPage: 1,
      pageSize: 10,
    };
    dispatch({
      type: 'rolemenu/fetch',
      payload: params,
    });
  };

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
      type: 'rolemenu/fetch',
      payload: params,
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  // ************************!!!!
  render() {
    const {
      rolemenu: { data },//, formList
      loading,
    } = this.props;
    const { columns, selectedRows } = this.state;
    const { visible, modalName, itemData = {}, visible2, listData = {}, columns2, tableListData } = this.state;
    const parentMethods = {
      handleCancel: this.handleCancel,
      handleSubmit: this.handleSubmit
    };
    const formList = [
      {
        field: "username",
        label: "资源名称",
        placeholder: "请输入",
        type: "text",
        defaultValue: "",
        queryType: "包含"
      },
      {
        field: "reqaddr",
        label: "请求地址",
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
            type="rolemenu/fetch"
            rightButton={<Fragment>
              <Button icon="plus" type="primary" onClick={this.showModal.bind(this, "添加/修改资源 ", 'add')}>
                新建
              </Button>
              <Button type="primary" onClick={this.handleDel.bind(this)}>
                删除
              </Button>
              <Button>导出列表</Button>
            </Fragment>}
          />

          <StandardTable
            selectedRows={selectedRows}
            loading={loading}
            data={data}
            rowKey={record => record.id}
            columns={columns}
            onSelectRow={this.handleSelectRows}
            onChange={this.handleStandardTableChange}
          />
        </div>
        <CreateForm {...parentMethods} visible={visible} modalName={modalName} initData={itemData} />

        <Modal
          visible={visible2}
          title="查看菜单"
          width={640}
          bodyStyle={{ padding: '0 18px 28px' }}
          onCancel={this.handleCancel2}
          footer={null}
        >
          <Tabs defaultActiveKey="1">
            <TabPane tab="基础信息" key="1">
              <DescriptionList size="small" col="1">
                <Description style={{ paddingBottom: 15 }} term="资源ID:">{listData.id}</Description>
                <Description style={{ paddingBottom: 15 }} term="资源名称:">{listData.name}</Description>
                <Description style={{ paddingBottom: 15 }} term="资源类型">{listData.type}</Description>
                <Description style={{ paddingBottom: 15 }} term="访问级别">{listData.reqaddr}</Description>
                <Description style={{ paddingBottom: 15 }} term="资源地址">{listData.address}</Description>
                <Description style={{ paddingBottom: 15 }} term="请求方法">GET</Description>
                <Description style={{ marginLeft: 28, paddingBottom: 15 }} term="备注">{listData.remarks}</Description>

              </DescriptionList>
            </TabPane>
            <TabPane tab="所属角色" key="2">
              <Table pagination={false} rowKey={record => record.id} dataSource={tableListData} columns={columns2} />
            </TabPane>
          </Tabs>
        </Modal>
      </Card>
    );
  }
}

export default RoleMenu;
