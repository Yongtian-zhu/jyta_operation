// 组织用户--组织
import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Select, Button, Divider, Badge, Modal } from 'antd';
import StandardTable from '@/components/StandardTable';
import SearchForm from '@/components/SearchForm';
import styles from '@/commonTableList.less';

const { confirm } = Modal;
const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
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
  // 新建表单
  const getModalContent = () => {
    return (
      <Form layout="horizontal">
        <Row>
          <Col span={24}>
            <FormItem {...formItemLayout} label="上级组织">
              {getFieldDecorator('highaddr', {
                initialValue: initData.highaddr,
                rules: [{ required: true, message: '请选择' }],
              })(
                <Select placeholder="请选择">
                  <Option value="请选择">请选择</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formItemLayout} label="组织名称">
              {getFieldDecorator('addrname', {
                initialValue: initData.addr,
                rules: [{ required: true, message: '请输入' }],
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formItemLayout} label="分类">
              {getFieldDecorator('type', {
                initialValue: initData.type,
                rules: [{ required: true, message: '请选择' }],
              })(
                <Select placeholder="请选择">
                  <Option value="组织">组织</Option>
                  <Option value="部门">部门</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formItemLayout} label="备注">
              {getFieldDecorator('remarks')(
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

@connect(({ organization, loading }) => ({
  organization,
  loading: loading.models.organization,
}))
@Form.create()
class Organization extends PureComponent {
  state = {
    selectedRows: [],
    formValues: {},
    columns: [
      {
        title: '组织',
        width: 250,
        dataIndex: 'addr',
      },
      {
        title: '上级',
        width: 250,
        dataIndex: 'highaddr',
        render: (text) => {
          return text == null ? "/" : text
        }
      },
      {
        title: '分类',
        width: 100,
        dataIndex: 'type',
        align: 'center',
        sorter: (a, b) => {
          return a.type.localeCompare(b.type);
        },
      },
      {
        title: '状态',
        width: 100,
        dataIndex: 'status',
        sorter: (a, b) => {
          return a.status.localeCompare(b.status);
        },
        align: 'center',
        render: (text) => {
          return text === "启用" ? <Badge color="#52c41a" text={text} /> : <Badge color="#f04134" text={text} />
        }
      },
      {
        title: '操作',
        width: 100,
        render: (text, record) => {
          return (
            <div className={styles.columnsnowrap}>
              <a onClick={() => this.showModal("修改组织", 'edit', record)}>修改</a>
              <Divider type="vertical" />
              <a onClick={() => this.handleSuccess(record)}>禁用</a>
            </div>
          );
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
      type: 'organization/fetch',
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
      type: 'organization/fetch',
      payload: params,
    });
  };

  // 禁用成功
  handleSuccess = (item) => {
    const { dispatch } = this.props;
    Modal.success({
      title: '禁用成功',
      content: <p>单位 <span className={styles.orgColor}>{item.addr}</span><span> 已禁用。</span></p>,
      okText: "确定",
    });
    const params = {
      currentPage: 1,
      pageSize: 10,
    };
    dispatch({
      type: 'organization/fetch',
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
      type: 'organization/fetch',
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
      organization: { data },  //, formList
      loading,
    } = this.props;
    const { columns, selectedRows } = this.state;
    const { visible, modalName, itemData = {} } = this.state;
    const parentMethods = {
      handleCancel: this.handleCancel,
      handleSubmit: this.handleSubmit
    };

    const formList = [
      { type: 'text', label: '组织名称', field: 'name', defaultValue: "", queryType: "包含" },
      {
        type: 'select', label: '是否启用', field: 'daibiaotuan', queryType: "=",
        options: [
          { text: "启用", value: "启用" },
          { text: "禁用", value: "禁用" }
        ]
      },
      { type: 'select', label: '上级组织', field: 'danweileibie', queryType: " ", }
    ];

    return (
      <Card bordered={false}>
        <div className={styles.tableList}>
          <SearchForm
            loading={loading}
            data={data}
            rowKey='id'
            columns={columns}

            formList={formList}
            type="organization/fetch"
            rightButton={<Fragment>
              <Button icon="plus" type="primary" onClick={this.showModal.bind(this, "新建组织", 'add')}>
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
            rowKey={record => record.commid}
            columns={columns}
            onSelectRow={this.handleSelectRows}
            onChange={this.handleStandardTableChange}
          />
        </div>
        <CreateForm {...parentMethods} visible={visible} modalName={modalName} initData={itemData} />
      </Card>
    );
  }
}

export default Organization;
