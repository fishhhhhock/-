<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix header-box">
        <span>文章分类</span>
        <el-button type="primary" size="mini" @click="addVisiblebtn">添加分类</el-button>
      </div>
      <el-table style="width: 100%" :data="cateList" border stripe>
        <el-table-column label="序号" type="index" width="100"></el-table-column>
        <el-table-column label="分类名称" prop="cate_name"></el-table-column>
        <el-table-column label="分类别名" prop="cate_alias"></el-table-column>
        <el-table-column label="操作">
            <template v-slot="scope">
                <el-button type="primary" size="mini" @click="updateBtn(scope.row)">修改</el-button>
                <el-button type="danger" size="mini" @click="deleteBtn(scope.row)">删除</el-button>
            </template>

        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加分类的对话框 -->
    <el-dialog title="添加文章分类" :visible.sync="addVisible" width="35%"  @closed="closeDialogbtn">
        <!-- 添加的表单 -->
        <el-form :model="addForm" :rules="addRules" ref="addRef" label-width="80px">
          <el-form-item label="分类名称" prop="cate_name">
            <el-input v-model="addForm.cate_name" minlength="1" maxlength="10"></el-input>
          </el-form-item>
          <el-form-item label="分类别名" prop="cate_alias">
            <el-input v-model="addForm.cate_alias" minlength="1" maxlength="15"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button size="mini" @click="closeVisiblebtn">取 消</el-button>
            <el-button size="mini" type="primary" @click="addArtcateBtn">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import { getArtcateListAPI, addArtcateAPI, updateArtInfoAPI, delArtInfoAPI } from '@/api'
export default {
  name: 'ArtCate',
  data () {
    return {
      cateList: [],
      addVisible: false, // 添加分类-对话框是否显示
      addForm: { // 添加表单的数据对象
        cate_name: '',
        cate_alias: ''
      },
      editId: '',
      isEdit: '',
      addRules: { // 添加表单的验证规则
        cate_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { pattern: /^\S{1,10}$/, message: '分类名必须是1-10位的非空字符', trigger: 'blur' }
        ],
        cate_alias: [
          { required: true, message: '请输入分类别名', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9]{1,15}$/, message: '分类别名必须是1-15位的字母数字', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.getArtCateList()
  },
  methods: {
    // 获取文章列表信息
    async getArtCateList () {
      const { data: res } = await getArtcateListAPI()
      //   console.log(res)
      this.cateList = res.data
    },
    // 显示添加分类对话框
    addVisiblebtn () {
      this.addVisible = true
    },
    // 关闭添加分类对话框
    closeVisiblebtn () {
      this.addVisible = false
    },
    // 对话框关闭时的回调
    closeDialogbtn () {
      this.$refs.addRef.resetFields()
    },
    // 点击添加按键时的回调=>保存文章分类
    addArtcateBtn () {
      this.$refs.addRef.validate(async valid => {
        if (!valid) return false
        if (!this.isEdit) {
          // 表示新增文章
          const { data: res } = await addArtcateAPI(this.addForm)
          // console.log(res)
          if (res.code !== 0) return this.$message.error(res.message)
          this.$message.success(res.message)
          // console.log(this.cateList)
        } else {
          // 更新文章
        //   添加api必填参数id
        //   this.addForm.id = this.editId
          const { data: res } = await updateArtInfoAPI({ id: this.editId, ...this.addForm })
          if (res.code !== 0) return this.$message.error(res.message)
          this.$message.success(res.message)
        }
        this.addVisible = false
        this.getArtCateList()
      })
    },
    // 更改文章信息
    updateBtn (obj) {
    //   console.log(obj)
      this.editId = obj.id // 保存要编辑的文章分类ID
      this.isEdit = true // 设置编辑状态
      this.addVisible = true
      // 让el-dialog第一次挂载el-form时，先用addForm空字符串初始值绑定到内部，后续用作resetFields重置
      //   所以让真实DOM先创建并在内部绑定好“复制”好初始值

      //   需要等真实DOM更新绑定好后再操作数据回
      //   我们给v-model对象赋值只是影响当前显示的值，不会影响到resetFields复制的初始值
      this.$nextTick(() => {
        this.addForm.cate_name = obj.cate_name
        this.addForm.cate_alias = obj.cate_alias
      })
    },
    // 删除文章
    async deleteBtn (obj) {
      const { data: res } = await delArtInfoAPI(obj.id)
      //   console.log(res)
      if (res.code !== 0) return this.$message.error(res.message)
      this.$message.success(res.message)
      this.getArtCateList()
    }

  }
}
</script>

<style lang="less" scoped>
.header-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
