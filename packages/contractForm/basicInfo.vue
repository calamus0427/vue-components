<template>
  <el-form inline ref="contractForm" :model="contractForm" validate label-width="100px">
    <h3>合同信息:</h3>
    <el-row>
      <el-col :span="7">
        <el-form-item label="合同编号" prop="contractNumber">
          <el-input v-model="contractForm.contractNumber" :disabled="true" maxlength="50"/>
        </el-form-item>
      </el-col>
      <el-col :span="7">
        <el-form-item label="合同签署地" prop="signAddress">
          <el-input v-model="contractForm.signAddress" maxlength="50"/>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="14">
        <el-form-item label="分公司名称" prop="headerContent">
          <span>上海星和宅配家居服务有限公司-</span>
          <el-input v-model="contractForm.headerContent" style="width:auto;" maxlength="50"/>
        </el-form-item>
      </el-col>
    </el-row>
    <h3>甲方信息:</h3>
    <el-row>
      <el-col :span="7">
        <el-form-item label="甲方" prop="companyNameA">
          <el-select
            v-model="contractForm.companyNameA"
            filterable
            allow-create
            default-first-option
            @change="partABChange(1)"
            placeholder="选择甲方信息">
            <el-option
              v-for="(item,index) in partAInfo"
              :key="index+'p'"
              :label="item.companyName"
              :value="item.companyName">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="7">
        <el-form-item label="联系人" prop="contactPersonA">
          <el-input v-model="contractForm.contactPersonA" maxlength="50"/>
        </el-form-item>
      </el-col>
      <el-col :span="7">
        <el-form-item label="电话" prop="contactPhoneA">
          <el-input v-model="contractForm.contactPhoneA"/>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="7">
        <el-form-item label="地址" prop="companyAddressA">
          <el-input v-model="contractForm.companyAddressA" maxlength="50"/>
        </el-form-item>
      </el-col>
      <el-col :span="7">
        <el-form-item label="传真" prop="faxA">
          <el-input v-model="contractForm.faxA" maxlength="50"/>
        </el-form-item>
      </el-col>
      <el-col :span="7">
        <el-form-item label="email" prop="emailA">
          <el-input v-model="contractForm.emailA" type="email"/>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="7">
        <el-form-item label="邮政编码" prop="postcodeA">
          <el-input v-model="contractForm.postcodeA" maxlength="50"/>
        </el-form-item>
      </el-col>
    </el-row>
    <h3>乙方信息:</h3>
    <el-row>
      <el-col :span="7">
        <el-form-item label="乙方" prop="companyNameB">
          <el-select
            v-model="contractForm.companyNameB"
            filterable
            allow-create
            clearable
            default-first-option
            placeholder="选择乙方信息">
            <el-option
              v-for="(item,index) in partBInfo"
              :key="index+'q'"
              :label="item.companyName"
              :value="item.companyName">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="7">
        <el-form-item label="联系人" prop="contactPersonB">
          <el-input v-model="contractForm.contactPersonB" maxlength="50"/>
        </el-form-item>
      </el-col>
      <el-col :span="7">
        <el-form-item label="电话" prop="contactPhoneB">
          <el-input v-model="contractForm.contactPhoneB"/>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="7">
        <el-form-item label="地址" prop="companyAddressB">
          <el-input v-model="contractForm.companyAddressB" maxlength="50"/>
        </el-form-item>
      </el-col>
      <el-col :span="7">
        <el-form-item label="传真" prop="faxB">
          <el-input v-model="contractForm.faxB"/>
        </el-form-item>
      </el-col>
      <el-col :span="7">
        <el-form-item label="email" prop="emailB">
          <el-input v-model="contractForm.emailB" type="email"/>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="7">
        <el-form-item label="邮政编码" prop="postcodeB">
          <el-input v-model="contractForm.postcodeB" maxlength="50"/>
        </el-form-item>
      </el-col>
    </el-row>
    <h3>合作方式:</h3>
    <el-row>
      <el-col :span="7">
        <el-form-item label="签约品牌" prop="brands">
          <el-select
            v-model="contractForm.brands"
            multiple
            filterable
            allow-create
            clearable
            default-first-option
            @remove-tag="removeBrand"
            placeholder="输入签约品牌按回车确认">
            <el-option
              v-for="(item,index) in []"
              :key="index+'a'"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="7">
        <el-form-item label="配装地区" prop="transInstallArea">
          <el-cascader
            ref="cascader"
            :options="countryOptions"
            v-model="contractForm.transInstallArea"
            change-on-select
            :props="countryProps"
          ></el-cascader>
        </el-form-item>
      </el-col>
      <el-col :span="10">
        <el-form-item label="保证金" prop="deposit">
          <el-input v-model="contractForm.deposit">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
  import countryTree from './country_tree.json'
  import {getSession} from "@/utils/session";
  import { queryPartABInfo } from '@/api/order'
  const provinceTree = countryTree.children

  export default {
    name: "basicInfo",
    data () {
      return {
        contractForm: {

        },
        partAInfo: [],
        partBInfo: [],
        countryOptions: provinceTree,
        countryProps: {
          value: 'adcode',
          label:'name',
          children: 'children'
        },
      }
    },
    props: {
      basicInfo: {
        type: Object
      }
    },
    mounted () {
      this.getUserInfo()
    },
    watch: {

    },
    methods: {
      // 获取甲方乙方信息
      getUserInfo () {
        queryPartABInfo({warehouseUuid: getSession('warehouseUuid')}).then(res => {
          if(!res.error && res.length > 0){
            this.partAInfo = res.filter(item => {
              return item.type == 1
            })
            this.partBInfo = res.filter(item => {
              return item.type == 2
            })
          }
        })
      }
    }
 }
</script>

<style scoped>

</style>
