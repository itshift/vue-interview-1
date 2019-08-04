<template>
  <div class="test">
    <div class="test-header">
      <div>
      平均值: {{average}}
    </div>
    <el-button @click="update" type="primary" plain :disabled="btnDisabled">加载更多</el-button>
    </div>
    <template>
  <el-table
    :data="dataList"
    height="550"
    border
    style="width: 100%" v-loading="loading">
    <el-table-column
      prop="id"
      label="序号"
      width="180">
    </el-table-column>
    <el-table-column
      prop="data"
      label="数据"
      width="180">
    </el-table-column>
    <el-table-column
      label="时间">
      <template  slot-scope="scope">
        {{scope.row.time | formatDate}}
      </template>  
    </el-table-column>
  </el-table>
</template>

  </div>
</template>

<script>
import {formatDate} from '../formatDate' 
export default {
  name: 'test',
  data () {
    return {
      // 点击加载更多按钮是否禁用
      btnDisabled: false,
      // 是否显示加载中图标
      loading: false
    }
  },
  computed: {
    // 监听datalist数据的变化
    dataList () {
      return this.$store.state.dataList
    },
    // 平均值
    average () {
     return this.$store.getters.getAverage
    }
  },
  methods: {
    // 点击加载更多 将按钮禁用，防止用户多次点击，
    update () {
      this.loading = true; 
      this.btnDisabled = true;
      this.$store.dispatch('getDataCall').then(res =>{
        this.loading = false;
        this.btnDisabled = false;
      })
    }
  },
  created () {
    this.$store.commit('resetTestPage')
    this.$store.dispatch('getDataCall')
  },
  filters: {
    formatDate(time) {
      var date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm")
    }
  }
}
</script>

<style scoped lang="less">
.test-header{
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}
</style>
