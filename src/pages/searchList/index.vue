<template>
  <div>
    <div class="top" :style="{position: position}">
      <!-- 头部搜索 -->
      <div class="mysearch">
        <input class="search" type="text" v-model="key">
        <icon type="search" size="20" color="#bbb"></icon>
      </div>
      <!-- 搜索导航 -->
      <div class="searchnav">
        <div @click="changeActive(index)" class="item" :class="{ active: index === selectedIndex }" v-for="(item, index) in navList" :key="index">
          {{ item }}
        </div>
      </div>
    </div>
    <div class="bottom" :style="{marginTop: marginTop}">
      <!-- 列表数据 -->
      <div class="box" v-for="(item, index) in searchList" :key="index">
        <div class="image">
          <image :src="item.goods_small_logo" />
        </div>
        <div class="word">
          <div class="name">
            {{ item.goods_name }}
          </div>
          <div class="price">
            ￥
            <span>{{ item.goods_price }}</span>.00
          </div>
        </div>
      </div>
      <!-- 我是有底线的 -->
      <div v-if="isEnd" class="bottomLine">
        -- 我是有底线的 --
      </div>
    </div>
  </div>
</template>

<script>
// 导入自己封装的 request 文件
import myRequest from '@/utils/myrequest.js'

export default {
  data() {
    return {
      navList: ['综合', '销量', '价格'],
      // 设置激活样式
      selectedIndex: 0,
      // 搜索的关键字
      key: '',
      // 页容量
      pagesize: 6,
      // 当前页
      pagenum: 1,
      // 数据源：搜索列表
      searchList: [],
      // 将当前关键字的总数据条数保存起来
      total: -1, // 当第一次打开界面时让搜索列表的长度与 total 不一样
      // 判断底线是否显示
      isEnd: false,
      // 是否正在发送请求
      isOK: false,
      // 判断价格是否需要排序
      isSort: false,
      // 元素的定位方式
      position: 'static',
      // 元素的位置
      marginTop: '0rpx'
    }
  },
  methods: {
    changeActive(index) {
      this.selectedIndex = index
      // 给价格添加一个点击事件:
      if (index === 2) {
        this.isSort = true
        // 给数据进行排序
        this.searchList.sort((a, b) => {
          return a.goods_price - b.goods_price
        })
      }
    },
    // 接收分类页面传递过来的参数
    getSearchKey() {
      this.key = this.$root.$mp.query.key
    },
    // 获取搜索列表数据
    async getSearchList() {
      // 判断是否正在发送请求
      if (this.isOK === true) {
        // 说明正在发送请求，不允许再次请求
        wx.showToast({
          title: '加载中',
          duration: 2000
        })
        return;
      }
      // 判断： 数据是否加载完（判断 searchList 的长度是否与 total 相同）
      if (this.searchList.length === this.total) {
        // 添加一个提示框（说明数据已经加载完成）
        wx.showToast({
          title: '数据加载完毕',
          icon: 'success',
          duration: 2000
        })
        this.isEnd = true
        return; // 结束当前逻辑
      }
      // 将开关设置为 true
      this.isOK = true // 有请求正在执行

      // 每次请求延迟 2s
      // 开启加载动画
      wx.showLoading()
      // 发送请求得到数据
      let res = await myRequest({
        url: 'api/public/v1/goods/search',
        method: 'GET',
        // 请求的参数： query, pagenum, pagesize
        data: {
          query: this.key,
          pagesize: this.pagesize,
          pagenum: this.pagenum
        }
      })
      // 保存数据
      let { message, meta } = res.data
      // 判断
      if (meta.status === 200) {
        // 数据源
        // this.searchList = message.goods
        // 不能赋值，应该进行拼接: 使用展开运算符
        //                      老的数据            新的数据
        this.searchList = [...this.searchList, ...message.goods]
        // 判断是否需要排序：
        if (this.isSort) {
          this.searchList.sort((a, b) => a.goods_price - b.goods_price)
        }
        // 保存总数据条数
        this.total = message.total
      }
      // 将开关重置为 false
      this.isOK = false // 请求已经结束
      // 关闭加载动画
      wx.hideLoading()
      // 隐藏下拉的背景
      wx.stopPullDownRefresh()
    }
  },
  // 下拉触底事件
  onReachBottom() {
    // 将当前页改为下一页
    this.pagenum += 1
    // 加载下一页的数据
    this.getSearchList()
  },
  // 上拉刷新
  onPullDownRefresh() {
    this.selectedIndex = 0
    this.pagenum = 1
    this.searchList = []
    this.total = -1
    this.isEnd = false
    this.isOK = false
    this.isSort = false
    // 重新加载数据
    this.getSearchList()
  },
  // 页面的滚动事件
  onPageScroll(event) {
    // console.log(event.scrollTop)
    // 改变 搜索与导航 的定位：
    //  处于顶部时 static 定位
    //  处于非顶部时 fixed 定位
    // 改变 下方元素的 margin-top
    //  处于顶部时 0
    //  处于非顶部时 220rpx
    if (event.scrollTop === 0) {
      this.position = 'static'
      this.marginTop = '0rpx'
    } else {
      this.position = 'fixed'
      this.marginTop = '220rpx'
    }
  },
  mounted() {
    // 接收搜索关键字
    this.getSearchKey()
    // 接收搜索的数据
    this.getSearchList()
  }
}
</script>

<style lang="less" type="text/less">
.top {
  top: 0px;
  left: 0px;
  width: 100%;
}

.mysearch {
  height: 120rpx;
  padding: 30rpx 16rpx;
  box-sizing: border-box;
  background-color: #eeeeee;
  position: relative;
  .search {
    width: 100%;
    height: 60rpx;
    background-color: #fff;
    padding-left: 50rpx;
    box-sizing: border-box;
  }
  icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 20rpx;
  }
}

.searchnav {
  height: 100rpx;
  line-height: 100rpx;
  text-align: center;
  display: flex;
  background: #fff;
  .item {
    flex: 1;
    &.active {
      color: #eb4450;
    }
  }
}

.box {
  height: 261rpx;
  border-top: 1px solid #eeeeee;
  padding: 30rpx 20rpx;
  box-sizing: border-box;
  display: flex;
  .image {
    image {
      width: 200rpx;
      height: 200rpx;
    }
  }
  .word {
    padding-left: 25rpx;
    .name {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      color: #333;
    }
    .price {
      color: #eb4450;
      margin-top: 55rpx;
      span {
        font-size: 26px;
      }
    }
  }
}

.bottomLine {
  text-align: center;
  color: #ccc;
  line-height: 150rpx;
}
</style>
