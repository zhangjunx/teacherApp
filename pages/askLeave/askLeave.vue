<template>
	<view>
		<view class="noleave" v-if="array.length==0">
			<image src="../../static/icon/wuxiao.png" mode="widthFix"></image>
			<view>暂无数据!</view>
		</view>
		<view class="leaveRecord" >
			<view class="leave-item" v-for="(item,index) in array" :key="index" @click="openLeaveDetail(item.FID)">
				<view class="leave-left">
					<view v-if="item.IMAGE!=''&&item.IMAGE!=undefined">
						<image :src="item.IMAGE" class="stuPhoto" ></image>
					</view>
					<view v-else>
						<image src="../../static/mine/morentou.png" class="stuPhoto"></image>
					</view>
					<view class="leave-right">
						<text class="stuName">{{item.STUDENTNAME}}</text>
						<text class="time">开始时间:&nbsp;&nbsp;{{item.STARTDATE}}</text>
						<text class="time">结束时间:&nbsp;&nbsp;{{item.ENDDATE}}</text>
						<view>
							<text class="leaveThings">请假事由:</text>
							<text class="thingsCon">{{item.LEAVEREASON}}</text>
						</view>
					</view>
				</view>
				<view>
					<view v-if="item.STATUS==0" class="noapply">
							未审批
					</view>
					<view v-if="item.STATUS==1" class="agree">
							审批通过
					</view>
					<view v-if="item.STATUS==-1" class="refuse">
							已拒绝
					</view>
					
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
export default{
	components:{
		uniPopup,
	    uniPopupMessage,
	},
	data(){
		return {
			msg:"",
			array:[],
			page:1,
			pageSize:8,
			hasMoreData:true,
			ifOnShow:false
		}
	},
	onLoad() {
		this.initLeaveRecord();
	},
	//页面隐藏
	onHide() {
		this.ifOnShow = true;
	},
	//页面显示
	onShow() {
		if(this.ifOnShow){
			this.initLeaveRecord();
		}
	},
	//下拉刷新
	onPullDownRefresh(){
		this.page=1;
		this.initLeaveRecord();
	},
	//上拉加载
	onReachBottom(){
		this.page=this.page + 1;
		this.initLeaveRecord();
	},
	methods:{
		openLeaveDetail(fid){
			uni.navigateTo({
				url:'../askLeave/leaveDetail?fid='+fid
			})
		},
		//获取请假记录
		initLeaveRecord(){
			uni.showLoading({
				title:"加载中"
			})
			var app=getApp().globalData;
			var that=this;
			uni.request({
				url:`${this.$url}askLeave/getLeaveList`,
				header: {
						// //设置参数内容类型为json
						'Content-Type': 'application/x-www-form-urlencoded',
						Authorization:this.$store.state.userInfo.token // 默认值
					  },
			  data: {
					classID:app.globalclassID,
					status:'0,1,-1',
					curpage:that.page,
					pagesize:that.pageSize,
				  },
			  method: 'POST',
			  dataType: 'json',
			  success:(res)=>{
				  uni.stopPullDownRefresh();
				  console.log(res);
				  uni.hideLoading();
				  var arr=res.data;
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
					  			that.array=arr.data;
					  		}else{
					  			that.array=that.array.concat(arr.data)
					  		}
					  		if(that.array.length>=arr.count){
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
			  fail:(res)=>{
				  uni.stopPullDownRefresh();
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
	background: #F5F5F5;
}
.noleave{
	text-align: center;
	padding-top: 40rpx;
}
.noleave image{
	width: 340rpx;
}
.noleave view{
	font-size: 16px;
	color: #666;
	text-align: center;
}

.leaveRecord{
	padding: 15rpx 0;
}
.leaveRecord .leave-item{
	margin-bottom: 10rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	background: #fff;
	padding: 15rpx 15rpx;
}
.leave-item .leave-left{
	display: flex;
	align-items: center; 
}

.leaveRecord .leave-item .stuPhoto{
	width: 120rpx;
	height: 120rpx;
	border-radius: 50%;
	margin-right: 20rpx;
	object-fit: cover;
}
.leaveRecord .leave-item .leave-right{
	display: inline-flex;
	flex-direction: column;
	justify-content: space-between;
}
.leave-right .stuName{
	font-size: 16px;
	margin-bottom: 10rpx;
}
.leave-right .time{
	color:#666;
	font-size: 14px;
}
.leave-right .leaveThings{
	color: #666;
	font-size: 14px;	
	vertical-align: top;
	display: inline-block;
	text-align: right;
}
.leave-right .thingsCon{
	color: #666;
	font-size: 14px;
	width: 300rpx;
	display: inline-block;
	margin-left: 10rpx;
	vertical-align: top;
}
.noapply{
	 color: #FF9100;
	 font-size: 16px;
}
.agree{
	color: #1AB6A2;
	 font-size: 16px;
}
.refuse{
	color: #D30C0C;
	 font-size: 16px;
}
</style>
