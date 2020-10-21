<template>
	<view class="classData">
		<view class="schoolNum">
			<view class="title">当前在校人数</view>
			<view class="studentNum-con">
				<view class="studentNum">216<text>总数</text></view>
			</view>
		</view>
		<view class="studentClass">
			<view class="student-item">
				<view class="item-title">56</view>
				<view class="item-classname">三(1)班</view>
			</view>
			<view class="student-item">
				<view class="item-title">56</view>
				<view class="item-classname">三(1)班</view>
			</view>
			<view class="student-item">
				<view class="item-title">56</view>
				<view class="item-classname">三(1)班</view>
			</view>
			
		</view>
		<!-- 请假人数 -->
		<view class="leaveNum">
			<view class="leaveNum-item" @click="openLeavePage">
				<view class="item-top">
					<text>请假人数</text>
					<image src="../../static/icon/arrow-left.png" mode="widthFix"></image>
				</view>
				<view class="item-bottom">3</view>
			</view>
			<view class="leaveNum-item" @click="openAbsence">
				<view class="item-top">
					<text>缺勤人数</text>
					<image src="../../static/icon/arrow-left.png" mode="widthFix"></image>
				</view>
				<view class="item-bottom">3</view>
			</view>
			<view class="leaveNum-item" @click="openTemperature">
				<view class="item-top">
					<text>体温异常</text>
					<image src="../../static/icon/arrow-left.png" mode="widthFix"></image>
				</view>
				<view class="item-bottom">3</view>
			</view>
		</view>
		<!-- 学生体温统计 -->
		<view class="studentTemperature">
			<view class="title">学生体温统计</view>
			<view class="temperature-con">
				<canvas canvas-id="canvasPie" id="canvasPie" class="charts-pie" @touchstart="touchPie"></canvas>
			</view>
		</view>
		<!-- 学生分布情况 -->
		<view class="studentLocation">
			<view class="title">学生分布情况</view>
			<view class="location-con qiun-charts">
				<canvas canvas-id="canvasRing" id="canvasRing" class="charts" @touchstart="touchRing"></canvas>
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
import uCharts from '@/js_sdk/u-charts/u-charts/u-charts.js'
var _self;
var canvaPie=null;
var canvaRing=null;
export default{
	components:{
		uniPopup,
		uniPopupMessage
	},
	data(){
		return{
			msg:"",
			cWidth:'',
			cHeight:'',
			pixelRatio:1,
			serverData:'',
			serverData2:'',
			piearr:[]
		}
	},
	onLoad(){
		_self=this;
		this.cWidth=uni.upx2px(750);
		this.cHeight=uni.upx2px(500);
		this.getServerData();
		this.getServerData2();
	},
	methods:{
		//请假详情
		openLeavePage(){
			uni.navigateTo({
				url:"./classLeave"
			})
		},
		//缺勤详情
		openAbsence(){
			uni.navigateTo({
				url:"./absence"
			})
		},
		//体温异常
		openTemperature(){
			uni.navigateTo({
				url:"./temperatureNotNormal"
			})
		},
		getServerData(){
			uni.request({
				url:'https://www.ucharts.cn/data.json',
				success:function(res){
					console.log(res.data.data)
					let Pie={series:[]};
					Pie.series=res.data.data.Pie.series;
					_self.showPie("canvasPie",Pie);
				},
				fail:function(){
					_self.msg="服务器异常!";
					this.$refs.oftenProblem.open();
				}
			})
		},
			showPie(canvasId,chartData){
				canvaPie=new uCharts({
					$this:_self,
					canvasId: canvasId,
					type: 'pie',
					fontSize:11,
					legend:{
					  show:true,
					  position:'right',
					  float:'center',
					  itemGap:10,
					  padding:5,
					  lineHeight:26,
					  margin:5,
					  borderWidth :1,
					  fontColor:'#57DBFF',
					},
					background:'#FFFFFF',
					pixelRatio:_self.pixelRatio,
					series:chartData.series,
					animation: true,
					width: _self.cWidth*_self.pixelRatio,
					height: _self.cHeight*_self.pixelRatio,
					dataLabel: true,
					extra: {
						pie: {
						  labelWidth:15
						}
					},
				});
				this.piearr=canvaPie.opts.series;
			},
			touchPie(e){
				canvaPie.showToolTip(e, {
					format: function (item) {
						return item.name + ':' + item.data 
					}
				});
			},
		//学生分布情况	
		getServerData2(){
			uni.request({
				url: 'https://www.ucharts.cn/data.json',
				data:{
				},
				success: function(res) {
					let Ring={series:[]};
					Ring.series=res.data.data.Ring.series;
					_self.showRing("canvasRing",Ring);
				},
				fail: () => {
					_self.msg="服务器异常!";
					this.$refs.oftenProblem.open();
				},
			});
		},
		showRing(canvasId,chartData){
			canvaRing=new uCharts({
				$this:_self,
				canvasId: canvasId,
				type: 'ring',
				fontSize:11,
				background:"#111943",
				legend:{
					show:true,
					position:'right',
					float:'center',
					itemGap:10,
					padding:5,
					lineHeight:26,
					margin:5,
					borderWidth :1,
					fontColor:'#57DBFF',
				},
				extra: {
					pie: {
					  offsetAngle: -45,
					  ringWidth: 40*_self.pixelRatio,
					  labelWidth:15
					}
				},
				pixelRatio:_self.pixelRatio,
				series: chartData.series,
				animation: true,
				width: _self.cWidth*_self.pixelRatio,
				height: _self.cHeight*_self.pixelRatio,
				disablePieStroke: true,
				dataLabel: true,
			});
		},
		touchRing(e){
			canvaRing.showToolTip(e, {
				format: function (item) {
					return item.name + ':' + item.data 
				}
			});
		},
			
	}
}
</script>

<style>
page{
	background: #111943;
	padding: 30rpx 0;
}
.schoolNum .title{
	padding-left: 40rpx;
	color: #E6E5E5;
	font-size:16px;
	line-height: 40px;
	background: #2D355F;
}
.schoolNum .studentNum-con{
	text-align: center;
	height: 180rpx;
	line-height: 180rpx;
	background: #111943;
}
.schoolNum .studentNum-con .studentNum{
	font-size: 40px;
	color: #18ADFF;
}
.schoolNum .studentNum-con .studentNum text{
	color: #E6E5E5;
	font-size: 14px;
	margin-left: 4rpx;
}

.studentClass {
	padding: 20rpx 20rpx 50rpx 20rpx;
	background: #2D355F;
}
.studentClass .student-item:last-child{
	border-right: none;
}
.studentClass .student-item{
	border-right:2px solid #43496C;
	width: 200rpx;
	display: inline-block;
	margin: 10rpx;
}
.studentClass .student-item .item-title{
	font-size: 22px;
	color: #18ADFF;
	text-align: center;
}
.studentClass .student-item .item-classname{
	text-align: center;
	font-size: 14px;
	letter-spacing: 5rpx;
	margin-top:10rpx;
	color: #E6E5E5;
	width: 100%;
	text-overflow: ellipsis;
}
.leaveNum{
	display: flex;
	width: 100%;
	justify-content: space-evenly;
	margin-top: 20rpx;
	margin-bottom: 20rpx;
	background: #111943;
}
.leaveNum .leaveNum-item{
	background: #2D355F;
	border-radius: 3px;
	padding: 20rpx;
	width: 180rpx;
}
.leaveNum .leaveNum-item .item-top{
	color: #E6E5E5;
	font-size: 14px;
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.leaveNum .leaveNum-item .item-top image{
	width: 8px;
}
.leaveNum .leaveNum-item .item-bottom{
	font-size: 22px;	color: #18ADFF;
	text-align: center;
	margin-top: 10rpx;
}
.studentTemperature{
	margin-bottom: 20rpx;
}
.studentTemperature .title{
	padding-left: 40rpx;
	color: #E6E5E5;
	font-size:16px;
	line-height: 40px;
	background: #2D355F;
}
.studentTemperature .temperature-con{
	width: 100%;
	height: 500rpx;
}

.studentLocation .title{
	padding-left: 40rpx;
	color: #E6E5E5;
	font-size:16px;
	line-height: 40px;
	background: #2D355F;
}
.studentLocation .location-con{
	width: 100%;
	height: 500rpx;
}

/* 学生体温统计 */
.charts-pie{
	width: 750upx; 
	height:500upx;
}
.charts-right{
	display:flex;
	align-items:center;
	width: 250upx;
	height:500upx;
	color: #57DBFF;
}
/* 学生分布情况 */
.charts{
	width: 750upx; 
	height:500upx;
}
.qiun-padding{
	padding:2%;
	width:96%;
}
.qiun-title-bar{
	width:96%; 
	padding:10upx 2%; 
	flex-wrap:nowrap;
}
.qiun-title-dot-light{
	border-left: 10upx solid #0ea391; 
	padding-left: 10upx; 
	font-size: 32upx;
	color: #000000
}

</style>
