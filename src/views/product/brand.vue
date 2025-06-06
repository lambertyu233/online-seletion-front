<template>
    <div class="tools-div">
        <el-button type="success" size="small" @click="addShow">添 加</el-button>
    </div>

    <el-table :data="list" style="width: 100%">
        <el-table-column prop="name" label="品牌名称" />
        <el-table-column prop="logo" label="品牌图标" #default="scope">
            <img :src="getMinioUrl() + scope.row.logo" width="50" />
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column label="操作" align="center" width="200" #default="scope">
            <el-button type="primary" size="small" @click="editShow(scope.row)">
                修改
            </el-button>
            <el-button type="danger" size="small" @click="remove(scope.row.id)">
                删除
            </el-button>
        </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" title="添加或修改" width="30%">
        <el-form label-width="120px">
            <el-form-item label="品牌名称">
                <el-input v-model="brand.name" />
            </el-form-item>
            <el-form-item label="品牌图标">
                <el-upload class="avatar-uploader" :show-file-list="false" :headers="headers"
                    :http-request="customUpload">
                    <img v-if="brand.logo" :src="getMinioUrl() + brand.logo" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon">
                        <Plus />
                    </el-icon>
                </el-upload>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="saveOrUpdate">提交</el-button>
                <el-button @click="dialogVisible = false">取消</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>

    <el-pagination v-model:current-page="pageParams.page" v-model:page-size="pageParams.limit"
        :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next" :total="total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />

</template>

<script setup>
import { ref, onMounted } from 'vue'
import { GetBrandPageList, SaveBrand, UpdateBrandById, DeleteBrandById } from '@/api/brand.js'
import { FileUpload } from '@/api/fileUpload'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useApp } from '@/pinia/modules/app'
import { getMinioUrl } from '@/config/baseUrl'

// 定义表格数据模型
const list = ref([])

// 分页条数据模型
const total = ref(0)

//分页条数据模型
const pageParamsForm = {
    page: 1, // 页码
    limit: 10, // 每页记录数
}
const pageParams = ref(pageParamsForm)

// 钩子函数
onMounted(() => {
    fetchData()
})

//页面变化
const handleSizeChange = size => {
    pageParams.value.limit = size
    fetchData()
}
const handleCurrentChange = number => {
    pageParams.value.page = number
    fetchData()
}

// 分页查询
const fetchData = async () => {
    const { code, message, data } = await GetBrandPageList(pageParams.value.page, pageParams.value.limit)
    list.value = data.brandList
    total.value = data.pageTotal
}
////////////////添加
const headers = {
    // 从pinia中获取token，在进行文件上传的时候将token设置到请求头中
    token: useApp().authorization.token
}
// 定义提交表单数据模型
const defaultForm = {
    id: '',
    name: '',
    logo: ""
}
const brand = ref(defaultForm)
const dialogVisible = ref(false)

// 显示添加品牌表单
const addShow = () => {
    brand.value = {}
    dialogVisible.value = true
}

//进入修改
const editShow = row => {
    brand.value = row
    dialogVisible.value = true
}

// 自定义上传逻辑
const customUpload = async (options) => {
    const { file } = options // 获取用户选择的文件
    try {
        const res = await FileUpload(file) // 调用统一的 API 接口
        // 假设后端返回 { code: 200, data: { url: '...' } }
        if (res.code === 200) {
            brand.value.logo = res.data // 更新品牌 logo 地址
            ElMessage.success('上传成功')
        }
    } catch (error) {
        ElMessage.error('上传失败')
    }
}

// 保存数据
const saveOrUpdate = () => {
    if (!brand.value.id) {
        saveData()
    } else {
        updateData()
    }
}

// 新增
const saveData = async () => {
    await SaveBrand(brand.value)
    dialogVisible.value = false
    ElMessage.success('操作成功')
    fetchData()
}

// 修改
const updateData = async () => {
    await UpdateBrandById(brand.value)
    dialogVisible.value = false
    ElMessage.success('操作成功')
    fetchData()
}

//删除
const remove = async id => {
    ElMessageBox.confirm('此操作将永久删除该记录, 是否继续?', 'Warning', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    })
        .then(async () => {
            await DeleteBrandById(id)
            ElMessage.success('删除成功')
            fetchData()
        })
}
</script>

<style scoped>
.tools-div {
    margin: 10px 0;
    padding: 10px;
    border: 1px solid #ebeef5;
    border-radius: 3px;
    background-color: #fff;
}

.avatar-uploader .avatar {
    width: 200px;
    height: 150px;
    display: block;
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 50px;
    height: 50px;
    text-align: center;
}
</style>