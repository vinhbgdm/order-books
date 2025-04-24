import { getUsersAPI } from '@/services/api';
import { DeleteTwoTone, EditTwoTone } from '@ant-design/icons';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components'
import { useRef, useState } from 'react';

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
                <a href="#">{entity._id}</a>
            )
        }
    },
    {
        title: 'Fullname',
        dataIndex: 'fulName',
    },
    {
        title: 'Email',
        dataIndex: 'email',
        copyable: true
    },
    {
        title: 'CreateAt',
        dataIndex: 'createAt',
    },
    {
        title: 'Action',
        hideInSearch: true,
        render() {
            return (
                <>
                    <EditTwoTone
                        twoToneColor='#f57800'
                        style={{ cursor: 'pointer', marginRight: 15 }}
                    />
                    <DeleteTwoTone
                        twoToneColor='#ff4d4f'
                        style={{ cursor: 'pointer', marginRight: 15 }}
                    />
                </>
            )
        },
    },
];

const TableUser = () => {
    const actionRef = useRef<ActionType>(null!);
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0
    });
    return (
        <>
            <ProTable<IUserTable>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort, filter) => {
                    console.log(sort, filter);
                    const res = await getUsersAPI(params?.current ?? 1, params.pageSize ?? 5);
                    if (res.data) {
                        setMeta(res.data.meta);
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
            >

            </ProTable >
        </>
    )
}

export default TableUser