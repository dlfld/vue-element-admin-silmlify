<template>
  <div class="out">
    <div class="filter-container">
      <!-- 标题 input框 -->
      <el-input
        v-model="attendsUsers"
        placeholder="获取指定用户关注的用户"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="findAttendsUsers"
      />
      <el-input
        v-model="fansUsers"
        placeholder="获取指定用户的粉丝"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="findUserFans"
      />

      <el-button type="primary" round @click="dialogVisible=true">查询用户是否关注另一用户</el-button>
      <!-- <el-input v-model="listQuery.mgrQueryLostRequest.schoolId" placeholder="学校名（ID）" style="width: 200px;" class="filter-item" @change ="findAll(listQuery)"/> -->
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <!-- 一列的结束 -->
      <el-table-column label="用户ID" align="center">
        <template slot-scope="{ row }">
          <span>{{row.rowKey}}</span>
        </template>
      </el-table-column>

      <el-table-column label="用户名" align="center">
        <template slot-scope="{ row }">
          <span>{{row.userName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="年龄" align="center">
        <template slot-scope="{ row }">
          <span>{{row.age}}</span>
        </template>
      </el-table-column>
      <el-table-column label="简介" align="center">
        <template slot-scope="{ row }">
          <span>{{row.introduce}}</span>
        </template>
      </el-table-column>
      <el-table-column label="关注数" align="center">
        <template slot-scope="{ row }">
          <span>{{row.attends}}</span>
        </template>
      </el-table-column>
      <el-table-column label="粉丝数" align="center">
        <template slot-scope="{ row }">
          <span>{{row.fans}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <!-- 右边按钮区域 -->
        <template slot-scope="{ row }">
          <el-button type="primary" size="small" @click="attends(row.rowKey)">关注</el-button>
          <el-button type="danger" size="small" @click="disAttends(row.rowKey)">取关</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :visible.sync="dialogVisible"
      title="查询指定用户是否关注另一个用户号"
    >
      <el-form :model="Info" label-position="left">
        <el-form-item label="用户ID">
          <el-input v-model="Info.user"></el-input>
        </el-form-item>
        <el-form-item label="另一用户ID">
          <el-input v-model="Info.userOther"></el-input>
        </el-form-item>

      </el-form>

      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="selectIsAttends">查询</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getList,
    attendsUser,
    disAttendsUser,
    getAttendsUsers,
    getUsersFans,
    auditIsAttendsAnotherUser
  } from '@/api/dashbord'

  export default {
    name: 'Dashboard',
    computed: {},
    data() {
      return {
        list: [],
        listLoading: true,
        //获取用户关注的用户
        attendsUsers: '',
        // 用户的粉丝
        fansUsers: '',
        dialogVisible: false,
        Info: {
          user: '',
          userOther: ''
        }
      }
    },
    created() {
      this.init()
    },
    methods: {
      //初始化方法,查询全部
      async init() {
        this.listLoading = true
        const res = await getList()
        // console.log(res);
        this.list = res
        console.log(this.list[0])
        this.listLoading = false
      },
      //关注用户
      async attends(rowKey) {
        this.$prompt('请输入关注者ＩＤ', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(async({ value }) => {
          const res = await attendsUser(value, rowKey)
          console.log(value)
          console.log(rowKey)
          if (res === 'SUCCESS') {
            this.init()
            this.$message({
              type: 'success',
              message: '关注添加成功!'
            })

          }
        })
      },
      //取关用户
      async disAttends(rowKey) {
        this.$prompt('请输入取关者ＩＤ', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(async({ value }) => {
          const res = await disAttendsUser(value, rowKey)
          console.log(value)
          console.log(rowKey)
          if (res === 'SUCCESS') {
            this.init()
            this.$message({
              type: 'success',
              message: '取关成功!'
            })

          }
        })
      },
      //获取用户关注了哪些用户
      async findAttendsUsers() {
        let userId = this.attendsUsers
        const res = await getAttendsUsers(userId)
        this.list = res
        this.attendsUsers = ''
      },
      //获取指定用户的粉丝
      async findUserFans() {
        let userId = this.fansUsers
        const res = await getUsersFans(userId)
        this.list = res
        this.fansUsers = ''
      },
      //查询一个用户是否关注另一个用户
      async selectIsAttends() {
        let data = this.Info
        const res = await auditIsAttendsAnotherUser(data.user, data.userOther)

        this.dialogVisible = false
        if (res == true) {
          let message = '用户:' + data.user + '关注了用户:' + data.userOther
          this.$alert(message, '查询结果', {
            confirmButtonText: '确定'
          })
        }
        if (res == false) {
          let message = '用户:' + data.user + '没有关注用户:' + data.userOther
          this.$alert(message, '查询结果', {
            confirmButtonText: '确定'
          })
        }
        this.Info.userOther = ''
        this.Info.user = ''
      }
    }
  }
</script>

<style lang="scss" scoped>
  .dashboard {
    &-container {
      margin: 30px;
    }

    &-text {
      font-size: 30px;
      line-height: 46px;
    }
  }
</style>
