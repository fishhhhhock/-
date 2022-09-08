<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>文章列表</span>
      </div>
      <!-- 搜索区域 -->
      <div class="search-box">
        <el-form :inline="true" :model="q">
          <el-form-item label="文章分类">
            <el-select
              v-model="q.cate_id"
              placeholder="请选择分类"
              size="small"
            >
              <el-option
                v-for="obj in cateList"
                :key="obj.id"
                :label="obj.cate_name"
                :value="obj.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发布状态" style="margin-left: 15px">
            <el-select v-model="q.state" placeholder="请选择状态" size="small">
              <el-option label="已发布" value="已发布"></el-option>
              <el-option label="草稿" value="草稿"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="initArtListBtn"
              >筛选</el-button
            >
            <el-button type="info" size="small" @click="resetListBtn"
              >重置</el-button
            >
          </el-form-item>
        </el-form>
        <!-- 发表文章的按钮 -->
        <el-button
          type="primary"
          size="small"
          class="btn-pub"
          @click="showpubDialogBtn"
          >发表文章</el-button
        >

        <!-- 发表文章的 Dialog 对话框 -->
        <el-dialog
          title="发表文章"
          :visible.sync="pubDialogVisible"
          fullscreen
          :before-close="handleClose"
          @close="closeDialog"
        >
          <!-- 发布文章的对话框 -->
          <el-form
            :model="pubForm"
            :rules="pubFormRules"
            ref="pubFormRef"
            label-width="100px"
          >
            <el-form-item label="文章标题" prop="title">
              <el-input
                v-model="pubForm.title"
                placeholder="请输入标题"
              ></el-input>
            </el-form-item>
            <el-form-item label="文章分类" prop="cate_id">
              <el-select
                v-model="pubForm.cate_id"
                placeholder="请选择分类"
                style="width: 100%"
              >
                <el-option
                  v-for="obj in cateList"
                  :key="obj.id"
                  :label="obj.cate_name"
                  :value="obj.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="文章内容" prop="content">
              <quill-editor
                v-model="pubForm.content"
                @blur="contentChange"
              ></quill-editor>
            </el-form-item>
            <el-form-item label="文章封面" prop="cover_img">
              <!-- 用来显示封面的图片 -->
              <img
                src="../../assets/images/cover.jpg"
                alt=""
                class="cover-img"
                ref="imgRef"
              />
              <br />
              <!-- 文件选择框，默认被隐藏 -->
              <input
                type="file"
                style="display: none"
                accept="image/*"
                ref="iptFileRef"
                @change="changeCover"
              />
              <!-- 选择封面的按钮 -->
              <el-button type="text" @click="showCoverBtn"
                >+ 选择封面</el-button
              >
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="pubArticleFn('已发布')"
                >发布</el-button
              >
              <el-button type="info" @click="pubArticleFn('草稿')"
                >存为草稿</el-button
              >
            </el-form-item>
          </el-form>
        </el-dialog>
      </div>
      <!-- 文章表格区域 -->
      <el-table :data="artList" style="width: 100%" border stripe>
        <el-table-column label="文章标题" prop="title">
          <template v-slot="scope">
            <el-link type="primary" @click="showArtDetail(scope.row.id)">{{ scope.row.title }}</el-link>
          </template>

        </el-table-column>
        <el-table-column label="分类" prop="cate_name"></el-table-column>
        <el-table-column label="发表时间" prop="pub_date">
          <template v-slot="scope">
            <span>{{ $formatDate(scope.row.pub_date) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="state"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="{ row }">
            <el-button type="danger" size="mini" @click="removeFn(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 查看文章详情的对话框 -->
      <el-dialog title="文章预览" :visible.sync="detailVisible" width="80%">
        <h1 class="title">{{artDetail.title}}</h1>

        <div class="info">
          <span>作者：{{artDetail.nickname || artDetail.username}}</span>
          <span>发布时间：{{$formatDate(artDetail.pub_date)}}</span>
          <span>所属分类：{{artDetail.cate_name}}</span>
          <span>状态：{{artDetail.state}}</span>
        </div>

        <!-- 分割线 -->
        <el-divider></el-divider>

        <!-- 文章的封面 -->
        <img v-if="artDetail.cover_img" :src="baseURL + artDetail.cover_img" alt="" />

        <!-- 文章的详情 -->
        <div v-html="artDetail.content" class="detail-box"></div>
      </el-dialog>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChangeFn"
        @current-change="handleCurrentChangeFn"
        :current-page.sync="q.pagenum"
        :page-sizes="[2, 3, 5, 10]"
        :page-size.sync="q.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getArtcateListAPI, uploadArticleAPI, getArticleListAPI, getArtDetailAPI, removeArtAPI } from '@/api'
import { baseURL } from '@/utils/request'
// 导入默认的封面图片
import defaultImg from '@/assets/images/cover.jpg'
export default {
  name: 'ArtList',
  data () {
    return {
      // 查询参数对象
      q: {
        pagenum: 1,
        pagesize: 5, // 当前页面需要的数据条数
        cate_id: '',
        state: ''
      },
      pubDialogVisible: false, // 控制发表文章对话框的显示与隐藏
      pubForm: {
        // 表单的数据对象
        title: '',
        cate_id: '',
        content: '',
        cover_img: '',
        state: ''
      },
      cateList: [], // 文章分类
      artList: [], // 文章列表数据
      total: 0, // 总数据条数
      detailVisible: false, // 控制文章详情对话框的显示/隐藏
      artDetail: [],
      baseURL,
      pubFormRules: {
        // 表单的验证规则对象
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          {
            min: 1,
            max: 30,
            message: '文章标题的长度为1-30个字符',
            trigger: 'blur'
          }
        ],
        cate_id: [
          { required: true, message: '请选择文章分类', trigger: 'change' }
        ],
        content: [
          { required: true, message: '请输入文章内容', trigger: 'blur' }
        ],
        cover_img: [
          { required: true, message: '请选择封面图片', trigger: 'change' }
        ]
      }
    }
  },
  created () {
    this.initCateList()
    this.initArticleList()
  },
  methods: {
    // 点击按钮显示对话框
    showpubDialogBtn () {
      this.pubDialogVisible = true
    },
    //   对话框关闭前的回调
    async handleClose (done) {
      // 询问是否确定关闭对话框
      const confirmResult = await this.$confirm(
        '此操作将导致文章信息丢失，是否继续？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err)
      //   取消了关闭-阻止住，什么都不干
      if (confirmResult === 'cancel') return
      //   确认关闭
      done()
    },
    // 对话框关闭时的回调--清空表单
    closeDialog () {
      this.$refs.pubFormRef.resetFields()
      this.$refs.imgRef.setAttribute('src', defaultImg)
    },
    // 初始化文章分类列表数据
    async initCateList () {
      const { data: res } = await getArtcateListAPI()
      //   console.log(res)
      this.cateList = res.data
    },
    // 初始化文章列表
    async initArticleList () {
      const { data: res } = await getArticleListAPI(this.q)
      this.artList = res.data
      this.total = res.total
    },
    // 点击选择封面让文件选择窗口出现
    showCoverBtn () {
      this.$refs.iptFileRef.click()
    },
    // 封面改变拿取图片路径
    changeCover (e) {
      // 获取用户的文件列表
      const files = e.target.files
      if (files.length === 0) {
        // 用户没有选择封面
        this.pubForm.cover_img = null
        this.$refs.imgRef.setAttribute('src', defaultImg)
      } else {
        this.pubForm.cover_img = files[0]
        const url = URL.createObjectURL(files[0])
        this.$refs.imgRef.setAttribute('src', url)
      }
      // 让表单单独校验封面的规则
      this.$refs.pubFormRef.validateField('cover_img')
    },
    // 点击保存、存为草稿按钮改变存储文章状态
    pubArticleFn (str) {
      this.pubForm.state = str
      // console.log(this.pubForm)
      this.$refs.pubFormRef.validate(async (valid) => {
        if (!valid) return false
        // console.log(this.pubForm)
        // 创建FormData对象:保存表单数据对象的容器，h5新增专门装文件内容
        const fd = new FormData()
        // 追加数据
        fd.append('title', this.pubForm.title)
        fd.append('cate_id', this.pubForm.cate_id)
        fd.append('content', this.pubForm.content)
        fd.append('cover_img', this.pubForm.cover_img)
        fd.append('state', this.pubForm.state)
        const { data: res } = await uploadArticleAPI(fd)
        if (res.code !== 0) this.$message.error(res.message)
        this.$message.success(res.message)
        this.pubDialogVisible = false
        this.initArticleList()
      })
    },
    // 富文本编辑器内容的校验
    contentChange () {
      this.$refs.pubFormRef.validateField('content')
    },
    // pageSize发生了变化
    handleSizeChangeFn (newSize) {
      // 为pagesize赋值
      this.q.pagesize = newSize
      // 默认显示第一页数据
      this.q.pagenum = 1
      // 重新发起请求
      this.initArticleList()
    },
    // 当前页码改变时触发
    // 当前要看的第几页，页数:nowpage
    handleCurrentChangeFn (nowPage) {
      this.q.pagenum = nowPage
      this.initArticleList()
    },
    // 筛选按钮
    initArtListBtn () {
      this.q.pagenum = 1
      this.q.pagesize = 2
      this.initArticleList()
    },
    // 重置按钮
    resetListBtn () {
      // 1. 重置查询参数对象
      this.q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
      }
      // 2. 重新发起请求
      this.initArticleList()
    },
    async showArtDetail (artid) {
      this.detailVisible = true
      const { data: res } = await getArtDetailAPI(artid)
      // console.log(res)
      this.artDetail = res.data
    },
    async removeFn (artid) {
      const { data: res } = await removeArtAPI(artid)
      if (res.code !== 0) this.$message.error(res.message)
      this.$message.success(res.message)
      // 在调用接口以后，刷新数组列表之前，对页码进行处理
      if (this.artList.length === 1) {
        if (this.q.pagenum > 1) { // 保证pagenum最小为1
          this.q.pagenum--
        }
      }
      this.initArticleList()
    }
  }
}
</script>

<style lang="less" scoped>
.search-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  .btn-pub {
    margin-top: 5px;
  }
}
::v-deep .ql-editor {
  min-height: 300px;
}
.el-pagination {
  margin-top: 15px;
}
.title {
  font-size: 24px;
  text-align: center;
  font-weight: normal;
  color: #000;
  margin: 0 0 10px 0;
}

.info {
  font-size: 12px;
  span {
    margin-right: 20px;
  }
}

// 修改 dialog 内部元素的样式，需要添加样式穿透
::v-deep .detail-box {
  img {
    width: 500px;
  }
}
</style>
