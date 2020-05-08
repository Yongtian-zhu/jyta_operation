// 表格表单查询
import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Row, Col, Select, Icon, Input, DatePicker, InputNumber, Button } from 'antd';
import styles from '@/commonTableList.less';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;

class SearchForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandForm: false,
      formValues: {},
    };
  }

  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
      };
      this.setState({
        formValues: values,
      });
      this.props.dispatch({
        type: `${this.props.type}`,
        payload: values,
      });
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: `${this.props.type}`,
      payload: {},
    });
  };

  switchItem = (item) => {
    const type = item.type;
    const placeholder = item.placeholder;
    switch (type) {
      case 'number':
        return <InputNumber placeholder={placeholder} min={0} style={{ width: '100%' }} />;
        break;
      case 'text':
        return <Input placeholder={placeholder} />;
        break;
      case 'date_picker':
        return <DatePicker placeholder={placeholder} style={{ width: '100%' }} />;
        break;
      case 'range_picker':
        return <RangePicker style={{ width: '100%' }} />;
        break;
      case 'select_multiple':
        return (
          <Select mode="multiple" placeholder={placeholder} style={{ width: '100%' }}>
            {item.options.map((option, index) => {
              return (
                <Option key={index} value={option.value}>
                  {option.text}
                </Option>
              );
            })}
          </Select>
        );
      case 'select':
        return (
          <Select placeholder={placeholder} style={{ width: '100%' }}>
            {item.options.map((option, index) => {
              return (
                <Option key={index} value={option.value}>
                  {option.text}
                </Option>
              );
            })}
          </Select>
        );
      default:
        return <Input placeholder={placeholder} />;
        break;
    }
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  renderSimpleForm() {
    const { form: { getFieldDecorator }, formList } = this.props;
    let simpleForm = formList.slice(0, 3);
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 7, lg: 24, xl: 48 }}>
          {simpleForm.map((item, index) => {
            return (
              <Col md={7} sm={24} key={index}>
                <FormItem label={<span className={styles.lableText}>{item.lable}</span>}>
                  {getFieldDecorator(item.field)(this.switchItem(item))}
                </FormItem>
              </Col>
            );
          })}
          {formList.length > 3 ? <Col md={3} sm={24}>
            <span className={styles.submitButtons}>
              <a onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>
            </span>
          </Col> : ""}

        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator }, formList
    } = this.props;
    let simpleForm = formList.slice(0, 3);
    let AdvancedForm = formList.slice(3, formList.length);

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 7, lg: 24, xl: 48 }}>
          {simpleForm.map((item, index) => {
            return (
              <Col md={7} sm={24} key={index}>
                <FormItem label={<span className={styles.lableText}>{item.lable}</span>}>
                  {getFieldDecorator(item.field)(this.switchItem(item))}
                </FormItem>
              </Col>
            );
          })}

          <Input type="text" placeholder="你好" />

          <Col md={3} sm={24}>
            <span className={styles.submitButtons}>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                收起 <Icon type="up" />
              </a>
            </span>
          </Col>
        </Row>
        <Row gutter={{ md: 7, lg: 24, xl: 48 }}>
          {AdvancedForm.map((item, index) => {
            return (
              <Col md={7} sm={24} key={index}>
                <FormItem label={<span className={styles.lableText}>{item.lable}</span>}>
                  {getFieldDecorator(item.field)(this.switchItem(item))}
                </FormItem>
              </Col>
            );
          })}
        </Row>
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }


  render() {
    return (
      <Fragment>
        {/* <input type="text" placeholder="你好" /> */}

        <div className={styles.tableListForm}>{this.renderForm()}</div>
        <div className={styles.tableListOperator}>
          <div className={styles.tableListleft}>
            {this.props.rightButton}
          </div>
          <div className={styles.tableListRight}>
            <Button type="primary" onClick={this.handleSearch.bind(this)}>
              {this.props.SearchText || "查询"}
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
          </div>
        </div>
      </Fragment>
    )
  }
}

export default connect()(Form.create()(SearchForm));
