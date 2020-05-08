import React, { Component } from 'react';
import { Form, Input, Button, Icon } from 'antd';
import DocumentTitle from 'react-document-title';
import { connect } from "dva";
import router from "umi/router";
import style from "./Login.less"

const FormItem = Form.Item;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
@Form.create()
class Login extends Component {
  state = {};

  handleSubmit = e => {
    const { form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        router.push('/user-organization')
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <DocumentTitle title="运维系统-登录">
        <div className={style.main}>
          <div className={style.bar}>
            <img src={require("../../assets/Login.png")} alt="logo" />
            <div>
              <span className={style.title}>深圳市人大议案建议平台</span>
              <h1>运维管理系统</h1>
            </div>
          </div>
          <Form className={style.tab} layout="inline">
            <FormItem>
              {getFieldDecorator('userName', {
                rules: [{ required: true, message: '用户名不能为空' }],
              })(
                <Input
                  size="large"
                  prefix={<Icon type="user" style={{ fontSize: 13 }} />}
                  placeholder="请输入用户名" />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: '密码不能为空' }],
              })(
                <Input
                  size="large"
                  prefix={<Icon type="lock" style={{ fontSize: 13 }} />}
                  type="password"
                  placeholder="请输入密码"
                />
              )}
            </FormItem>
            <Form.Item>
              <Button type="primary" onClick={this.handleSubmit}>
                登录
            </Button>
            </Form.Item>
          </Form>
        </div>
      </DocumentTitle>
    );
  }
}

export default Login;
