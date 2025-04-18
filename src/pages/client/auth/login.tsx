import { App, Button, Divider, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
import './login.scss';
import { useState } from "react";
import type { FormProps } from "antd";
import { loginAPI } from "@/services/api";

type FieldType = {
    username: string;
    password: string;
};

const Login = () => {
    const navigate = useNavigate();
    const { message, notification } = App.useApp();
    const [isSubmit, setIsSubmit] = useState(false);

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsSubmit(true);
        const {username, password} = values;

        const res = await loginAPI(username, password);
        if(res?.data) {
            localStorage.setItem('access_token', res.data.access_token)
            message.success("Đăng nhập tài khoản thành công.")
            navigate("/")
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                description:
                    res.message && Array.isArray(res.message) ? res.message[0]: res.message,
                duration: 5
            })
        }
        setIsSubmit(false);
        navigate("/login")
    };

    return (
        <div className="login-page">
            <main className="main">
                <div className="container">
                    <section className="wrapper">
                        <div className="heading">
                            <h2 className="text text-large">Đăng nhập</h2>
                            <Divider />
                        </div>
                        <Form
                            name="form-login"
                            onFinish={onFinish}
                            autoComplete="off"
                        >
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Email"
                                name="username"
                                rules={[
                                    { required: true, message: 'Email không được để trống !' },
                                    { type: "email", message: 'Email không đúng định dạng !' }
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Mật khẩu"
                                name="password"
                                rules={[{ required: true, message: 'Mật khẩu không được để trống !' }]}
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={isSubmit}>
                                    Đăng nhập
                                </Button>
                            </Form.Item>
                            <Divider>Or</Divider>
                            <p className="text text-normal" style={{ textAlign: "center" }}>
                                Chưa có tài khoản ?
                                <a className="btn-primary" onClick={() => {navigate('/register')}}>
                                    &nbsp; Đăng ký
                                </a>
                            </p>
                        </Form>
                    </section>
                </div>
            </main>
        </div>
    )
}

export default Login