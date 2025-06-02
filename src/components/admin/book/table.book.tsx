import { deleteUserAPI, getBooksAPI } from '@/services/api';
import { dateRangeValidate } from '@/services/helper';
import { DeleteTwoTone, EditTwoTone, ExportOutlined, PlusOutlined } from '@ant-design/icons';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components'
import { useRef, useState } from 'react';
import { App, Button, Popconfirm } from 'antd';
import { CSVLink } from 'react-csv';

type TSearch = {
    mainText: string;
    category: string;
    author: string;
    createAtRange: string;
    updateAt: string;
    updateAtRange: string;
    price: number
}

const TableBook = () => {
    const actionRef = useRef<ActionType>(null!);
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0
    });

    const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
    const [dataViewDetail, setDataViewDetail] = useState<IBookTable | null>(null);

    const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);

    const [currentDataTable, setCurrentDataTable] = useState<IBookTable[]>([]);

    const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
    const [dataUpdate, setDataUpdate] = useState<IBookTable | null>(null);

    const [isDeleteBook, setIsDeleteBook] = useState<boolean>(false);
    const { message, notification } = App.useApp();

    const handleDeleteUser = async (_id: string) => {
        setIsDeleteBook(true);
        const res = await deleteUserAPI(_id);
        if (res && res.data) {
            message.success('Xóa book thành công');
            refreshTable();
        } else {
            notification.error({
                message: 'Đã có lỗi xảy ra',
                description: res.message
            })
        }
        setIsDeleteBook(false)
    }

    const columns: ProColumns<IBookTable>[] = [
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
            title: 'Tên sách',
            dataIndex: 'mainText',
            sorter: true
        },
        {
            title: 'Thể loại',
            dataIndex: 'category',
            hideInSearch: true
        },
        {
            title: 'Tác giả',
            dataIndex: 'author',
            sorter: true
        },
        {
            title: 'Giá tiền',
            dataIndex: 'price',
            sorter: true,
            hideInSearch: true,
            render(dom, entity, index, action, schema) {
                return (
                    <>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(entity.price)}
                    </>
                )
            }
        },
        {
            title: 'Ngày cập nhật',
            dataIndex: 'updateAt',
            valueType: 'dateRange',
            hideInSearch: true,
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
                            title={"Xác nhận xóa book"}
                            description={"Bạn có chắn chắn muốn xóa book này ?"}
                            onConfirm={() => handleDeleteUser(entity._id)}
                            okText="Xác nhận"
                            cancelText="Hủy"
                            okButtonProps={{ loading: isDeleteBook }}
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
            <ProTable<IBookTable, TSearch>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort, filter) => {
                    console.log(params, sort, filter, sort.createAt);
                    let query = "";
                    if (params) {
                        query += `current=${params.current}&pageSize=${params.pageSize}`
                        if (params.mainText) {
                            query += `&mainText=/${params.mainText}/i`
                        }
                        if (params.author) {
                            query += `&fullName=/${params.author}/i`
                        }

                        const createDateRange = dateRangeValidate(params.createAtRange);
                        if (createDateRange) {
                            query += `&createAt>=${createDateRange[0]}&createAt<=${createDateRange[1]}`
                        }
                    }

                    if (sort && sort.createAt) {
                        query += `&sort=${sort.createAt === 'ascend' ? 'createAt' : '-createAt'}`
                    } else query += `&sort=-createAt`;

                    if (sort && sort.mainText) {
                        query += `&sort=${sort.mainText === 'ascend' ? 'mainText' : '-mainText'}`
                    }

                    if (sort && sort.author) {
                        query += `&sort=${sort.author === 'ascend' ? 'author' : '-author'}`
                    }

                    if (sort && sort.price) {
                        query += `&sort=${sort.price === 'ascend' ? 'price' : '-price'}`
                    }

                    if (sort && sort.mainText) {
                        query += `&sort=${sort.createAt === 'ascend' ? 'mainText' : '-mainText'}`
                    }

                    const res = await getBooksAPI(query);
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
                headerTitle='Table book'
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
        </>
    )
}

export default TableBook