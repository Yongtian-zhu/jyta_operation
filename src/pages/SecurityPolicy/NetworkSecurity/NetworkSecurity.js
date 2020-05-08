import React, {Component} from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import {Card, Checkbox, Form, Input} from 'antd';
import styles from '../style.less'

const FormItem = Form.Item;
const {TextArea} = Input;

@Form.create()
class NetworkSecurity extends Component {
  render() {
    const {
      form: {getFieldDecorator},
    } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 8},
        md: {span: 8},
        lg: {span: 4},
        xxl: {span: 3}
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 12},
        md: {span: 12},
        lg: {span: 12},
        xxl: {span: 8}
      },
    };
    return (
      <Card bordered={false}>
        <Form style={{marginTop: 8}}>
          <span className={styles.title}>网络安全</span>
          <div className={styles.form_group}>
            <FormItem {...formItemLayout} label="启用白名单">
              {getFieldDecorator('isbaimingdan', {
                initialValue: true,
                valuePropName: 'checked',
              })(<Checkbox>启用</Checkbox>)}
            </FormItem>
            <FormItem {...formItemLayout} label="IP/域名白名单">
              {getFieldDecorator('ip', {
                initialValue: "",
              })(<TextArea
                placeholder="请输入"
                autosize={{minRows: 4}}
              />)}
            </FormItem>
            <FormItem {...formItemLayout} label="启用访问日志">
              {getFieldDecorator('fanwenrizhi', {
                initialValue: true,
                valuePropName: 'checked',
              })(<Checkbox>启用</Checkbox>)}
            </FormItem>
          </div>
        </Form>
      </Card>
    );
  }
}

export default NetworkSecurity;
