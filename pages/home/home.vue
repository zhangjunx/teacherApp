<template>
	<view class="home">
		<view class="classList">
			<picker @change="bindPickerChange" :range="array" :value="index" :range-key="'CLASSNAME'">
				<view>
					<text>{{array[index].CLASSNAME}}</text>
					<image src="../../static/icon/jtleft.png" mode="widthFix"></image>
				</view>
			</picker>
		</view>
		<swiper class="swiper">
			<swiper-item>
				<image src="../../static/home/back1.png"></image>		
			</swiper-item>
		</swiper>
		<view class="askLeave">
			<view class="askLeave-top">
				<text class="askLeave-title">学生请假提示</text>
				<view class="leaveRecord">
					<text class="askLeave-record" @click="openRecord">请假记录</text>
					<image src="../../static/icon/jtleft.png" mode="widthFix"></image>
				</view>
			</view>
			<view class="askLeave-con">
				<view class="msg" v-if="leaveArray.length==0">
						暂无请假信息!
				</view>
				<scroll-view scroll-y="true" style="max-height: 300rpx;">
					<view class="stuLeave" v-for="(item,index) in leaveArray" :key="index">
						<view class="stu-item">
							<view class="stu-left">
								<view v-if="item.IMAGE!=''&&item.IMAGE!=undefined">
									<image :src="item.IMAGE" class="stuImg" mode="widthFix"></image>
								</view>
								<view v-else>
									<image src="../../static/mine/morentou.png" class="stuImg" mode="widthFix"></image>
								</view>
								<view class="stuInfo">
									<text class="stuName">{{item.STUDENTNAME}}</text>
									<text class="stuThings">{{item.LEAVEREASON}}</text>
								</view>
							</view>
							<view class="btnDetail" @click="openLeaveDetail(item.FID)">查看详情</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
		<view class="studentNum">
			<view class="studentNum-title">今日学生人数统计</view>
			<view class="studentNum-con">
				<view>
					<image src="../../static/icon/wuxiao.png" mode="widthFix"></image>
					<view>暂无数据!</view>
				</view>
			</view>
		</view>
		<view class="studentNum">
			<view class="studentNum-title">消息通知</view>
			<view class="studentNum-con">
				<view>
					<image src="../../static/icon/wuxiao.png" mode="widthFix"></image>
					<view>暂无数据!</view>
				</view>
			</view>
		</view>
		<uni-popup ref="oftenProblem" type="message">
			<uni-popup-message type="error" :message="msg" :duration="2000"></uni-popup-message>
		</uni-popup>
	</view>
</template>

<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue'
export default {
	components:{
		uniPopup,
		uniPopupMessage
	},
	data(){
		return {
			msg:"",
			index:0,
			classname:"",
			classid:"",
			array:[{"CLASSID":"","CLASSNAME":""}],
			page:1,
			pageSize:10,
			leaveArray:[],
			hasMoreData:true,
			ifOnShow:false
		}
	},
	  onLoad() {
		 
	 	this.initClassList();
	  },
	  //页面显示
	  onShow() {
	  	if(this.ifOnShow){
			this.initClassList();
		}
	  },
	  //页面隐藏
	  onHide() {
	  	this.ifOnShow = true;
	  },
	  //下拉刷新
	  onPullDownRefresh(){
		this.initClassList();
	  },
	methods:{
		
		//跳转请假记录
		openRecord(){
			uni.navigateTo({
				url:'../askLeave/askLeave'
			})
		},
		//跳转请假详情页
		openLeaveDetail(fid){
			uni.navigateTo({
				url:'../askLeave/leaveDetail?fid='+fid
			})
		},
		bindPickerChange(e){
			this.index=e.target.value;
			this.classname=this.array[this.index].CLASSNAME;
			this.classid=this.array[this.index].CLASSID;
			var app=getApp().globalData;
			app.globalclassID=this.classid;
			this.initLeave();
		},
		//获取用户下面的班级列表
		initClassList(){
			var that=this;
			var app=getApp().globalData;
			uni.request({
				url:`${this.$url}public/getClassListWithTeacher`,
				method:"post",
				header: {
				        //设置参数内容类型为json
				       'Content-Type': 'application/x-www-form-urlencoded', // 默认值
						'Authorization':this.$store.state.userInfo.token// 默认值
				      },
				dataType: 'json',
				success:(res)=>{
					 uni.stopPullDownRefresh();
					console.log(res);
					if(res.data=="reLogin"){
						uni.showModal({
							title:"提示",
							content:"登录过期，请重新登录",
							showCancel:false,
							success:function(res) {
								if(res.confirm){
									uni.reLaunch({
										url:"../login/login"
									})
								}
							}
						})
					}else{
						if(res.data.result==true){
							that.array=res.data.data;
							app.globalclassID=res.data.data[that.index].CLASSID;
							that.initLeave();
						}else{
							that.array=[];
						}
					}
				},
				fail:(res)=>{
					 uni.stopPullDownRefresh();
					that.msg="服务器异常!";
					this.$refs.oftenProblem.open();
				}
			})
		},
		//获取请假列表
		initLeave(){
			uni.showLoading({
				title:"加载中"
			})
			var that=this;
			var app=getApp().globalData;
			uni.request({
				url:`${this.$url}askLeave/getLeaveList`,
				method:"post",
				header: {
				        //设置参数内容类型为json
				        'Content-Type': 'application/x-www-form-urlencoded',
				        Authorization:this.$store.state.userInfo.token
				      },
				dataType:"json",
				data:{
						classID:app.globalclassID,
						status:"0",
						curpage:that.page,
						pagesize:that.pageSize
				},
				success:(res)=>{
					var arr=res.data;
					console.log(arr);
					uni.hideLoading();
					if(arr=="reLogin"){
						uni.showModal({
							title:"提示",
							content:"登录过期，请重新登录",
							showCancel:false,
							success:function(res) {
								if(res.confirm){
									uni.reLaunch({
										url:"../login/login"
									})
								}
							}
						})
					}else{
						if(arr.result==true){
							for(var item of arr.data){
								item.IMAGE="data:image/png;base64,"+item.IMAGE.replace(/[\r\n]/g,"");
							}
							if(arr.data!=undefined){
								if(that.page==1){
									that.leaveArray=arr.data;
								}else{
									that.leaveArray=that.leaveArray.concat(arr.data)
								}
								if(that.leaveArray.length>=arr.count){
									that.hasMoreData=false;
								}else{
									that.hasMoreData=true;
								}
							}
						}else{
							that.leaveArray=[];
						}
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
page{
	background:#F5F5F5;
}
.classList{
	padding: 20rpx 0;
	text-align: right;
	background: #fff;
	margin-bottom: 10rpx;
}
.classList view{
	display: inline-flex;
	align-items: center;
}
.classList text{
	font-size: 16px;
}
.classList image{
	width: 20rpx;
	margin-left: 10rpx;
	margin-right: 10rpx;
}
.home{
	padding: 20rpx;
}
.swiper{
	text-align: center;
}
uni-swiper{
	height: 500rpx;
}
.swiper image{
	width: 100%;
}
.askLeave{
	background: #fff;
	margin-top: 20rpx;
	padding: 10rpx;
}
.askLeave .askLeave-top{
	display: flex;
	justify-content: space-between;
	padding-top: 15rpx;
}
.askLeave .askLeave-top .askLeave-title{
	font-size: 16px;
}
.askLeave .askLeave-top .askLeave-record{
	font-size: 16px;
	color:#297BEF ;
}
.askLeave .askLeave-top .leaveRecord{
	display: inline-flex;
	align-items: center;
}
.askLeave .askLeave-top .leaveRecord image{
	width: 20rpx;
	margin-left: 10rpx;
}

.askLeave .askLeave-con{
	max-height: 350rpx;
}
.askLeave .askLeave-con .msg{
	text-align: center;
	font-size: 16px;
	line-height: 200rpx;
	color: #666666;
}
.stuLeave{
	padding:40rpx 0;
}
.stuLeave .stu-item .stuImg{
	width: 120rpx;
	height:120rpx;
	border-radius: 50%;
	vertical-align: middle;
}
.stu-item{
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 10rpx;
}
.stu-item .stu-left{
	display: flex;
	align-items: center;
}
.stu-item .stu-left .stuInfo{
	display: flex;
	flex-direction: column;
	margin-left: 20rpx;
}
.stu-item .stu-left .stuInfo .stuName{
	font-size: 16px;
	margin-bottom: 10px;
}
.stu-item .stu-left .stuInfo .stuThings{
	font-size: 14px;
	color:#666;
	width: 400rpx;
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
}
.stu-item .btnDetail{
	display: inline-block;
	padding: 5px 10px;
	background: #297BEF;
	color:#fff;
	border: none;
	border-radius: 50rpx;
	font-size: 14px;
}

.studentNum .studentNum-title{
	font-size: 16px;
	padding: 40rpx 0;
}
.studentNum .studentNum-con{
	height: 500rpx;
	background: #fff;
	padding: 20rpx;
}
.studentNum .studentNum-con view{
	text-align: center;
}
.studentNum .studentNum-con view image{
	width: 340rpx;
}
.studentNum .studentNum-con view view{
	color: #666;
	font-size: 16px;
}


</style>
