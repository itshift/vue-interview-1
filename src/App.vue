<template>
  <div id="app">
    <el-container>
     <div class="sidebar-container">
        <el-scrollbar>
        <transition>
          <el-aside width="210px" height="100%">
            <el-menu>
              <el-menu-item>
                <router-link to="/">Home</router-link>
              </el-menu-item>
              <el-menu-item>
                <router-link to="/test">Test</router-link>
              </el-menu-item>
            </el-menu>
          </el-aside>
        </transition>
      </el-scrollbar>
     </div>
      <el-container class="main-container">
        <el-header class="elHeader">
          <!-- <img alt="Vue logo" src="./assets/logo.png" id="logo"> -->
        </el-header>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style lang="less">
//初始化浏览器样式
@import "./assets/css/reset";
#logo {
  width: 50px;
  height: 50px;
}
.el-menu {
  background-color: rgb(48, 65, 86) !important;
  color: #ffffff;
  border: none;
  .el-menu-item:hover {
    background-color: #1f2d3d !important;
  }
}
a {
  color: #ffffff;
  display: block;
  width: 100%;
  height: 100%;
}
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
}

body > .el-container {
  margin-bottom: 40px;
}
.sidebar-container {
  -webkit-transition: width 0.28s;
  transition: width 0.28s;
  width: 210px !important;
  background-color: #304156;
  height: 100%;
  position: fixed;
  font-size: 0;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1001;
  overflow: hidden;
}
.el-main{
  min-height: calc(100vh - 60px);
}
.main-container{
  min-height: 100%;
  transition: margin-left .28s;
  margin-left: 210px;
  position: relative;
}
</style>
