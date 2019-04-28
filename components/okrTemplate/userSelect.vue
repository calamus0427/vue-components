<template>
  <div class="period">
    <div class="searchCtn">
      <el-input v-model="userRealName" placeholder="请输入用户真实姓名"></el-input>
      <el-button type="primary" size="mini" @click="search">查询</el-button>
      <el-button type="primary" size="mini" @click="reset">重置</el-button>
    </div>
    <common-table>
      <template slot="table">
        <el-table
          :data="tableData"
          ref="orderTable"
          @current-change="handleCurrentChange"
          tooltip-effect="light"
          v-loading="isListLoading"
          highlight-current-row
          :cell-style="cellStyle"
        >
          <el-table-column label="选择" width="50" center>
            <template slot-scope="scope">
              <el-radio
                class="radio"
                v-model="radio"
                :label="scope.$index"
                @change.native="getCurrentRow(scope.$index)"
                :disabled="scope.row.userEnable==1?false:true"
              >&nbsp;</el-radio>
            </template>
          </el-table-column>
          <el-table-column prop="userAccount" label="用户名" width="80" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column
            prop="userRealName"
            label="真实姓名"
            width="80"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column prop="userGender" label="性别" :formatter="formatSex" width="60"></el-table-column>
          <el-table-column
            prop="userMobile"
            label="联系电话"
            width="120"
            :show-overflow-tooltip="true"
          ></el-table-column>
        </el-table>
      </template>
      <template slot="pagination">
        <el-pagination
          background
          layout="total, prev, pager, next"
          :current-page.sync="pagination.pageNum"
          :page-size="pagination.pageSize"
          :total="pagination.total"
          @current-change="changePage"
          :pager-count="5"
        ></el-pagination>
      </template>
    </common-table>
  </div>
</template>

<script>
import { setSession, getSession } from "@/utils/session";
import { contains } from "@/utils/getObjIndex";
import CommonTable from "@/components/commonTable";
import { getUsersList } from "@/api/user";
export default {
  name: "PeriodSelect",
  components: {
    CommonTable
  },
  data() {
    return {
      period: getSession("periodData"),
      isListLoading: false,
      currentRow: null,
      radio: false,
      tableData: [],
      compony: this.$store.getters.companyId,
      componyList: this.$store.getters.orgList.filter(compony => {
        return compony.orgType == "0";
      }),
      pagination: {
        // 翻页数据
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      orgList: this.$store.getters.orgList,
      userRealName: ""
    };
  },
  props: {
    chooseUserId: {
      type: String
    },
    index: {
      type: Number
    }
  },
  mounted() {
    let obj = localStorage.getItem("userList")
      ? JSON.parse(localStorage.getItem("userList"))
      : "";
    if (
      !obj ||
      obj.pageNum !== this.pagination.pageNum ||
      obj.userAccount !== this.userAccount ||
      obj.userAccount !== ""
    ) {
      this.getList();
    } else {
      this.tableData = obj.userList;
      this.pagination.total = obj.total;
      this.pagination.pageNum = obj.pageNum;
    }
    this.radio = false;
    this.getInitChoose();
  },
  methods: {
    search(){
      this.pagination.pageNum = 1
      this.radio = false
      this.getList()
    },
    reset() {
      this.userRealName = ""
      this.pagination.pageNum = 1
      this.radio = false
      this.getList()
    },
    getList() {
      this.isListLoading = true;
      let params = {
        pageNum: this.pagination.pageNum,
        pageSize: this.pagination.pageSize,
        userRealName: this.userRealName
      }
      getUsersList(params).then(res => {
        if (!res.error) {
          this.isListLoading = false;
          this.tableData = res.item;
          this.pagination.total = res.total;
          localStorage.setItem(
            "userList",
            JSON.stringify({
              pageNum: this.pagination.pageNum,
              userList: res.item,
              userAccount: this.userAccount,
              total: res.total
            })
          );
          this.getInitChoose();
        }
      });
    },
    getInitChoose() {
      console.log("this.chooseUserId",this.chooseUserId)
      if (this.chooseUserId) {
        let index = this.tableData.findIndex(
          item => item.userUuid == this.chooseUserId
        );
        if (index > -1) {
          this.radio = index;
        }
      }
    },
    changePage(pageNum) {
      this.pagination.pageNum = pageNum;
      this.radio = false
      this.selectRow = []
      this.getList()
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (row.userEnable == 0) {
        return "cursor:not-allowed";
      } else {
        return "";
      }
    },
    handleCurrentChange(val) {
      console.log("val",val)
      if (val && val.userEnable == 1) {
        this.currentRow = val;
        let index = this.tableData.findIndex(
          item => item.userUuid == this.currentRow.userUuid
        )
        if (index > -1) {
          this.radio = index;
        }
        if (this.index !== undefined) {
          this.$emit("sendData", {
            index: this.index,
            val: JSON.parse(JSON.stringify(val))
          });
        } else {
          this.$emit("sendData", {
            index: null,
            val: JSON.parse(JSON.stringify(val))
          })
        }
      }
    },
    getCurrentRow(index) {
      console.log(index);
    },
    clearChoose() {
      this.radio = false;
      this.currentRow = null;
      this.$refs.orderTable.setCurrentRow();
    },
    formatSex(row) {
      return row.userGender == 1 ? "男" : row.userGender == 0 ? "女" : "未知";
    }
  }
};
</script>
<style scoped>
.searchCtn {
  display: flex;
  align-items: center;
}
.searchCtn .el-input {
  width: 180px;
  margin-right: 10px;
}
</style>


