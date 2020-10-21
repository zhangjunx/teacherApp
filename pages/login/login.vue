<template>
	<view class="login">
		<view class="login-title">
				<image src="../../static/login/logo.png" mode="widthFix"></image>
		</view>
		<view class="login-text">防控教务平台</view>
		<view class="login-con">
			<view class="login-con-item">
				<input type="text" placeholder="账号" v-model="username">
			</view>
			<view class="login-con-item">
				<input type="text" password="true" placeholder="密码" v-model="password">
			</view>
		</view>
		<view class="login-bottom">
			<button hover-class="btn-active" @click="login">登录</button>
		</view>
		<uni-popup ref="oftenProblem" type="message">
			<uni-popup-message type="error" :message="msg" :duration="2000"></uni-popup-message>
		</uni-popup>
	</view>
</template>

<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue'
	import {mapMutations} from 'vuex'
export default{
	data(){
		return {
			username:"",
			password:"",
			msg:""
		}
	},
	components:{
		uniPopup,
	    uniPopupMessage
	},
	onShow(){
		uni.getStorage(
			{
				key:"username",
				success:(res)=>{
					this.username=res.data;
				}
			},
		)
		uni.getStorage({
			key:"password",
			success:(res)=>{
				this.password=res.data;
			}
		})
	},
	methods:{
		login(){
			uni.showLoading({
				title:'登录中'
			})
			var that=this;
			var app=getApp().globalData;
			uni.request({
				url:`${this.$url}login2/tecLogin`,
				method:"post",
				data:{
					userName:that.username,
					password:that.password
				},
				header: {
				        //设置参数内容类型为json
				        'Content-Type': 'application/x-www-form-urlencoded' // 默认值
				      },
			    dataType: 'json',
				success:(res)=>{
					uni.hideLoading();
					if(res.data.result){
						var provider={
							"token":res.data.data,
							"username":that.username
						};
						this.loginIn(provider);
						app.token=res.data.data
						uni.setStorage(
							{
								key:'username',
								data:that.username,
							},
						)
						uni.setStorage({
							key:"password",
							data:that.password,
						})
						uni.switchTab({
							url:'../home/home',
						})
					}else{
						that.msg=res.data.msg;
						this.$refs.oftenProblem.open();
					}
				},
				fail:(res)=>{
					uni.hideLoading();
					that.msg="服务器异常!";
					this.$refs.oftenProblem.open();
				}
			})
		},
		...mapMutations(["loginIn"])
	}
}
</script>

<style>
.login-title{
	text-align: center;
	margin-top: 200rpx;
}
.login-title image{
	width:350rpx;
}
.login-text{
	color: #297BEF;
	font-weight: 600;
	text-align: center;
}
.login-con{
	margin-top: 80rpx;
}
.login-con .login-con-item{
	text-align: center;
	margin: 10rpx;
}
.login-con .login-con-item input{
	border-bottom: 1px solid #ddd;
	height: 80rpx;
	width: 600rpx;
	display: inline-block;
	text-align: left;
	font-size: 36rpx;
}
.login-bottom button{
	width: 600rpx;
	background: #1D73E6;
	border-radius: 50rpx;
	color:#fff;
	border: none;
}
.login-bottom{
	margin-top: 80rpx;
	text-align: center;
}
.btn-active{
	opacity: 0.7;
}

</style>
