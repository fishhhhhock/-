// 定义接口方法
// axios请求库
import request from '@/utils/request'
// 引入store对象
// import store from '@/store'

export const registerAPI = ({ username, password, repassword }) => {
  // 如果URL以http开头会忽略baseURL，axios直接请求此地址
  // 原地是一个Promise对象（内部包含原生ajax请求）
  // return这个Promise对象到逻辑页面，去那边对Promise对象提取结果

  //   导出接口方法，在逻辑页面引入调用
  return request({
    url: '/api/reg',
    method: 'POST',
    data: {
      username,
      password,
      repassword
    }
  })
}

export const loginAPI = ({ username, password }) => {
  return request({
    url: '/api/login',
    method: 'POST',
    data: {
      username,
      password
    }
  })
}

/**
 * 获取-用户信息
 * @returns Promise对象
 */
export const getUserInfoAPI = () => {
  return request({
    url: '/my/userinfo'
    // headers: {
    // Authorization: store.state.token
    // }
  })
}

/**
 * 获取-侧边栏信息
 * @returns Promise对象
 */
export const getAsideInfoAPI = () => {
  return request({
    url: '/my/menus'
    // headers: {
    // Authorization: store.state.token
    // }
  })
}

/**
 * 更新用户信息
 * @param {*} param0 id,email,nickname,user_pic,username
 * @returns Promise对象
 */
export const updateUserInfoAPI = ({ id, email, nickname, user_pic, username }) => {
  return request({
    url: '/my/userinfo',
    method: 'PUT',
    data: {
      id,
      email,
      nickname,
      user_pic,
      username
    }
  })
}

/**
 * 更新用户头像
 * @param {*} avatar 头像图片base64字符串
 * @returns Promise对象
 */
export const updateUseravaAPI = avatar => {
  return request({
    url: '/my/update/avatar',
    method: 'PATCH',
    data: {
      avatar
    }
  })
}

/**
 * 修改密码
 * @param {*} param0 old_pwd, new_pwd, re_pwd
 * @returns Promise对象
 */
export const updatePwd = ({ old_pwd, new_pwd, re_pwd }) => {
  return request({
    url: '/my/updatepwd',
    method: 'PATCH',
    data: {
      old_pwd,
      new_pwd,
      re_pwd
    }
  })
}

/**
 * 获取文章分类
 * @returns Promise对象
 */
export const getArtcateListAPI = () => {
  return request({
    url: '/my/cate/list'
  })
}

/**
 * 增加文章分类
 * @param {*} param0 cate_name书籍名字, cate_alias书籍编号
 * @returns Promise对象
 */
export const addArtcateAPI = ({ cate_name, cate_alias }) => {
  return request({
    url: '/my/cate/add',
    method: 'POST',
    data: {
      cate_name,
      cate_alias
    }
  })
}

/**
 * 更新修改的文章分类信息
 * @param {*} param0 id:文章id name:文章名字 alias:文章别名
 * @returns Promise对象
 */
export const updateArtInfoAPI = ({ id, cate_name, cate_alias }) => {
  return request({
    url: '/my/cate/info',
    method: 'PUT',
    data: {
      id,
      cate_name,
      cate_alias
    }
  })
}

/**
 * 删除文章分类
 * @param {*} id 文章id
 * @returns Promise对象
 */
export const delArtInfoAPI = (id) => {
  return request({
    url: '/my/cate/del',
    method: 'DELETE',
    params: {
      id
    }
  })
}

/**
 * 发布文章
 * @param {*} fd data表单数据
 * @returns Promise对象
 */
export const uploadArticleAPI = (fd) => {
  return request({
    url: '/my/article/add',
    method: 'POST',
    data: fd// 参数需要表单对象，不能直接使用大括号，axios会把大括号内数据转化为JSON对象
  })
}

/**
 * 获取文章列表（文章管理页面）
 * @param {*} param0 pagenum:当前页码数, pagesize:当前页面需要的数据条数
 *   cate_id:文章分类id(注意不是文章id), stat:文章状态("已发布"和"草稿")2种值
 * @returns Promise对象
 */
export const getArticleListAPI = ({ pagenum, pagesize, cate_id, state }) => {
  return request({
    url: '/my/article/list',
    params: {
      pagenum,
      pagesize,
      cate_id,
      state
    }
  })
}

/**
 * 获取文章详情
 * @param {*} id 文章id
 * @returns Promise对象
 */
export const getArtDetailAPI = (id) => {
  return request({
    url: '/my/article/info',
    params: {
      id
    }
  })
}

/**
 * 删除文章
 * @param {*} id 文章id
 * @returns PRomise对象
 */
export const removeArtAPI = (id) => {
  return request({
    url: '/my/article/info',
    method: 'DELETE',
    params: {
      id
    }
  })
}
