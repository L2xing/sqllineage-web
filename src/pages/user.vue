<template>
  <div id="user">
    <el-row>
      <el-col :span="4">
        <el-input
          v-model="pageInfo.criteria"
          placeholder="根据用户名、昵称、邮箱模糊查询"
        ></el-input>
      </el-col>
      <el-button type="primary" @click="fetchData(1)">搜索</el-button>
      <el-button type="success" @click="reset()">重置</el-button>
      <!-- <el-button type="primary" icon="el-icon-edit" circle @click="insertEvent"></el-button> -->
    </el-row>
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="username" label="用户名"> </el-table-column>
      <el-table-column prop="nickName" label="昵称"> </el-table-column>
      <el-table-column prop="gender" label="性别"> </el-table-column>
      <el-table-column prop="mail" label="邮箱"> </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template #default="scope">
          <el-button @click="editEvent(scope.row)" type="text" size="small"
            >编辑</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div id="pages">
      <el-pagination
        layout="prev, pager, next"
        :total="pageInfo.total"
        :size="pageInfo.size"
      >
      </el-pagination>
    </div>
    <el-dialog title="增加" v-model="insert" width="30%" center>
      <el-form ref="submit" :model="submit" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="submit.username"></el-input>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="submit.nickName"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio v-model="submit.gender" label="0">未知</el-radio>
          <el-radio v-model="submit.gender" label="1">男</el-radio>
          <el-radio v-model="submit.gender" label="2">女</el-radio>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="submit.mail"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="insert = false">取 消</el-button>
          <el-button type="primary" @click="save">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog title="修改" v-model="edit" width="30%" center>
      <el-form ref="submit" :model="submit" label-width="100px">
        <el-form-item label="昵称">
          <el-input v-model="submit.nickName"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio v-model="submit.gender" label="0">未知</el-radio>
          <el-radio v-model="submit.gender" label="1">男</el-radio>
          <el-radio v-model="submit.gender" label="2">女</el-radio>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="submit.mail"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="edit = false">取 消</el-button>
          <el-button type="primary" @click="save">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { userPage, userSave, userUpdate } from "@/api/index.js";

export default {
  name: "user",
  components: {},
  data() {
    return {
      edit: false,
      insert: false,
      tableData: [],
      submit: {
        id: null,
        nickName: "",
        gender: "",
        isAdmin: "",
        mail: "",
      },
      pageInfo: {
        criteria: "",
        size: 10,
        current: 1,
        total: 0,
      },
    };
  },
  created() {
    this.fetchData(1);
  },

  methods: {
    editEvent(index) {
      this.edit = true;
      this.submit.id = index.id;
      this.submit.nickName = index.nickName;
      this.submit.gender = index.gender;
      this.submit.isAdmin = index.isAdmin;
      this.submit.mail = index.mail;
    },
    insertEvent() {
      this.insert = true;
    },
    fetchData(index) {
      userPage(this.pageInfo).then((res) => {
        if (res.code == 200) {
          let data = res.data;
          this.pageInfo.total = data.total;
          this.pageInfo.size = data.size;
          this.pageInfo.current = data.current;
          this.tableData = data.records;
        }
      });
    },
    save() {
      if (this.submit.id) {
        // 更新
        userUpdate(this.submit);
        this.edit = false;
      } else {
        // 新增
        userSave(this.submit);
        this.insert = false;
      }
      this.clearSubmit();
    },
    clearSubmit() {
      this.submit.id = null;
      this.submit.username = "";
      this.submit.nickName = "";
      this.submit.gender = 0;
      this.submit.isAdmin = 0;
      this.submit.mail = "";
    },
    reset() {
      this.pageInfo.criteria = "";
      this.fetchData(1);
    },
  },
};
</script>

<style scoped>
</style>
