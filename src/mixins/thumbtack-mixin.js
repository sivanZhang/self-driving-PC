export default {
    data() {
        return {
            isInner: true, //控制drawer是否在父元素内显示
        }
    },
    methods: {
        //监听页面滚动的回调，实现 抽屉的图钉效果
        $_handleScroll() {
            let DrawerParent = this.$refs['drawer-parent'] //drawer的父元素
            if (DrawerParent.getBoundingClientRect().top <= 0) { //父元素距离视口顶部 等于或者小于0时
                this.isInner = false;
            } else {
                this.isInner = true;
            }
        },
    },
    mounted() { //DOM渲染完成
        //监听页面滚动时间 并调用this.$_handleScroll
        window.addEventListener("scroll", this.$_handleScroll);
    },
    destroyed() {
        //组件销毁时 注销滚动监听
        window.removeEventListener("scroll", this.$_handleScroll);
    },
}