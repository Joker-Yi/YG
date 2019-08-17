<template>
    <div class="topsearch">
        <div class="search">
            <icon type="search" size="20"></icon>
            <span>搜索</span>
        </div>
    </div>
</template>

<script>
export default {

}
</script>

<style lang="less">
.topsearch {
    position: fixed;
    top: 0;
    left: 0;
    padding: 20rpx 16rpx;
    height: 100rpx;
    width: 100%;
    background-color: #ff2d4a;
    box-sizing: border-box;
    z-index: 999;
    .search {
        width: 100%;
        height: 60rpx;
        background-color: #fff;
        border-radius: 5px;
        color: #bbb;
        display: flex;
        justify-content: center;
        align-items: center;
        span {
            font-size: 16px;
        }
    }
}
</style>
