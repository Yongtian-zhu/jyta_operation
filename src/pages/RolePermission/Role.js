// 角色权限管理----角色
import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Button, Input, Select, Card, Divider, Form, Modal, Tree } from 'antd';
import StandardTable from '@/components/StandardTable';
import TreeSelectTransfer from '@/components/TreeSelectTransfer';
import DescriptionList from '@/components/DescriptionList';
import SearchForm from '@/components/SearchForm';
import styles from '@/commonTableList.less';
import moment from "../LogManagement/HandleLog";

const { confirm } = Modal;
const FormItem = Form.Item;
const { Option } = Select;
const { TreeNode } = Tree;
const { Search } = Input;
const { Description } = DescriptionList;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const dataList = [];
const generateList = data => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    const { id, name } = node;
    dataList.push({ key: id, title: name });
    if (node.children) {
      generateList(node.children);
    }
  }
};
const getParentKey = (key, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some(item => item.id === key)) {
        parentKey = node.id;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};

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
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };
  const modalFooter = { okText: '确定', onOk: okHandle, onCancel: handleCancel };
  const getModalContent = () => {
    return (
      <Form layout="horizontal">
        <Row>
          <Col span={24}>
            <FormItem {...formItemLayout} label="角色名称">
              {getFieldDecorator('rolename', {
                initialValue: initData.name,
                rules: [{ required: true, message: '请输入' }],
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formItemLayout} label="角色分类">
              {getFieldDecorator('roletype', {
                initialValue: initData.type,
                rules: [{ required: true, message: '请选择' }],
              })(
                <Select placeholder="请选择">
                  <Option value="管理角色">管理角色</Option>
                  <Option value="用户角色">用户角色</Option>
                  <Option value="运维角色">运维角色</Option>
                </Select>,
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
      width={360}
      bodyStyle={{ padding: '0 18px' }}
      destroyOnClose
      visible={visible}
      {...modalFooter}
    >
      {getModalContent()}
    </Modal>
  )
});

@connect(({ role, loading }) => ({
  role,
  loading: loading.models.role,
}))
@Form.create()
class Role extends PureComponent {
  state = {
    selectedRows: [],
    formValues: {},
    columns: [
      {
        title: '角色名称',
        width: 200,
        dataIndex: 'name',
      },
      {
        title: '分类',
        dataIndex: 'type',
        sorter: (a, b) => {
          return a.type.localeCompare(b.type);
        },
      },
      {
        title: '操作',
        width: 100,
        render: (text, record) => {
          return (
            <div className={styles.columnsnowrap}>
              <a onClick={() => this.showModal("修改角色", 'edit', record)}>修改</a>
              <Divider type="vertical" />
              <a onClick={() => this.showModal2("权限分配", 0, record)}>权限分配</a>
              <Divider type="vertical" />
              <a onClick={() => this.showModal2("权限查看", 1, record)}>权限查看</a>
            </div>
          );
        },
      },
    ],
    visible: false,
    visible2: false,
    expandedKeys: [],
    searchValue: '',
    autoExpandParent: true,
  };


  componentDidMount() {
    // 获取初始化表单数据
    const { dispatch } = this.props;
    const params = {
      currentPage: 1,
      pageSize: 10,
    };
    dispatch({
      type: 'role/fetch',
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

  // 权限分配、权限查看
  showModal2 = (key, tag, item) => {
    const list = [
      {
        "id": "1",
        "name": "预提交管理",
        "level": 1,
        "sort": 1,
        "type": "目录",
        "icon": "floder",
        "reqaddr": "/program",
        "children": [{
          "id": "1_1",
          "name": "新建预案",
          "level": 2,
          "sort": 1,
          "type": "菜单",
          "icon": "file-add",
          "reqaddr": "/program/new"
        },
        {
          "id": "1_2",
          "name": "未提交",
          "level": 2,
          "sort": 1,
          "type": "菜单",
          "icon": "file",
          "reqaddr": "/program/plans",
          "children": [{
            "id": "1_2_1",
            "name": "修改",
            "level": 2,
            "sort": 1,
            "type": "按钮",
            "icon": "edit",
            "reqaddr": "edit"
          }, {
            "id": "1_2_2",
            "name": "删除",
            "level": 2,
            "sort": 1,
            "type": "按钮",
            "icon": "delete",
            "reqaddr": "delete"
          }, {
            "id": "1_2_3",
            "name": "提交",
            "level": 2,
            "sort": 1,
            "type": "按钮",
            "icon": "file",
            "reqaddr": "/submit"
          }, {
            "id": "1_2_4",
            "name": "联名",
            "level": 2,
            "sort": 1,
            "type": "按钮",
            "icon": "file",
            "reqaddr": "/submit"
          }]
        },
        {
          "id": "1_3",
          "name": "待立案",
          "level": 2,
          "sort": 1,
          "type": "菜单",
          "icon": "file-add",
          "reqaddr": "/program/not-filing",
          "children": [{
            "id": "1_3_1",
            "name": "修改",
            "level": 2,
            "sort": 1,
            "type": "按钮",
            "icon": "edit",
            "reqaddr": "edit"
          }, {
            "id": "1_3_2",
            "name": "删除",
            "level": 2,
            "sort": 1,
            "type": "按钮",
            "icon": "delete",
            "reqaddr": "/"
          }, {
            "id": "1_3_3",
            "name": "立案",
            "level": 2,
            "sort": 1,
            "type": "按钮",
            "icon": "file",
            "reqaddr": "/"
          }]
        },
        {
          "id": "1_4",
          "name": "已立案",
          "level": 2,
          "sort": 1,
          "type": "菜单",
          "icon": "file",
          "reqaddr": "/program/filing"
        },
        {
          "id": "1_5",
          "name": "退回案",
          "level": 2,
          "sort": 1,
          "type": "菜单",
          "icon": "file",
          "reqaddr": "/program/return-case"
        },
        {
          "id": "1_6",
          "name": "不予立案",
          "level": 2,
          "sort": 1,
          "type": "菜单",
          "icon": "file",
          "reqaddr": "/program/no-case-filed"
        }
        ]
      },
      {
        "id": "2",
        "name": "建议管理",
        "level": 1,
        "sort": 1,
        "type": "目录",
        "icon": "pushpin",
        "reqaddr": "/advice-manage",
        "children": [{
          "id": "2_1",
          "name": "全部案件",
          "level": 2,
          "sort": 1,
          "type": "菜单",
          "icon": "file",
          "reqaddr": "/advice-manage/all"
        },
        {
          "id": "2_2",
          "name": "新建建议",
          "level": 3,
          "sort": 1,
          "type": "菜单",
          "icon": "file",
          "reqaddr": "/advice-manage/all/add-advice"
        },
        {
          "id": "2_3",
          "name": "修改建议",
          "level": 3,
          "sort": 1,
          "type": "菜单",
          "icon": "file",
          "reqaddr": "/advice-manage/all/edit-advice"
        },
        {
          "id": "2_4",
          "name": "立案管理",
          "level": 2,
          "sort": 1,
          "type": "目录",
          "icon": "file",
          "reqaddr": "/advice-manage/advice",
          "children": [{
            "id": "2_4_1",
            "name": "已立案",
            "level": 3,
            "sort": 1,
            "type": "菜单",
            "icon": null,
            "reqaddr": "/advice-manage/advice/filing"
          }, {
            "id": "2_4_2",
            "name": "已撤案",
            "level": 3,
            "sort": 1,
            "type": "菜单",
            "icon": null,
            "reqaddr": "/advice-manage/advice/revoke"
          }, {
            "id": "2_4_3",
            "name": "已撤回",
            "level": 3,
            "sort": 1,
            "type": "菜单",
            "icon": null,
            "reqaddr": "/advice-manage/advice/withdraw-case"
          }, {
            "id": "2_4_4",
            "name": "已删除",
            "level": 3,
            "sort": 1,
            "type": "菜单",
            "icon": null,
            "reqaddr": "/advice-manage/advice/del-filing"
          }]
        },
        {
          "id": "2_5",
          "name": "分办交办",
          "level": 2,
          "sort": 1,
          "type": "目录",
          "icon": "file",
          "reqaddr": "/advice-manage/assign",
          "children": [{
            "id": "2_5_1",
            "name": "分办",
            "level": 3,
            "sort": 1,
            "type": "菜单",
            "icon": null,
            "reqaddr": "/advice-manage/assign/branch"
          }, {
            "id": "2_5_2",
            "name": "交办",
            "level": 3,
            "sort": 1,
            "type": "菜单",
            "icon": null,
            "reqaddr": "/advice-manage/assign/not-assigned"
          }, {
            "id": "2_5_3",
            "name": "退回及拒收",
            "level": 3,
            "sort": 1,
            "type": "菜单",
            "icon": null,
            "reqaddr": "/advice-manage/assign/return-refuse"
          }, {
            "id": "2_5_4",
            "name": "已交办",
            "level": 3,
            "sort": 1,
            "type": "菜单",
            "icon": null,
            "reqaddr": "/advice-manage/assign/assigned"
          }]
        },
        {
          "id": "2_6",
          "name": "签收",
          "level": 2,
          "sort": 1,
          "type": "目录",
          "icon": "file",
          "reqaddr": "/advice-manage/signed-manage",
          "children": [{
            "id": "2_6_1",
            "name": "未签收",
            "level": 3,
            "sort": 1,
            "type": "菜单",
            "icon": null,
            "reqaddr": "/advice-manage/signed-manage/unsigned"
          }, {
            "id": "2_6_2",
            "name": "未全部签收",
            "level": 3,
            "sort": 1,
            "type": "菜单",
            "icon": null,
            "reqaddr": "/advice-manage/signed-manage/all-unsigned"
          }, {
            "id": "2_6_3",
            "name": "已签收",
            "level": 3,
            "sort": 1,
            "type": "菜单",
            "icon": null,
            "reqaddr": "/advice-manage/signed-manage/signed"
          }]
        },
        {
          "id": "2_7",
          "name": "答复",
          "level": 2,
          "sort": 1,
          "type": "目录",
          "icon": "file",
          "reqaddr": "/advice-manage/reply",
          "children": [{
            "id": "2_7_1",
            "name": "全部答复",
            "level": 3,
            "sort": 1,
            "type": "菜单",
            "icon": null,
            "reqaddr": "/advice-manage/reply/units-reply"
          }, {
            "id": "2_7_2",
            "name": "未全部答复",
            "level": 3,
            "sort": 1,
            "type": "菜单",
            "icon": null,
            "reqaddr": "/advice-manage/reply/all-not-reply"
          }, {
            "id": "2_7_3",
            "name": "已全部答复",
            "level": 3,
            "sort": 1,
            "type": "菜单",
            "icon": null,
            "reqaddr": "/advice-manage/reply/all-reply"
          }]
        },
        {
          "id": "2_8",
          "name": "评价",
          "level": 2,
          "sort": 1,
          "type": "目录",
          "icon": "file",
          "reqaddr": "/advice-manage/assess",
          "children": [{
            "id": "2_8_1",
            "name": "未评价",
            "level": 3,
            "sort": 1,
            "type": "菜单",
            "icon": null,
            "reqaddr": "/advice-manage/assess/not-assess"
          }, {
            "id": "2_8_2",
            "name": "已评价",
            "level": 3,
            "sort": 1,
            "type": "菜单",
            "icon": null,
            "reqaddr": "/advice-manage/assess/assess"
          }]
        }
        ]
      },
    ];
    if (tag === 0) {
      console.log("权限分配")
    } else {
      generateList(list);
      this.setState({
        listData: list
      });
    }
    this.setState({
      visible2: true,
      modalName: key,
      itemData: item,
      tag: tag,
      listData: list
    });
  };

  handleCancel2 = () => {
    this.setState({
      visible2: false,
    });
  };

  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };


  onChange = e => {
    const { listData } = this.state;
    const { value } = e.target;
    const expandedKeys = dataList.map(item => {
      if (item.title.indexOf(value) > -1) {
        return getParentKey(item.key, listData);
      }
      return null;
    })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    this.setState({
      expandedKeys,
      searchValue: value,
      autoExpandParent: true,
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
      type: 'role/fetch',
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
      type: 'role/fetch',
      payload: params,
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  getRightDataKey = (rightdatakey, flag) => {
    console.log(rightdatakey)
  };

  getrightDataItem = (item) => {
    console.log(item)

  };

  render() {
    const {
      role: { data }, // , formList
      loading,
    } = this.props;
    const { columns, selectedRows } = this.state;
    const formList = [
      {
        field: "name",
        label: "角色名称",
        placeholder: "请输入",
        type: "text",
        defaultValue: "",
        queryType: "包含"
      }
    ];
    const { visible, modalName, itemData = {}, visible2, listData = [], tag, searchValue, expandedKeys, autoExpandParent } = this.state;
    const parentMethods = {
      handleCancel: this.handleCancel,
      handleSubmit: this.handleSubmit
    };
    const loop = (data) =>
      data.map(item => {
        const index = item.name.indexOf(searchValue);
        const beforeStr = item.name.substr(0, index);
        const afterStr = item.name.substr(index + searchValue.length);
        const title =
          index > -1 ? (
            <span>
              {beforeStr}
              <span style={{ color: '#f50' }}>{searchValue}</span>
              {afterStr}
            </span>
          ) : (
              <span>{item.name}</span>
            );
        if (item.children) {
          return (
            <TreeNode key={item.id} title={title}>
              {loop(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode key={item.id} title={title} />;
      });
    const elem = <>
      <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={this.onChange} />
      <Tree
        showLine
        switcherIcon={null}
        onExpand={this.onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
      >
        {loop(listData)}
      </Tree>
    </>;
    const elem2 = <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <TreeSelectTransfer
        dataSource={listData}
        bodyHeight={260}
        titles={['未分配权限', "已分配权限"]}
        getRightDataKey={this.getRightDataKey}
        getrightDataItem={this.getrightDataItem}
      />
    </div>

    return (
      <Card bordered={false}>
        <div className={styles.tableList}>
          <SearchForm
            formList={formList}
            type="role/fetch"
            rightButton={<Fragment>
              <Button icon="plus" type="primary" onClick={this.showModal.bind(this, "新建角色", 'add')}>
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
        <Modal
          visible={visible2}
          title={modalName}
          width={800}
          bodyStyle={{ padding: '18px 28px' }}
          onCancel={this.handleCancel2}
          footer={null}
        >
          <DescriptionList size="small" col="2">
            <Description style={{ paddingBottom: 15 }} term="角色名称">{itemData.name}</Description>
            <Description style={{ paddingBottom: 15 }} term="角色分类">{itemData.type}</Description>
          </DescriptionList>
          <Divider orientation="left">角色权限</Divider>
          {tag === 0 ? elem2 : elem}
        </Modal>
      </Card>
    );
  }
}

export default Role;
