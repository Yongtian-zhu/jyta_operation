// 组织用户--用户
import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Select, Button, Divider, Badge, Modal, Dropdown, Menu, Icon, Checkbox } from 'antd';
import StandardTable from '@/components/StandardTable';
import Ellipsis from '@/components/Ellipsis';
import SearchForm from '@/components/SearchForm';
import styles from '@/commonTableList.less';

const { confirm } = Modal;
const FormItem = Form.Item;
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
  const formItemLayout2 = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };
  const modalFooter = { okText: '确定', onOk: okHandle, onCancel: handleCancel };
  const getModalContent = () => {
    if (modalName === "重置密码") {
      return (
        <Form layout="horizontal">
          <Row>
            <Col span={24}>
              <FormItem {...formItemLayout2} label="用户账号">
                {initData.username}
              </FormItem>
            </Col>
            <Col span={24} style={{ marginTop: "-25px" }}>
              <FormItem {...formItemLayout2} label="主属组织">
                {initData.workaddr}
              </FormItem>
            </Col>
            <Col span={24} style={{ marginTop: "-15px" }}>
              <FormItem {...formItemLayout2} label="重置密码">
                {getFieldDecorator('password', {
                  initialValue: "conwin@2019",
                  rules: [{ required: true, message: '请输入' }],
                })(
                  <Input
                    type="password"
                    placeholder="请输入"
                  />,
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
      )
    }
    if (modalName === "分配角色") {
      return (
        <Form layout="horizontal">
          <Row>
            <Col span={24} style={{ marginTop: "-25px" }}>
              <FormItem {...formItemLayout} label="用户账号">
                {initData.username}
              </FormItem>
            </Col>
            <Divider orientation="left">角色配置</Divider>
            <Col span={24}>
              <FormItem {...formItemLayout} label="管理角色">
                {getFieldDecorator('adminrole', {
                  initialValue: ['市人大']
                })(
                  <Checkbox.Group style={{ width: '100%' }}>
                    <Row>
                      <Col span={6}>
                        <Checkbox value="市人大">市人大</Checkbox>
                      </Col>
                      <Col span={6}>
                        <Checkbox value="市政府">
                          市政府
                        </Checkbox>
                      </Col>
                    </Row>
                  </Checkbox.Group>,
                )}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem {...formItemLayout} label="用户角色">
                {getFieldDecorator('userrole', {
                  initialValue: ['承办单位']
                })(
                  <Checkbox.Group style={{ width: '100%' }}>
                    <Row>
                      <Col span={6}>
                        <Checkbox value="承办单位">承办单位</Checkbox>
                      </Col>
                      <Col span={6}>
                        <Checkbox value="人大代表">人大代表</Checkbox>
                      </Col>
                      <Col span={6}>
                        <Checkbox value="议案组">议案组</Checkbox>
                      </Col>
                    </Row>
                  </Checkbox.Group>,
                )}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem {...formItemLayout} label="运维角色">
                {getFieldDecorator('devrole', {
                  initialValue: ['测试人员']
                })(
                  <Checkbox.Group style={{ width: '100%' }}>
                    <Row>
                      <Col span={6}>
                        <Checkbox value="测试人员">测试人员</Checkbox>
                      </Col>
                      <Col span={6}>
                        <Checkbox value="运维人员">运维人员</Checkbox>
                      </Col>
                    </Row>
                  </Checkbox.Group>,
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
      )

    }
    return (
      <Form layout="horizontal">
        <Row>
          <Col span={24}>
            <FormItem {...formItemLayout} label="账号">
              {getFieldDecorator('username1', {
                initialValue: initData.username,
                rules: [{ required: true, message: '请输入' }],
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formItemLayout} label="姓名">
              {getFieldDecorator('name1', {
                initialValue: initData.name,
                rules: [{ required: true, message: '请输入' }],
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formItemLayout} label="主属组织">
              {getFieldDecorator('workaddr', {
                initialValue: initData.workaddr,
                rules: [{ required: true, message: '请选择' }],
              })(
                <Select placeholder="请选择">
                  <Option value="请选择">请选择</Option>
                </Select>,
              )}
            </FormItem>
          </Col>

          <Col span={24}>
            <FormItem {...formItemLayout} label="附属组织">
              {getFieldDecorator('addrs', {
                initialValue: initData.addrs,
                rules: [{ required: true, message: '请选择' }],
              })(
                <Select placeholder="请选择">
                  <Option value="请选择">请选择</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formItemLayout} label="手机号">
              {getFieldDecorator('mobile', {
                initialValue: initData.mobile,
                rules: [{ required: true, message: '请输入' }],
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formItemLayout} label="密码">
              {getFieldDecorator('password', {
                initialValue: "123456",
                rules: [{ required: true, message: '请输入' }],
              })(
                <Input
                  type="password"
                  placeholder="请输入"
                />,
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
      width={modalName === "重置密码" ? 360 : 640}
      bodyStyle={modalName === "重置密码" ? { padding: '0 18px' } : { padding: '28px 18px' }}
      destroyOnClose
      visible={visible}
      {...modalFooter}
    >
      {getModalContent()}
    </Modal>
  )
});

@connect(({ userorg, loading }) => ({
  userorg,
  loading: loading.models.userorg,
}))
@Form.create()
class User extends PureComponent {
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
        render: (text) => {
          return (
            <Ellipsis lines={1} title={text}>
              {text}
            </Ellipsis>
          )
        },
      },
      {
        title: '手机号',
        width: 120,
        dataIndex: 'mobile',
      },
      {
        title: '主属组织',
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
        title: '最近一次登录',
        width: 180,
        dataIndex: 'date',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:ss:mm')}</span>,
      },
      {
        title: '状态',
        width: 100,
        dataIndex: 'status',
        sorter: (a, b) => {
          return a.status.localeCompare(b.status);
        },
        align: 'center',
        render(text) {
          return text === "启用" ? <Badge color="#52c41a" text={text} /> : <Badge color="#f04134" text={text} />
        }
      },
      {
        title: '操作',
        width: 100,
        render: (text, record) => {
          return (
            <div className={styles.columnsnowrap}>
              <a onClick={() => this.showModal("修改用户", "edit", record)}>修改</a>
              <Divider type="vertical" />
              {record.status === "启用" ? <a onClick={() => this.handleSuccess(record, "禁用")}>禁用</a> :
                <a onClick={() => this.handleSuccess(record, "启用")}>启用</a>}
              <Divider type="vertical" />
              <Dropdown
                overlay={
                  <Menu onClick={({ key }) => this.HandlePwdAndSearch(key, record)}>
                    <Menu.Item key="pwd">重置密码</Menu.Item>
                    <Menu.Item key="role">分配角色</Menu.Item>
                    <Menu.Item key="search">查看权限</Menu.Item>
                  </Menu>
                }
              >
                <a>
                  更多 <Icon type="down" />
                </a>
              </Dropdown>
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
      type: 'userorg/fetch',
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
      isShowInpunt: false
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
      visible: false,
    });
  };

  // 禁用,启用成功
  handleSuccess = (item, status) => {
    const { dispatch } = this.props;
    Modal.success({
      title: `${status}成功`,
      content: <p>用户 <span className={styles.orgColor}>{item.mobile}</span><span> 已{status}。</span></p>,
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

  // 更多--重置密码、分配角色、查看权限
  HandlePwdAndSearch = (key, item) => {
    if (key === "pwd") {
      this.setState({
        visible: true,
        modalName: "重置密码",
        itemData: item,
      });
    } else if (key === "role") {
      this.setState({
        visible: true,
        modalName: "分配角色",
        itemData: item,
      });
    } else {
      this.setState({
        visible: true,
        modalName: "分配角色2",
        itemData: item,
      });
    }
  }

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
      type: 'userorg/fetch',
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
      type: 'userorg/fetch',
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
      userorg: { data },  //, formList 
      loading,
    } = this.props;
    const { columns, selectedRows } = this.state;
    const { visible, modalName, itemData = {} } = this.state;
    const parentMethods = {
      handleSubmit: this.handleSubmit,
      handleCancel: this.handleCancel
    };

    const formList = [
      {
        field: "name",
        label: "账号",
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
        field: "daibiaotuan",
        placeholder: "请选择",
        label: "组织",
        type: "text",
        defaultValue: "",
        queryType: "="
      },
      {
        field: "mobile",
        label: "手机号",
        placeholder: "请输入",
        type: "text",
        defaultValue: "",
        queryType: "包含"
      },
      {
        field: "status",
        placeholder: "请选择",
        label: "记录状态",
        type: "select",
        defaultValue: "",
        queryType: "=",
        options: [
          { text: "启用", value: "启用" },
          { text: "禁用", value: "禁用" }
        ]
      }
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
            type="userorg/fetch"
            rightButton={<Fragment>
              <Button icon="plus" type="primary" onClick={this.showModal.bind(this, "新建用户", 'add')}>
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
          <CreateForm {...parentMethods} visible={visible} modalName={modalName} initData={itemData} />
        </div>
      </Card>
    );
  }
}

export default User;
