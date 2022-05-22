<template>
	<div id="mine">
		<el-card shadow="always">
			<el-container>
				<el-main>
					<el-switch v-model="edit" active-text="查看" inactive-text="修改" active-color="#13ce66" inactive-color="#ff4949">
					</el-switch>
					<el-form ref="form" :model="user" label-width="100px">
						<el-form-item label="昵称">
							<el-input :disabled="edit" v-model="user.nickName"></el-input>
						</el-form-item>
						<el-form-item label="性别">
							<el-radio :disabled="edit" v-model="user.gender" label="0">未知</el-radio>
							<el-radio :disabled="edit" v-model="user.gender" label="1">男</el-radio>
							<el-radio :disabled="edit" v-model="user.gender" label="2">女</el-radio>
						</el-form-item>
						<!-- <el-form-item label="是否为管理员">
							<el-switch :disabled="edit" v-model="user.isAdmin" active-text="是" inactive-text="不是" active-color="#13ce66" inactive-color="#ff4949">
								</el-switch>
						</el-form-item> -->
						<el-form-item label="邮箱">
							<el-input :disabled="edit" v-model="user.mail"></el-input>
						</el-form-item>
					</el-form>
					 <el-button type="danger" @click="update">保存</el-button>
					 <el-button type="info" @click="reset">退出</el-button>
				</el-main>
			</el-container>
		</el-card>
	</div>
</template>

<script>
	
	import {fetchOwnDetail,userUpdate } from '@/api/index.js'
	import {isAdminUtils} from '@/common/utils.js'
	import {putToken, getToken} from '@/api/localstroage.js'
	
	export default {
		name: 'mine',
		components: {},
		data() {
			return {
				edit: true,
				user: {
					id: null,
					username: '',
					nickName: '',
					gender: 0,
					isAdmin: 0,
					mail: '',
				}
			}
		},
		methods: {
			
			fetchData(){
				fetchOwnDetail().then(res => {
					if(res.code == 200){
						let data = res.data;
						console.log(data)
						this.user.id = data.id;
						this.user.username = data.username;
						this.user.nickName = data.nickName;
						this.user.gender = data.gender;
						this.user.isAdmin = data.isAdmin;
						this.user.mail = data.mail;
					}
				})
			},
			update(){
				if(this.user.id){
					let submit = this.user;
					userUpdate(this.user)
					.then(res =>{
						if(res.code == 200){
							putToken(res.data.token)
							console.log(getToken())
							alert("ok")
						}
					})
				}
				
			},
			reset(){
				this.edit = false;
				this.fetchData();
			}
			
		},
		created() {
			this.fetchData()
		}
	}
</script>

<style scoped>
</style>
