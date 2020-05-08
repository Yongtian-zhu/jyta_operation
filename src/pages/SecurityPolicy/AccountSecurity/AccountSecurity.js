import React, {Component} from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import {Card, Checkbox, Divider, Form, InputNumber} from 'antd';
import styles from '../style.less'

const FormItem = Form.Item;

@Form.create()
class AccountSecurity extends Component {
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
          <span className={styles.title}>密码策略</span>
          <div className={styles.form_group}>
            <FormItem {...formItemLayout} label="启用复杂度">
              {getFieldDecorator('fuzadu', {
                initialValue: true,
                valuePropName: 'checked',
              })(<Checkbox>启用</Checkbox>)}
            </FormItem>
            <FormItem {...formItemLayout} label="密码长度最小值">
              {getFieldDecorator('passwordLength', {
                initialValue: 8,
              })(
                <InputNumber min={1}/>)} <span className={styles.input_trem}>个字符</span>
            </FormItem>
            <FormItem {...formItemLayout} label="密码基本长使用期限">
              {getFieldDecorator('passwordTime', {
                initialValue: 365,
              })(
                <InputNumber min={1}/>)} <span className={styles.input_trem}>天</span>
            </FormItem>
            <FormItem {...formItemLayout} label="复杂度要求">
              {getFieldDecorator('fuzayaoqiu', {
                initialValue: ["含字母"],
              })(
                <Checkbox.Group options={['含字母', '含数字', '含特殊字符']}/>)}
            </FormItem>
          </div>
          <Divider/>
          <span className={styles.title}>锁定策略</span>
          <div className={styles.form_group}>
            <FormItem {...formItemLayout} label="启用锁定">
              {getFieldDecorator('shuoding', {
                initialValue: true,
                valuePropName: 'checked',
              })(<Checkbox>启用</Checkbox>)}
            </FormItem>
            <FormItem {...formItemLayout} label="锁定阈值">
              {getFieldDecorator('shuodingzhi', {
                initialValue: 5,
              })(
                <InputNumber min={1}/>)} <span className={styles.input_trem}>次登录失败</span>
            </FormItem>
            <FormItem {...formItemLayout} label="锁定时间">
              {getFieldDecorator('shuodingTime', {
                initialValue: 30,
              })(
                <InputNumber min={1}/>)} <span className={styles.input_trem}>分钟</span>
            </FormItem>
          </div>
          <Divider/>
          <span className={styles.title}>登录日志</span>
          <div className={styles.form_group}>
            <FormItem {...formItemLayout} label="启用登录日志">
              {getFieldDecorator('isloginlog', {
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

export default AccountSecurity;
