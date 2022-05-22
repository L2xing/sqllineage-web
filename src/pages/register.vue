<template>
	<div id="login">
		<div class="box">
			<el-form ref="loginForm" :model="loginForm" label-position="left" label-width="0px"
				class="login-form">
				<h3 class="title">
					注册
				</h3>
				<el-form-item prop="username">
					<el-input v-model="loginForm.username" type="text" auto-complete="off" placeholder="账号">
						<svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
					</el-input>
				</el-form-item>
				<el-form-item prop="password">
					<el-input v-model="loginForm.password" type="password" auto-complete="off" placeholder="密码">
						<svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
					</el-input>
				</el-form-item>
				<el-form-item prop="secPassword">
					<el-input v-model="loginForm.secPassword" type="password" auto-complete="off" placeholder="确认密码">
						<svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
					</el-input>
				</el-form-item>
				<el-form-item style="width:100%;">
					<el-button :loading="loading" size="medium" type="primary" style="width:100%;"
						@click="handleLogin">
						<span v-if="!loading">注册</span>
						<span v-else>登 录 中...</span>
					</el-button>
				</el-form-item>
				<el-link href="/login" type="primary">返回登录</el-link>
			</el-form>
			<div class="footer">
				<p>Copyright &copy;2021 <a target="_blank">SqlLineage</a> 版权所有</p>
				<p>技术支持: <a target="_blank">LXX</a></p>
			</div>
		</div>
	</div>
</template>

<script>
	import {register} from '@/api/index.js'
	import {store} from '@/store'
	import {putToken} from '@/api/localstroage.js'
	export default {
		name: 'register',
		components: {},
		data() {
			return {
				loginForm: {
					username: '',
					password: '',
					secPassword: ''
				},
				loading: false
			}
		},
		methods:{
			handleLogin(){
				register(this.loginForm).then((res) => {
					console.log(res)
					if(res.code == 0){
						store.setter('auth',res.data)
						putToken(res.data.token)
						window.location.href = '/home';
						alert("注册成功")
					}else{
						alert("注册失败")
					}
				})
			}
		}
	}
</script>

<style scoped>
	.box {
		width: 942px;
		height: 520px;
		background: #fbfbfe;
		border-radius: 1px;
		box-shadow: -1px 1px 10px lightgray;
		position: absolute;
		left: calc(50% - 471px);
		top: calc(50% - 260px);
		background-image: linear-gradient(#f5f5fe, #ffffff);
	}

	.title {
		margin: 0 auto 30px auto;
		text-align: center;
		color: #707070;
	}

	.main-title {
		position: absolute;
		top: 2%;
		left: 5%;

		font-size: 36px;
		font-weight: normal;


	}

	.main-title>span {
		position: relative;
		top: -57px;

	}

	.main-title .logo {
		position: relative;
		display: inline-block;
		width: 70px;
		height: 70px;
		background-size: 70px 70px;
		background-repeat: no-repeat;
	}

	.login-img {
		width: 250px;
		height: 250px;

		background-size: 100% 100%;
		background-repeat: no-repeat;
		z-index: 9;
		position: absolute;

		top: calc(50% - 125px);
		left: 14%;

	}

	.login-form {
		border-radius: 1px;
		background: #ffffff;

		width: 345px;
		padding: 25px 25px 5px 25px;
		box-shadow: -1px 1px 5px lightgray;
		z-index: 9;
		position: relative;
		left: 28%;

		top: calc(50% - 173px);

	}

	.login-form>.el-input {
		height: 38px;

		input {
			height: 38px;
		}
	}

	.login-form>.input-icon {
		height: 39px;
		width: 14px;
		margin-left: 2px;
	}

	.login-tip {
		font-size: 13px;
		text-align: center;
		color: #bfbfbf;
	}

	.login-code {
		width: 33%;
		display: inline-block;
		height: 38px;
		float: right;

		img {
			cursor: pointer;
			vertical-align: middle
		}
	}

	.footer {
		width: 100%;
		height: 50px;
		position: absolute;
		bottom: 0.5%;
		z-index: 0;

		
	}
	
	.footer>p {
		line-height: 7px;
		text-align: center;
		font-size: 12px;
	
		
	}
	.footer>p>a:hover {
			color: #1890ff;
			transition: all .1s linear;
		}
</style>
