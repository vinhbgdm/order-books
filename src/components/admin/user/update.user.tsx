import { updateUserAPI } from "@/services/api";
import { App, Divider, Form, FormProps, Input, Modal } from "antd"
import { useEffect, useState } from "react";

interface IProps {
    openModalUpdate: boolean;
    setOpenModalUpdate: (v: boolean) => void;
    refreshTable: () => void;
    setDataUpdate: (v: IUserTable | null) => void;
    dataUpdate: IUserTable | null;
}

type FieldType = {
    _id: string;
    email: string;
    fullName: string;
    phone: string;
};

const UpdateUser = (props: IProps) => {
    const { openModalUpdate, setOpenModalUpdate, refreshTable, dataUpdate, setDataUpdate } = props;
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const { message, notification } = App.useApp();

    const [form] = Form.useForm();

    useEffect(() => {
        if (dataUpdate) {
            form.setFieldsValue({
                _id: dataUpdate._id,
                fullName: dataUpdate.fullName,
                email: dataUpdate.email,
                phone: dataUpdate.phone
            })
        }
    }, [dataUpdate])

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsSubmit(true);
        const { _id, fullName, phone } = values;

        const res = await updateUserAPI(_id, fullName, phone);
        if (res && res.data) {
            message.success("Cập nhật user thành công.")
            form.resetFields();
            setOpenModalUpdate(false);
            setDataUpdate(null);
            refreshTable();
        } else {
            notification.error({
                message: 'Đã có lỗi xảy ra',
                description: res.message
            })
        }
        setIsSubmit(false);
    };

    return (
        <>
            <Modal
                title="Cập nhật người dùng"
                open={openModalUpdate}
                onOk={() => { form.submit() }}
                onCancel={() => {
                    setOpenModalUpdate(false);
                    setDataUpdate(null);
                    form.resetFields();
                }}
                okText={"Cập nhật"}
                cancelText={"Hủy"}
                confirmLoading={isSubmit}
            >
                <Divider />
                <Form
                    form={form}
                    name="basic"
                    style={{ maxWidth: 600 }}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item<FieldType>
                        hidden
                        labelCol={{ span: 24 }}
                        label="_id"
                        name="_id"
                        rules={[{ required: true, message: 'Vui lòng nhập _id !' }]}
                    >
                        <Input disabled />
                    </Form.Item>

                    <Form.Item<FieldType>
                        labelCol={{ span: 24 }}
                        label="Họ tên"
                        name="fullName"
                        rules={[{ required: true, message: 'Họ tên không được để trống !' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item<FieldType>
                        labelCol={{ span: 24 }}
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Email không được để trống !' },
                            { type: "email", message: 'Email không đúng định dạng !' }
                        ]}
                    >
                        <Input disabled />
                    </Form.Item>

                    <Form.Item<FieldType>
                        labelCol={{ span: 24 }}
                        label="Số điện thoại"
                        name="phone"
                        rules={[{ required: true, message: 'Số điện thoại không được để trống !' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default UpdateUser;