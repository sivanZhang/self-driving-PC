<template>
	<view class=""><button type="primary" @tap="open">点击我触发</button></view>
</template>

<script>
export default {
	data() {
		return {};
	},
	methods: {
		open() {
			uni.connectSocket({
				url: 'wss://levy.chidict.com/ws/chat/ddd/'
			});
			uni.onSocketOpen(function(res) {
				console.log(res,"-----------");
				console.log('WebSocket连接已打开！');
			});
		}
	}
};
</script>

<style></style>
