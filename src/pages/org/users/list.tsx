import SearchForm from '@/components/SearchForm';
import { useUserList } from '@/services/user/api';
import { UserInputType, UserListResponse } from '@/services/user/api.type';
import { useUserStore } from '@/store/userStore';
import { useAntdTable } from 'ahooks';
import { Form, Table, Pagination } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { listcolumns } from './constant';

function Users() {
    const { userInfo, userToken } = useUserStore()
    const [form] = Form.useForm()
    const [userParams, setUserParams] = useState<UserInputType>();
    const { data } = useUserList(userParams);

       const onOpenFormHandler = (record?: UserListResponse) => {
        console.log(record);
        
    };

      // 删除处理器，点击删除按钮触发API调用
    const onDelHandler = async (ids: string[]) => {
        console.log(ids);
        
    };

    // 分页改变处理
    const onPageChange = (page: number, pageSize: number) => {
        const values: UserInputType = { page, limit: pageSize };
        debugger
        setUserParams(values);
    };

    const mock = useMemo(() => {
      let res: any[] = []
      for(let i = 0; i < 10; i++) {
        res.push(data?.items[0])
      }
      return res
    }, [data?.items])

    
    return (
      <div className='py-[12px]'>
        <SearchForm
         defaultExpand={false}
          formItems={[
            {
              type: "input",
              name: "name",
              label: "名字"
            },
            {
              type: "select",
              name: "isActive",
              label: "是否激活"
            },
             {
              type: "datePicker",
              name: "name",
              label: "创建时间"
            },
             {
              type: "input",
              name: "name",
              label: "名字"
            },
            {
              type: "select",
              name: "isActive",
              label: "是否激活"
            },
             {
              type: "datePicker",
              name: "name",
              label: "创建时间"
            },
             {
              type: "input",
              name: "name",
              label: "名字"
            },
            {
              type: "select",
              name: "isActive",
              label: "是否激活"
            },
          
          ]}
        />
        <div className='mx-[24px]'>
        <Table
          bordered={false}
          columns={listcolumns({
                    onOpenFormHandler,
                    onDelHandler,
                  })}
          dataSource={data?.items}
          // dataSource={mock}
          pagination={false}
          scroll={{ x: 'max-content' }}
        />
          {/* 自定义分页 */}
        <Pagination
            className='table-custom-pagination'
            showSizeChanger
            onChange={onPageChange}
            total={data?.meta.totalItems}
            showTotal={(total: number) => `共 ${total} 条`}
            current={data?.meta.currentPage}
        />
        </div>
      </div>
    );
}

export default Users;
