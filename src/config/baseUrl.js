// 获取 baseURL 的函数
export const getBaseUrl = () => localStorage.getItem('baseUrl') || 'http://192.168.200.129:8500';
export const getMinioUrl = () => 'http://192.168.200.129:9000/spzx-bucket/';