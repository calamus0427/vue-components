<template>
  <div class="transfer">
    <div class="left">
      <ul>
        <li @click="chooseItem(item,index)" v-for="(item,index) in left" :key="index">
          {{item.value}}-{{item.checked}}
        </li>
      </ul>
    </div>
    <div class="button">
      <button @click="goLeft()">←</button>
      <button @click="goRight()">→</button>
    </div>
    <div class="right">
       <ul>
        <li @click="choose(item)" v-for="(item,index) in right" :key="index">
          {{item.value}}
        </li>
      </ul>
    </div>

  </div>
</template>

<script>
export default {
  name: 'transfer',
  data () {
    return {
      left:[{
        'key':'1',
        'value':'text1',
        'disable':false
      },{
        'key':'2',
        'value':'text2',
        'disable':false
      },{
        'key':'3',
        'value':'text3',
        'disable':false
      },{
        'key':'4',
        'value':'text4',
        'disable':false
      }],
      right:[],
      chooseList:[]
    }
  },
  mounted(){
    this.initData()
  },
  methods:{
    initData(){
      this.left = this.left.map((item,index,arr)=>{
        var tmp = {
          'key':item.key,
          'value':item.value,
          'disable':item.disable,
          'checked': item.checked || false
        }
        return tmp
      })
      console.log(this.left)
    },
    chooseItem(item,index){
      console.log(item.key)
      item.checked = !item.checked
      if(item.checked){
        if(this.chooseList.indexOf(item)==-1){
                this.chooseList.push(item)
        }
      }else{
        this.chooseList = this.chooseList.filter((obj)=>{
          return obj.key !== item.key
        })
      }
    },
    goLeft(){
    },
    goRight(){
      console.log(this.chooseList)
      this.right = this.right.concat(this.chooseList).reverse();
      this.chooseList = [] ;
    }
  }
}
</script>

<style scoped>
.transfer{
display:block;
}
.left,.right{
    display: inline-block;
    width: 180px;
    height: 210px;
    font-size: 12px;
    vertical-align: middle;
    position: relative;
    padding-top: 35px;
    border:1px solid #ccc;
}
.button{
    display: inline-block;
    overflow: hidden;
    margin: 0 16px;
    vertical-align: middle;
}
.button button{
  display:block;
      margin-bottom: 12px;
}
</style>
