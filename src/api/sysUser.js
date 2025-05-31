import request from '@/utils/request'

const base_api = '/admin/system/sysUser'
// 分页查询角色数据
export const GetSysUserListByPage = (current , limit , queryDto) => {
    return request({
        //``模板字符串
        url: `${base_api}/findByPage/${current}/${limit}`,
        method: 'post',
        //接口@RequestBody 前端 data ：名称，以json格式传输
        //接口没有注解，前端params：名称
        data: queryDto,
    })
}

// 添加角色请求方法
export const SaveSysUser = (sysUser) => {
    return request({
        url: `${base_api}/saveSysUser`,
        method: 'post',
        data: sysUser,
    })
}

// 保存修改
export const UpdateSysUser = (sysUser) => {
    return request({
        url: `${base_api}/updateSysUser`,
        method: 'put',
        data: sysUser,
    })
}

// 角色删除
export const DeleteSysUser = (userId) => {
    return request({
        url: `${base_api}/deleteById/${userId}`,
        method: 'delete',
    })
}

// 给用户分配角色请求
export const DoAssignRoleToUser = (assginRoleVo) => {
    return request({
        url: `${base_api}/doAssign`,
        method: 'post',
        data: assginRoleVo
    })
}
