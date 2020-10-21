<template>
	<view class="editBox">
		<view class="text">设置成功后，下次可直接使用该密码登录账户!</view>
		<view class="iptBox">
			<view>
				<input type="text" :password="flag1" placeholder="请输入旧密码" v-model="password1">
				<image :src="src1" mode="widthFix" @click="changeIpt1"></image>
			</view>
			<view>
				<input type="text" maxlength="12" :password="flag2" v-model="password2" placeholder="登录密码设置为6-12位">
				<image :src="src2" mode="widthFix" @click="changeIpt2"></image>
			</view>
			<view>
				<input type="text" maxlength="12" :password="flag3" v-model="password3" placeholder="请再次确认登录密码">
				<image :src="src3" mode="widthFix" @click="changeIpt3"></image>
			</view>
		</view>
		<view class="surebtn">
			<button hover-class="btn-active" @click="saveInfo">确定</button>
		</view>
		<uni-popup ref="oftenProblem" type="message">
			<uni-popup-message type="error" :message="msg" :duration="2000"></uni-popup-message>
		</uni-popup>
	</view>
</template>

<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue'
export default{
	components:{
		uniPopup,
		uniPopupMessage,
	},
	data(){
		return{
			msg:"",
			password1:"",
			password2:"",
			password3:"",
			flag1:true,
			flag2:true,
			flag3:true,
			src1:"../../static/mine/biyan.png",
			src2:"../../static/mine/biyan.png",
			src3:"../../static/mine/biyan.png",
		}
	},
	methods:{
		changeIpt1(){
			this.flag1 = !this.flag1;
			if(this.src1 == "../../static/mine/biyan.png"){
				this.src1 = "../../static/mine/zheng.png";
			}else{
				this.src1 = "../../static/mine/biyan.png";
			}
		},
		changeIpt2(){
			this.flag2 = !this.flag2;
			if(this.src2 == "../../static/mine/biyan.png"){
				this.src2 = "../../static/mine/zheng.png";
			}else{
				this.src2 = "../../static/mine/biyan.png";
			}
		},
		changeIpt3(){
			this.flag3 = !this.flag3;
			if(this.src3 == "../../static/mine/biyan.png"){
				this.src3 = "../../static/mine/zheng.png";
			}else{
				this.src3 = "../../static/mine/biyan.png";
			}
		},
		saveInfo(){
			var reg=/^[\w]{6,12}$/;
			if(this.password1==""){
				uni.showToast({
					title:"请输入旧密码",
					icon:"none",
					duration:2000,
				})
				return;
			}
			if(this.password2==""){
				uni.showToast({
					title:"请输入登录密码",
					icon:"none",
					duration:2000,
				})
				return;
			}else if(!reg.test(this.password2)){
				uni.showToast({
					title:"请正确输入登录密码",
					icon:"none",
					duration:2000,
				})
				return;
			}
			if(this.password3==""){
				uni.showToast({
					title:"请再次输入登录密码",
					icon:"none",
					duration:2000,
				})
				return;
			}else if(!reg.test(this.password3)){
				uni.showToast({
					title:"请正确输入登录密码",
					icon:"none",
					duration:2000,
				})
				return;
			}
			if(this.password2 != this.password3){
				uni.showToast({
					title:"两次输入的新密码不一致",
					icon:"none",
					duration:2000,
				})
				return;
			}
			uni.showLoading({
				title:"上传中"
			})
			var app=getApp().globalData;
			var that=this;
			uni.request({
				url:`${this.$url}teacherUser/updateTecPassword`,
				header: {
						// //设置参数内容类型为json
						'Content-Type': 'application/x-www-form-urlencoded',
						Authorization:this.$store.state.userInfo.token // 默认值
					  },
			  data: {
				    oldPassword:that.password1,
					newPassword:that.password2,
					reNewPassword:that.password3,
				  },
			  method: 'POST',
			  dataType: 'json',
			  success:(res)=>{
				  uni.hideLoading();
				  console.log(res);
				  if(res.data.result){
					  uni.showToast({
					  	title:'修改成功!',
						icon:'success',
						duration:2000,
						success() {
							setTimeout(function(){
								 uni.reLaunch({
										url: '../login/login'
									  })
							},2000)
						}
					  })
				  }else{
					  uni.showToast({
					  	title:res.data.msg,
						icon:"none",
						duration:2000,
					  })
				  }
			  },
			  fail:()=>{
				  uni.hideLoading();
				  that.msg="服务器异常!";
				  this.$refs.oftenProblem.open();
			  }
			})
			
		}
	}
}
</script>

<style>
.editBox{
	padding: 40rpx 40rpx;
}
.editBox .text{
	font-size: 14px;
	color: #666666;
	padding: 40rpx 0;
	text-align: center;
	
}
.editBox .iptBox view{
	height:80rpx;
	border-radius:10rpx;
	box-sizing:border-box;
	border:1px solid #DDDDDD;
	display:flex;
	justify-content:space-between;
	align-items: center;
	padding:7px 15px 10px 15px;
	width: 100%;
	margin-bottom: 40rpx;
}
.editBox .iptBox view image{
	width: 40rpx;
}
.editBox .iptBox view input{
	width: 70%;
}
.surebtn{
	margin-top: 80rpx;
}
.surebtn button{
	background: #1D73E6;
	border-radius: 50rpx;
	color:#fff;
	border: none;
}
.btn-active{
	opacity: 0.7;
}
</style>
