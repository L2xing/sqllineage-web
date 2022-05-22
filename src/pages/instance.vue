<template>
	<div id="instance">
		<el-row>
			<el-col :span="4">
				<el-input v-model="pageInfo.criteria" placeholder="根据ip查询"></el-input>
			</el-col>
			<el-button type="primary" @click="fetchData(1)">搜索</el-button>
			<el-button type="success" @click="reset">重置</el-button>
			<el-button type="primary" icon="el-icon-edit" circle @click="insertEvent">
			</el-button>
		</el-row>
		<el-table :data="tableData" stripe style="width: 100%">
			<el-table-column prop="Host" label="主机地址">
			</el-table-column>
			<el-table-column prop="Port" label="端口">
			</el-table-column>
			<el-table-column prop="Username" label="用户名">
			</el-table-column>
			<el-table-column prop="Password" label="密码">
			</el-table-column>
			<el-table-column prop="Type" label="数据库类型">
			</el-table-column>
			<el-table-column fixed="right" label="操作">
				<template #default="scope">
					<el-button @click="instanceDataFetch(scope.row)" type="text" size="small">同步
					</el-button>
					<el-button @click="deleteEvent(scope.row)" type="text" size="small">删除
					</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div id="pages">
			<el-pagination layout="prev, pager, next" :total="pageInfo.total" :page-size="pageInfo.size"
				@current-change="fetchData">
			</el-pagination>
		</div>
		<el-dialog title="增加" v-model="insert" width="30%" center>
			<el-form ref="submit" :model="submit" label-width="80px">
				<el-form-item label="主机地址">
					<el-input v-model="submit.Host"></el-input>
				</el-form-item>
				<el-form-item label="端口">
					<el-input v-model="submit.Port"></el-input>
				</el-form-item>
				<el-form-item label="用户名">
					<el-input v-model="submit.Username"></el-input>
				</el-form-item>
				<el-form-item label="密码">
					<el-input v-model="submit.Password"></el-input>
				</el-form-item>
				<el-form-item label="数据库类型">
					<el-input v-model="submit.type" placeholder="(如果是虚拟库请填写virtual)"></el-input>
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
			<el-form ref="submit" :model="submit" label-width="80px">
				<el-form-item label="主机地址">
					<el-input v-model="submit.host"></el-input>
				</el-form-item>
				<el-form-item label="端口">
					<el-input v-model="submit.port"></el-input>
				</el-form-item>
				<el-form-item label="用户名">
					<el-input v-model="submit.username"></el-input>
				</el-form-item>
				<el-form-item label="密码">
					<el-input v-model="submit.password"></el-input>
				</el-form-item>
				<el-form-item label="数据库类型">
					<el-input v-model="submit.type" placeholder="(如果是虚拟库请填写virtual)"></el-input>
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
	import upload from '@/components/upload.vue'

	import {
		instancePage,
		instanceUpdate,
		instanceSave,
		instanceDelete,
		instancePullData
	} from '@/api/index.js'

	import {
		store
	} from '@/api/localstroage.js'

	export default {
		name: 'instance',
		components: {},
		data() {
			return {
				edit: false,
				insert: false,
				tableData: [],
				submit: {
					id: null,
					host: '',
					port: '',
					username: '',
					passowrd: '',
					type: ''
				},
				pageInfo: {
					criteria: '',
					size: 10,
					current: 1,
					total: 0
				},
				file: '',
				isAdmin: 'false',
			}
		},
		components: {
			upload
		},
		methods: {
			instanceDataFetch(instance) {
				instancePullData(instance.ID)
				.then((res) =>{
					if (res.data) {
						alert("同步成功")
					}else{
						alert("同步失败")
					}
				})
				.catch((res) =>{

				})

			},
			deleteEvent(index) {
				instanceDelete(index.ID).then((res) => {
					if (res.code === 0) {
						alert("删除成功");
						this.reset();
					}
				})
			},
			insertEvent() {
				this.insert = true;
			},
			onfiles(file) {
				this.submit.address = file
			},

			fetchData(current) {
				this.pageInfo.current = current;
				instancePage(this.pageInfo)
					.then((res) => {
						if (res.code == 0) {
							let data = res.data;
							this.pageInfo.total = data.total;
							this.pageInfo.size = data.size;
							this.pageInfo.current = data.current;
							this.tableData = data.records
							// alert("成功")
						} else {
							alert("失败")
						}
					})
					.catch((res) => {
						alert("失败")
					})
			},
			reset() {
				console.log('重置')
				this.pageInfo.criteria = null;
				this.fetchData(1);
			},

			save() {
				if (this.submit.id) {
					// 更新
					instanceUpdate(this.submit)
						.then(res => {
							if (res.code == 0) {
								alert("成功")
								this.reset()
							} else {
								alert("失败")
							}
						})
					this.edit = false;
				} else {
					// 新增
					instanceSave(this.submit)
						.then(res => {
							if (res.code == 0) {
								alert("成功")
								this.reset()
							} else {
								alert("失败")
							}
						})
					this.insert = false;
				}
				this.clearSubmit()
			},
			clearSubmit() {
				this.submit.id = null
				this.submit.host = ""
				this.submit.port = ""
				this.submit.username = ""
				this.submit.password = ""
				this.submit.type = ""
			}
		},
		created() {
			// this.fetchData(1)
			this.reset()
		},
		mounted() {}

	}
</script>

<style>
	#pages {
		margin-top: 10px;
	}
</style>
