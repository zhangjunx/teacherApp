<template>
	<view class="editPassword">
		<view class="updateBox" @tap="openinfo">
			<view>修改登录密码</view>
			<view class="mine-photo-right">
				<image src="../../static/icon/jtleft.png" mode="widthFix"></image>
			</view>
		</view>
		<view class="exitBtn">
			<button hover-class="btn-active" @click="exit">退出</button>
		</view>
	</view>
</template>

<script>
	import {mapState, mapMutations} from 'vuex'
export default {
	methods:{
		...mapMutations(["loginout"]),
		openinfo(){
			uni.navigateTo({
				url:'../updatePassword/updatePassword'
			})
		},
		exit(){
			this.loginout();
			uni.removeStorage({
			    key: 'username',
			});
			uni.removeStorage({
			    key: 'password',
			});
			uni.reLaunch({
				url:'../login/login'
			})
		}
	}
}
</script>

<style>
page{
	background: #F5F5F5;
}
.updateBox view{
	font-size: 18px;
}
.updateBox{
	display: flex;
	padding: 20rpx 25rpx;
	justify-content: space-between;
	background: #fff;
	box-shadow: -5px 2px 2px #eee;
}
.updateBox .mine-photo-right{
	display: flex;
	flex-direction: column;
	justify-content: center;
}
.updateBox .mine-photo-right image{
	width: 20rpx;
}
.exitBtn button{
	width: 600rpx;
	background: #FF3D3F;
	border-radius: 50rpx;
	color:#fff;
	border: none;
}
.exitBtn{
	margin-top: 80rpx;
	text-align: center;
}
.btn-active{
	opacity: 0.7;
}
</style>
