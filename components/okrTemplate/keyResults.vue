<template>
  <el-row>
    <el-col :span="24">
      <el-form-item label="关键结果">
        <div class="key-results" v-for="(results,index) in keyResultList" :key="index">
          <el-form :ref="'results'+index" :model="results" :rules="formRules">
            <el-row>
              <el-form-item label="类型" prop="resultType" label-width="80px">
                <el-radio-group v-model="results.resultType" :disabled="type=='info'">
                  <el-radio label="1">挑战</el-radio>
                  <el-radio label="2" style="margin-left: 10px;">承诺</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-row>
            <el-row>
              <el-col :span="18">
                <el-form-item
                  label="关键结果"
                  prop="keyResult"
                  :rules="formRules.keyResult"
                  label-width="80px"
                >
                  <el-input
                    v-model="results.keyResult"
                    type="textarea"
                    placeholder="请输入关键结果"
                    :autosize="{ minRows: 2, maxRows: 4}"
                    clearable
                    maxlength="200"
                    resize="none"
                    :disabled="type=='info'"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="key-results-container">
              <el-form-item label props="progressType">
                <el-radio-group
                  v-model="results.progressType"
                  @change="changeUnit(results.progressType,results,index)"
                  :disabled="type=='info'"
                >
                  <el-radio-button :label="0">常规</el-radio-button>
                  <el-radio-button :label="1">自定单位</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <div class="key-results-unit">
                <p class="input__container" v-if="results.progressType == '1'">
                  <span class="fontColor1 input__label">单位:</span>
                  <el-form-item label prop="myUnit" :rules="formRules.myUnit">
                    <el-input
                      size="mini"
                      class="xs_input_width"
                      clearable
                      v-model="results.myUnit"
                      placeholder="自定义单位"
                      :maxleng="20"
                      :disabled="type=='info'"
                    ></el-input>
                  </el-form-item>
                </p>
                <p class="input__container">
                  <span class="fontColor1 input__label">起始:</span>
                  <el-form-item
                    label
                    prop="startValue"
                    :rules="[
                        { required: true, message: '请输入起始', trigger: 'change' },
                        {
                          validator: function (rule, value, callback) {return validateStartValue(rule, value, callback,results.myUnit)},
                          trigger: 'change'
                        }
                      ]"
                  >
                    <span
                      class="disabled_label"
                      v-if="results.progressType == '0'"
                    >{{results.startValue}}</span>
                    <div v-if="results.progressType == '1'">
                      <el-input
                        size="mini"
                        clearable
                        class="xs_input_width"
                        v-model="results.startValue"
                        placeholder="起始"
                        :maxleng="20"
                        :disabled="type=='info'"
                      ></el-input>
                      <span v-if="results.myUnit" class="input_unit">{{results.myUnit}}</span>
                    </div>
                  </el-form-item>
                </p>
                <p class="input__container">
                  <span class="fontColor1 input__label">目标:</span>
                  <el-form-item
                    label
                    prop="aimValue"
                    :rules="[
                        { required: true, message: '请输入起始', trigger: 'change' },
                        {
                          validator: function (rule, value, callback) {return validateAimValue(rule, value, callback,results.myUnit)},
                          trigger: 'change'
                        }
                      ]"
                  >
                    <span
                      class="disabled_label"
                      v-if="results.progressType == '0'"
                    >{{results.aimValue}}</span>
                    <div v-if="results.progressType == '1'">
                      <el-input
                        clearable
                        size="mini"
                        class="xs_input_width"
                        v-model="results.aimValue"
                        placeholder="目标"
                        :maxleng="20"
                        :disabled="type=='info'"
                      ></el-input>
                      <span v-if="results.myUnit" class="input_unit">{{results.myUnit}}</span>
                    </div>
                  </el-form-item>
                </p>
              </div>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item
                  label="负责人"
                  prop="chargePersonName"
                  :rules="formRules.chargePersonName"
                >
                  <div class="participantCtn">
                    <div class="user_container">
                      <div class="circleSmall circleChoose" v-show="results.chargePersonName">
                        <span class="name">{{results.chargePersonName}}</span>
                        <el-input
                          type="text"
                          v-model="results.chargePersonName"
                          style="display: none;"
                        ></el-input>
                        <span class="deal">
                          <a href="javascript:;" @click.stop="delRsAuthor(index)">
                            <i class="el-icon-delete"></i>
                          </a>
                        </span>
                      </div>
                      <el-popover
                        placement="right"
                        width="400"
                        trigger="click"
                        @show="handleIsShow(index,'charge')"
                        @hide="handleIsShow(index,'charge')"
                      >
                        <user-select
                          v-if="isShowArr[index].showCharge"
                          :index="index"
                          @sendData="getRsAuthor"
                          :chooseUserId="results.chargePersonId"
                          :ref="'author'+index"
                        ></user-select>
                        <el-button slot="reference" type="text" v-show="type!=='info'">选择</el-button>
                      </el-popover>
                    </div>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="参与人员" prop="userList">
                  <div class="participantCtn">
                    <div class="user_container">
                      <div
                        class="circleSmall circleChoose"
                        v-for="(item,i) in results.userList"
                        :key="i"
                      >
                        <span class="name">{{item.userRealName}}</span>
                        <span class="deal">
                          <a href="javascript:;" @click.stop="delUserMui(index,item,i)">
                            <i class="el-icon-delete"></i>
                          </a>
                        </span>
                      </div>
                      <el-popover
                        placement="right"
                        width="400"
                        trigger="click"
                        @show="handleIsShow(index,'user')"
                        @hide="handleIsShow(index,'user')"
                      >
                        <user-select-mul
                          v-if="isShowArr[index].showUserList"
                          :ref="'userList'+index"
                          @sendData="getUserListMui"
                          :index="index"
                          :chooseData="results.userList"
                          :companyId="companyId"
                        ></user-select-mul>
                        <div
                          class="circleSmall dottedCircle"
                          slot="reference"
                          v-show="type!=='info'"
                        >
                          <i class="el-icon-plus"></i>
                        </div>
                      </el-popover>
                    </div>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="4" v-show="type!=='info'">
                <el-button type="text" @click.stop="delResult(results,index)">
                  <i class="fdddfont icon-delete"></i>删除关键结果
                </el-button>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div v-show="type!=='info'" class="add-key-results">
          <el-row>
            <el-col :span="20">
              <el-button type="text" @click="addResult">
                <i class="el-icon-plus"></i>添加关键结果
              </el-button>
            </el-col>
            <!-- <el-col :span="4">总权重:{{totalweight}}%</el-col> -->
          </el-row>
        </div>
      </el-form-item>
    </el-col>
  </el-row>
</template>
<script>
// validate
import Validator from "@/utils/extendValidate/extendValidate";
//publice
import userSelect from "@/components/okrTemplate/userSelect";
import userSelectMul from "@/components/okrTemplate/userSelectMul";
const krObj = {
  keyResult: "",
  weight: "", //权重
  currentProgress: "", //当前进度
  progressType: "0", //进度类型  0 完成/未完成  1其他
  fatherKeyResultId: "", //关联的上级关键结果id
  myUnit: "", //自定义 单位
  startValue: "未完成", //起始值
  aimValue: "完成", // 目标值
  chargePersonId: "", //负责人
  userList: [],
  resultType: "1"
};
export default {
  name: "",
  components: {
    userSelect,
    userSelectMul
  },
  data() {
    return {
      formRules: {
        keyResult: [
          { required: true, message: "请输入关键结果", trigger: "change" }
        ],
        weight: [
          { required: true, message: "请输入权重", trigger: "change" },
          {
            validator: Validator.normalNumber,
            message: "请输入正整数",
            trigger: "change"
          },
          {
            validator: function(rule, value, callback) {
              if (Number(value) < 0 || Number(value) > 100) {
                callback(new Error("请输入0-100的数字"));
              } else {
                callback();
              }
            },
            trigger: "change"
          }
        ], //权重
        myUnit: [
          { required: true, message: "请输入自定义单位", trigger: "change" }
        ],
        chargePersonName: [
          { required: true, message: "请选择负责人", trigger: "change" }
        ]
      },
      keyResultList: [],
      isShowArr: []
    };
  },
  props: {
    krList: {
      type: Array
    },
    fatherId: {
      type: String
    },
    type: {
      type: String
    },
    companyId: {
      type: String
    }
  },
  watch: {
    //关键结果列表
    krList: {
      handler(newVal, oldVal) {
        if (newVal && newVal.length !== 0) {
          this.keyResultList = JSON.parse(JSON.stringify(newVal));
        } else {
          this.keyResultList.push(JSON.parse(JSON.stringify(krObj)));
        }
        this.isShowArr = [];
        this.keyResultList.forEach(item => {
          this.isShowArr.push({
            showCharge: false,
            showUserList: false
          });
        });
      },
      deep: true
    }
  },
  mounted() {
    if (this.krList && this.krList.length !== 0) {
      this.keyResultList = JSON.parse(JSON.stringify(this.krList));
    } else {
      this.keyResultList.push(JSON.parse(JSON.stringify(krObj)));
    }
    this.isShowArr = [];
    this.keyResultList.forEach(item => {
      this.isShowArr.push({
        showCharge: false,
        showUserList: false
      });
    });
  },
  // computed: {
  //   totalweight() {
  //     var numberList = [];
  //     this.keyResultList &&
  //       this.keyResultList.forEach(item => {
  //         if (item.weight) {
  //           numberList.push(parseFloat(item.weight));
  //         }
  //       });
  //     if (numberList.length > 0) {
  //       return numberList.reduce(function(preValue, curValue, index, array) {
  //         return preValue + curValue;
  //       });
  //     } else {
  //       return 0;
  //     }
  //     return 0;
  //   }
  // },
  methods: {
    //添加关键结果相关操作
    addResult() {
      this.keyResultList.push(JSON.parse(JSON.stringify(krObj)));
      this.isShowArr.push({
        showCharge: false,
        showUserList: false
      });
    },
    delResult(item, index) {
      this.keyResultList.splice(index, 1);
      this.isShowArr.splice(index, 1);
    },
    changeUnit(results, item, index) {
      if (results == "0") {
        //default
        this.keyResultList[index].startValue = "未完成";
        this.keyResultList[index].aimValue = "完成";
        this.keyResultList[index].myUnit = "";
      } else if (results == "1") {
        //myUnit
        this.keyResultList[index].startValue = "0";
        this.keyResultList[index].aimValue = "100";
        this.keyResultList[index].myUnit = "%";
      } else {
        this.keyResultList[index].startValue = "";
        this.keyResultList[index].aimValue = "";
        this.keyResultList[index].myUnit = "%";
      }
    },
    doSubmit(resolveAll, rejectAll) {
      let newArr = [];
      let _self = this;
      this.keyResultList.forEach((item, index) => {
        checkForm("results" + index);
      });
      function checkForm(refName) {
        let result = new Promise((resolve, reject) => {
          _self.$refs[refName][0].validate(valid => {
            if (valid) {
              resolve();
            } else {
              reject();
            }
          });
        });
        newArr.push(result);
      }
      Promise.all(newArr)
        .then(() => {
          resolveAll({
            validateState: true,
            // totalweight: this.totalweight,
            krlist: this.keyResultList
          });
        })
        .catch(() => {
          rejectAll(1231);
        });
    },
    validateStartValue(rule, value, callback, unit) {
      if (value && unit == "%") {
        let rg100 = /^((\d{1,2}(\.\d{1,2})?))$/;
        if (!rg100.test(value)) {
          callback(new Error("请输入 0.00-99.00 的数字"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    },
    validateAimValue(rule, value, callback, unit) {
      if (value && unit == "%") {
        let rg100 = /^((\d{1,2}(\.\d{1,2})?)|100|100.0|100.00)$/;
        if (!rg100.test(value)) {
          callback(new Error("请输入 0.00-100.00 的数字"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    },
    getRsAuthor(val) {
      this.keyResultList.splice(
        val.index,
        1,
        Object.assign({}, this.keyResultList[val.index], {
          chargePersonId: val.val.userUuid,
          chargePersonName: val.val.userRealName
        })
      );
    },
    delRsAuthor(index) {
      this.keyResultList.splice(
        index,
        1,
        Object.assign({}, this.keyResultList[index], {
          chargePersonId: "",
          chargePersonName: ""
        })
      );
      this.$refs["author" + index][0] &&
        this.$refs["author" + index][0].clearChoose();
    },
    handleIsShow(index, type) {
      let obj = {},
        key;
      if (type == "user") {
        key = "showUserList";
      } else {
        key = "showCharge";
      }
      obj[key] = !this.isShowArr[index][key];
      this.isShowArr.splice(
        index,
        1,
        Object.assign({}, this.isShowArr[index], obj)
      );
    },
    getUserListMui(data) {
      let newArr = [];
      data.val.forEach(item => {
        newArr.push({
          userUuid: item.userUuid,
          userRealName: item.userRealName
        });
      });
      //重复添加校验
      let hash = {};
      newArr = newArr.reduceRight((item, next) => {
        hash[next.userUuid]
          ? ""
          : (hash[next.userUuid] = true && item.push(next));
        return item;
      }, []);
      this.keyResultList.splice(
        data.index,
        1,
        Object.assign({}, this.keyResultList[data.index], {
          userList: newArr
        })
      );
    },
    delUserMui(index, item, i) {
      this.keyResultList[index].userList.splice(i, 1);
      this.isShowArr[index].showUserList &&
        this.$refs["userList" + index][0].clearChoose(item);
    }
  }
};
</script>
<style lang="scss" scoped>
.xs_input_width {
  width: 120px;
}
.fontColor1 {
  color: #888;
}
.mr_r_10 {
  margin-right: 1rem;
}
.fontColor2 {
  color: #aaa;
}
.el-input-group__append,
.el-input-group__prepend {
  padding: 0 4px !important;
}
.input__container {
  display: flex;
  margin-left: 1rem;
  span {
    margin-right: 8px;
  }
  .disabled_label {
    color: #c0c4cc;
    cursor: not-allowed;
  }
  .input_unit {
    font-size: 0.8rem;
    color: #777777;
    padding-left: 5px;
  }
}
.key-results {
  border-bottom: 1px dashed orange;
  background-color: #f2f2f2;
  padding: 1rem 0rem 1.5rem 1rem;
  .el-form-item {
    margin-bottom: 0px !important;
    margin-top: 0px !important;
  }
  .el-row {
    margin-top: 1rem;
  }
  .key-results-container {
    display: flex;
    align-items: center;
    .key-results-unit {
      display: flex;
    }
  }
}
.add-key-results {
  background-color: #f2f2f2;
  padding: 1rem 0rem 1.5rem 1rem;
}
</style>
