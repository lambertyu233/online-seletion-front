import request from '@/utils/request'

// 上传文件
export const FileUpload = (file) => {
    const formData = new FormData()
    formData.append('file', file) // 后端接收的参数名可能是 'file' 或其他，需与后端一致

    return request({
        url: '/admin/system/fileUpload', // 使用相对路径，baseURL 会自动拼接
        method: 'post',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data', // 必须设置，否则文件上传失败
        },
    })
}