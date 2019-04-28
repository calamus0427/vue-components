<template>
  <div>
    <div class="searchCtn">
      <el-input v-model="userRealName" placeholder="请输入用户真实姓名"></el-input>
      <el-button type="primary" size="mini" @click="search">查询</el-button>
      <el-button type="primary" size="mini" @click="reset">重置</el-button>
    </div>
    <common-table style="height:100%" table-class="tableClass">
      <template slot="table">
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%;"
          @select="selectRows"
          @select-all="selectRows"
          :row-key="getRowKeys"
        >
          <el-table-column
            type="selection"
            :reserve-selection="true"
            width="55"
            :selectable="selectable"
          ></el-table-column>
          <el-table-column prop="userAccount" label="用户名" width="80" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column
            prop="userRealName"
            label="真实姓名"
            width="80"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column prop="userGender" label="性别" :formatter="formatSex" width="60"></el-table-column>
          <el-table-column prop="userMobile" label="联系电话" width="120" :show-overflow-tooltip="true"></el-table-column>
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
import { contains } from "@/utils/getObjIndex";
import { getUserByCompany } from "@/api/user";
import CommonTable from "@/components/commonTable";
export default {
  data() {
    return {
      isListLoading: false,
      tableData: [],
      pagination: {
        // 翻页数据
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      getRowKeys(row) {
        return row.userUuid;
      },
      userRealName: "",
      waitDelRow: null,
      isReenter: false
    };
  },
  components: {
    CommonTable
  },
  props: {
    chooseData: {
      type: Array
    },
    index: {
      type: Number
    },
    companyId: {
      type: String
    }
  },
  watch: {
    companyId(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.pagination.pageNum = 1;
        this.getList();
      }
    }
  },
  mounted() {
    let selectedRows = this.$refs.multipleTable.store.states.selection;
    if (
      selectedRows.length == 0 &&
      (this.chooseData && this.chooseData.length !== 0)
    ) {
      this.isReenter = true;
    }
    this.getList();
  },
  methods: {
    search() {
      this.pagination.pageNum = 1;
      this.radio = false;
      this.getList();
    },
    reset() {
      this.userRealName = "";
      this.pagination.pageNum = 1;
      this.radio = false;
      this.getList();
    },
    getList() {
      let params = {
        userOrgUuid: this.companyId,
        pageNum: this.pagination.pageNum,
        pageSize: this.pagination.pageSize,
        userRealName: this.userRealName
      };
      if (params.userOrgUuid) {
        this.isListLoading = true;
        getUserByCompany(params).then(res => {
          if (!res.error) {
            this.isListLoading = false;
            this.tableData = res.item;
            this.pagination.total = res.total;
            this.$nextTick(() => {
              this.chooseData &&
                this.chooseData.length !== 0 &&
                this.rowMultipleChecked();
              this.waitDelRow && this.clearChoose();
            });
          }
        });
      }
    },
    changePage(pageNum) {
      this.pagination.pageNum = pageNum;
      this.getList();
    },
    formatSex(row) {
      return row.userGender == 1 ? "男" : row.userGender == 0 ? "女" : "未知";
    },
    rowMultipleChecked() {
      this.chooseData.forEach(item => {
        let arr = this.tableData.filter(row => {
          return row.userUuid == item.userUuid;
        });
        if (arr.length !== 0) {
          this.$refs.multipleTable.toggleRowSelection(arr[0], true);
        }
      });
    },
    selectRows(selection, row) {
      let data = selection; //当前页面选中的项
      if (this.isReenter) {
        let arrs = selection.find(item => item.userUuid == row.userUuid);
        if (arrs && arrs.length !== 0) {
          //选中
          data = this.chooseData.concat(selection);
        } else {
          //取消选中
          let arr = JSON.parse(JSON.stringify(this.chooseData));
          let index = arr.findIndex(item => item.userUuid == row.userUuid);
          arr.splice(index, 1);
          data = arr;
        }
      }
      if (this.index !== undefined) {
        this.$emit("sendData", {
          index: this.index,
          val: data
        });
      } else {
        this.$emit("sendData", { index: null, val: data });
      }
    },
    clearChoose(row) {
      row = row ? row : this.waitDelRow;
      let arr = this.tableData.filter(item => {
        return row.userUuid == item.userUuid;
      });
      if (arr.length !== 0) {
        this.$refs.multipleTable.toggleRowSelection(arr[0], false);
        this.waitDelRow = null;
      } else {
        this.waitDelRow = row;
      }
    },
    selectable(row, index) {
      if (row.userEnable == 1) {
        return true;
      } else {
        return false;
      }
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
