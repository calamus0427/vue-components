<template>
  <el-table
    class="companyTable"
    :data="data"
    style="width: 100%"
    stripe
    tooltip-effect="light"
    :border="true"
  >
    <el-table-column
      prop="parentKrName"
      label="公司关键结果（KR）"
      width="300"
      :show-overflow-tooltip="true"
    ></el-table-column>
    <el-table-column prop="target" label="部门目标（O）" width="300" :show-overflow-tooltip="true"></el-table-column>
    <el-table-column prop="krlist" :label="cycleName + 'KR'" width="300" class-name="borderTd">
      <template slot-scope="scope">
        <div v-for="(item,i) in scope.row.krlist" :key="i" class="borderDiv">
          <el-tooltip effect="light" :content="item.keyResult" placement="top">
            <span>{{item.keyResult}}</span>
          </el-tooltip>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="krlist" :label="cycleName + 'KR完成情况'" class-name="borderTd" width="180">
      <template slot-scope="scope">
        <div v-for="(item,i) in scope.row.krlist" :key="i" class="borderDiv">
          <span>{{item.currentProgress=='on'?'完成':(item.currentProgress=='off'?'未完成':(item.currentProgress+item.myUnit))}}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="更新进度">
      <template slot-scope="scope">
        <el-tooltip class="item" effect="light" content="更新进度" placement="bottom">
          <el-button size="mini" round icon="el-icon-refresh" @click.stop="handleDetail(scope.row)"></el-button>
        </el-tooltip>
      </template>
    </el-table-column>
    <el-table-column prop="creatorName" label="创建者"></el-table-column>
    <el-table-column label="管理">
      <template slot-scope="scope">
        <el-tooltip class="item" effect="light" content="查看" placement="bottom">
          <el-button size="mini" round icon="el-icon-view" @click.stop="handleInfo(scope.row)"></el-button>
        </el-tooltip>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: "companyTable",
  data() {
    return {};
  },
  props: {
    data: {
      type: Array
    },
    cycleName: {
      type: String
    }
  },
  methods: {
    handleInfo(row) {
      this.$emit("handleInfo", row);
    },
    handleDetail(row) {
      this.$emit("handleDetail", row);
    }
  }
};
</script>