# vue-interview


建议使用vue cli
将这个仓库克隆至你自己的github，然后从master开一个分支做开发，然后再合并至master。面试指引在网页首页。

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### 开始
使用vuex完成该需求

### 解题过程
查看mock数据结构 ，将数据进行渲染

![image](https://user-images.githubusercontent.com/29273704/62422339-92e7b180-b6e3-11e9-8af6-707f95197dfc.png)

如上（ 0-1），发现将数据直接渲染进去，id有限制，会导致key值重复，因此将id稍作改进

修改之前mock.js：
```javascript
const getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max))
}

/**
 * 生成mock数据
 * @param  {[int]} startIndex [起始index]
 * @param  {[int]} number     [数据数]
 * @return {[Promise of list of mock]}            [返回mock数据]
 */
export default (startIndex = 0, number = 20) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const mock = []
      const time = new Date()
      for (let id = startIndex; id < number; id++) {
        mock.push({
          id,
          time,
          data: getRandomInt(number)
        })
      }
      resolve(mock)
    }, 2000)
  })
}
```

修改之后：

![image](https://user-images.githubusercontent.com/29273704/62422364-fd98ed00-b6e3-11e9-8b4c-a4fb40dd69fa.png)

如上（0-2），在最外层声明_id,根据循环每次进行叠加； 

由于每次点击数据并未加载完成的时候，平均值average显示为NaN，对于用户体验来说并不好，所以在获取平均值的时候，多加一层判断

```javascript
if (state.dataList.length === 0) {
     return 0
   } else {
     return (num / state.dataList.length).toFixed(2)
  }
```

同时发现，切换tab的时候，dataList并未置空，导致用户切换回来的时候，看到的是之前的数据再push新的数据叠加起来的，当然此处需求不明确，不知道是否是需求这种效果，还是需要每次都置空datalist为新的数组，审题发现并未说明，只说默认调用mock数据即可，但切换为用户方面思考，还是多加了一层置空操作，之后测试发现，点击home再返回test，dataList清空，但是序号id并未重置，所以上述0-2图mock.js中代码还可以稍作改进；

查看发现mock.js中的id是依赖startIndex进行改变的，所以将startIndex跟number放入state中，作为可控数据传入mock.js中

修改之前mock.js：
```javascript

let _id = 0
const getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max))
}

/**
 * 生成mock数据
 * @param  {[int]} startIndex [起始index]
 * @param  {[int]} number     [数据数]
 * @return {[Promise of list of mock]}            [返回mock数据]
 */
export default (startIndex = 0, number = 20) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const mock = []
      const time = new Date()
      for (let id = startIndex; id < number; id++) {
        _id++
        mock.push({
          id: _id,
          time,
          data: getRandomInt(number)
        })
      }
      resolve(mock)
    }, 2000)
  })
}

```
修改后mock.js:
```javascript
const getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max))
}

/**
 * 生成mock数据
 * @param  {[int]} startIndex [起始index]
 * @param  {[int]} number     [数据数]
 * @return {[Promise of list of mock]}            [返回mock数据]
 */
export default (startIndex = 0, number = 20) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const mock = []
      const time = new Date()
      for (let id = startIndex; id < number + startIndex; id++) {
        mock.push({
          id,
          time,
          data: getRandomInt(number)
        })
      }
      resolve(mock)
    }, 500) // 2000毫秒耗时太久，所以改成500毫秒
  })
}
```
修改之前state: 
```javascript
state: {
    dataList: []
  },
```

修改后：
```javascript
 state: {
    startIndex: 1,
    number: 20,
    dataList: []
  }
```
同时将store.js中getDataCall函数进行改进

修改之前：
```javascript
mutations: {
    setDataList (state, data) {
      state.dataList = state.dataList.concat(data)
    },
 },
actions: {
    getDataCall (context) {
      mockGenerator().then(list => {
        context.commit('setDataList', list)
      })
    }
  }
```

修改之后：
```javascript

  mutations: {
    // 将dataList,startIndex进行重置；
    resetTestPage (state){
      state.dataList = []
      state.startIndex = 1
    },
    // 获取数组
    setDataList (state, data) {
      state.dataList = state.dataList.concat(data)
    },
    // 设置startIndex
    setStartIndex (state, number) {
      state.startIndex += number
    }
  },
  
  actions: {
    getDataCall (context) {
      const { startIndex, number } = context.state
      return new Promise((resolve, reject)=> {
          mockGenerator(startIndex, number).then(list => { 
            context.commit('setDataList', list) // 获取datalist数据
            context.commit('setStartIndex', number) 
            resolve()
          })
      })
    }
  }
```

所有数据操作都放入到actions中，配合devtools工具，使数据可追踪

![image](https://user-images.githubusercontent.com/29273704/62422570-3a1a1800-b6e7-11e9-8169-d4f118aeff11.png)

### 优化
为防止用户反复点击加载更多按钮，故将按钮多做一层禁用判断，使其在加载数据的时候，用户不可反复点击，同时给list加入loading标识，在test页面修改update函数

修改之前：
```javascript
update () {
      this.$store.dispatch('getDataCall')
    }
```
修改之后：
```javascript
  update () {
      this.loading = true; 
      this.btnDisabled = true;
      this.$store.dispatch('getDataCall').then(res =>{
        this.loading = false;
        this.btnDisabled = false;
      })
    }
```
同时将样式进行修改，由于pc端使用vue大多搭配element ui
因此将element ui引入

### 输入命令
```javascript
npm i element-ui -S
```

修改 main.js 添加下述代码

```javascript
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/display.css'

Vue.use(ElementUI)
```
使用Container 布局容器，将数据列表改为table表格，使数据更直观



