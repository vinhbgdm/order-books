import { deleteUserAPI, getUsersAPI } from '@/services/api';
import { dateRangeValidate } from '@/services/helper';
import { CloudUploadOutlined, DeleteTwoTone, EditTwoTone, ExportOutlined, PlusOutlined } from '@ant-design/icons';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components'
import { useRef, useState } from 'react';
import DetailUser from './detail.user';
import { App, Button, Popconfirm } from 'antd';
import CreateUser from './create.user';
import ImportUser from './import.user';
import { CSVLink } from 'react-csv';
import UpdateUser from './update.user';
import dayjs from 'dayjs';

type TSearch = {
    fullName: string;
    email: string;
    createAt: string;
    createAtRange: string;
}

const TableUser = () => {
    const actionRef = useRef<ActionType>(null!);
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0
    });

    const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
    const [dataViewDetail, setDataViewDetail] = useState<IUserTable | null>(null);
    const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);
    const [openModalImport, setOpenModalImport] = useState<boolean>(false);

    const [currentDataTable, setCurrentDataTable] = useState<IUserTable[]>([]);

    const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
    const [dataUpdate, setDataUpdate] = useState<IUserTable | null>(null);

    const [isDeleteUser, setIsDeleteUser] = useState<boolean>(false);
    const { message, notification } = App.useApp();

    const handleDeleteUser = async (_id: string) => {
        setIsDeleteUser(true);
        const res = await deleteUserAPI(_id);
        if (res && res.data) {
            message.success('Xóa user thành công');
            refreshTable();
        } else {
            notification.error({
                message: 'Đã có lỗi xảy ra',
                description: res.message
            })
        }
        setIsDeleteUser(false)
    }

    const columns: ProColumns<IUserTable>[] = [
        {
            dataIndex: 'index',
            valueType: 'indexBorder',
            width: 48,
        },
        {
            title: 'ID',
            dataIndex: '_id',
            hideInSearch: true,
            render(dom, entity, index, action, schema) {
                return (
                    <a href="#" onClick={() => { setDataViewDetail(entity); setOpenViewDetail(true) }}>{entity._id}</a>
                )
            }
        },
        {
            title: 'Fullname',
            dataIndex: 'fullName',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            copyable: true
        },
        {
            title: 'CreateAt',
            dataIndex: 'createAt',
            valueType: 'date',
            sorter: true,
            hideInSearch: true,
            render(dom, entity, index, action, schema) {
                return (
                    <>
                        {dayjs(entity.createAt).format("DD-MM-YYYY")}
                    </>
                )
            }
        },
        {
            title: 'CreateAt',
            dataIndex: 'createAtRange',
            valueType: 'dateRange',
            hideInTable: true,
        },
        {
            title: 'Action',
            hideInSearch: true,
            render(dom, entity, index, action, schema) {
                return (
                    <>
                        <EditTwoTone
                            twoToneColor='#f57800'
                            style={{ cursor: 'pointer', marginRight: 15 }}
                            onClick={() => {
                                setDataUpdate(entity);
                                setOpenModalUpdate(true);
                            }}
                        />
                        <Popconfirm
                            placement='leftTop'
                            title={"Xác nhận xóa user"}
                            description={"Bạn có chắn chắn muốn xóa user này ?"}
                            onConfirm={() => handleDeleteUser(entity._id)}
                            okText="Xác nhận"
                            cancelText="Hủy"
                            okButtonProps={{ loading: isDeleteUser }}
                        >
                            <DeleteTwoTone
                                twoToneColor='#ff4d4f'
                                style={{ cursor: 'pointer', marginRight: 15 }}
                            />
                        </Popconfirm>
                    </>
                )
            },
        },
    ];

    const refreshTable = () => {
        actionRef.current?.reload();
    }

    return (
        <>
            <ProTable<IUserTable, TSearch>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort, filter) => {
                    console.log(params, sort, filter, sort.createAt);

                    let query = "";
                    if (params) {
                        query += `current=${params.current}&pageSize=${params.pageSize}`
                        if (params.email) {
                            query += `&email=/${params.email}/i`
                        }
                        if (params.fullName) {
                            query += `&fullName=/${params.fullName}/i`
                        }

                        const createDateRange = dateRangeValidate(params.createAtRange);
                        if (createDateRange) {
                            query += `&createAt>=${createDateRange[0]}&createAt<=${createDateRange[1]}`
                        }
                    }

                    //default

                    if (sort && sort.createAt) {
                        query += `&sort=${sort.createAt === 'ascend' ? 'createAt' : '-createAt'}`
                    } else query += `&sort=-createAt`;

                    const res = await getUsersAPI(query);
                    if (res.data) {
                        setMeta(res.data.meta);
                        setCurrentDataTable(res.data?.result ?? []);
                    }
                    return {
                        data: res.data?.result,
                        page: 1,
                        success: true,
                        total: res.data?.meta.total
                    }
                }}
                rowKey='_id'
                pagination={{
                    current: meta.current,
                    pageSize: meta.pageSize,
                    showSizeChanger: true,
                    total: meta.total,
                    showTotal: (total, range) => { return (<div>{range[0]}-{range[1]} in {total} rows</div>) }
                }}
                headerTitle='Table user'
                toolBarRender={() => [
                    <Button
                        icon={<ExportOutlined />}
                        type="primary"
                    >
                        <CSVLink data={currentDataTable} filename='export-user.csv'>
                            Export
                        </CSVLink>
                    </Button>,
                    <Button
                        icon={<CloudUploadOutlined />}
                        onClick={() => {
                            setOpenModalImport(true);
                        }}
                        type="primary"
                    >
                        Import
                    </Button>,
                    <Button
                        key="button"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setOpenModalCreate(true);
                        }}
                        type="primary"
                    >
                        Add new
                    </Button>
                ]}
            />
            <DetailUser
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
                setDataViewDetail={setDataViewDetail}
            />

            <CreateUser
                openModalCreate={openModalCreate}
                setOpenModalCreate={setOpenModalCreate}
                refreshTable={refreshTable}
            />

            <ImportUser
                openModalImport={openModalImport}
                setOpenModalImport={setOpenModalImport}
                refreshTable={refreshTable}
            />

            <UpdateUser
                openModalUpdate={openModalUpdate}
                setOpenModalUpdate={setOpenModalUpdate}
                refreshTable={refreshTable}
                setDataUpdate={setDataUpdate}
                dataUpdate={dataUpdate}
            />
        </>
    )
}

export default TableUser