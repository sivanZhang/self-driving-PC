<template>
	<view id="news">
		<view class="news-item" v-for="(item,index) in newsListData" :key="index" @tap="targetDetails(item.pk)">
			<view class="header">
				{{item.fields.title}}
				<text v-if="item.fields.urgency_level==1">!</text>
			</view>
			<view class="date">{{item.fields.date|dateTimeFormat}}</view>
			<rich-text class="content" :nodes="item.fields.content"></rich-text>
		</view>
	</view>
</template>

<script>
	import {
		GET_News
	} from "@/api/notice.js";
	export default {
		data() {
			return {
				newsListData: []
			};
		},
		methods: {
			targetDetails(id) {
				uni.navigateTo({
					url: "/pages/notifications/new-detail?id=" + id
				})
			}
		},
		onLoad() {
			GET_News().then(res => {
				this.newsListData = [...res.data.msg];
			});
		},
		onNavigationBarButtonTap() {
			uni.reLaunch({
				url:"/pages/home/home-page"
			})
		}
	};
</script>

<style lang="scss">
	#news {
		.news-item {
			padding: 41.666upx 64.583upx 16.666upx 41.666upx;
			border-bottom: 2.083upx solid #c8c8cc;

			.header {
				font-size: 31.25upx;
				font-weight: 600;
				position: relative;

				text {
					position: absolute;
					right: -22.916upx;
					color: #e96f6c;
				}
			}

			.date {
				color: #c8c8cc;
				font-size: 25upx;
			}

			.content {
				width: 100%;
				max-height: 133.333upx;
				overflow: hidden;
				font-size: 27.083upx;
			}
		}
	}
</style>
