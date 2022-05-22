<template>
  <div id="database">
    <el-row :gutter="20">
      <el-col :xs="9" :sm="6" :md="5" :lg="4" :xl="4">
        <div class="head-container">
          <el-input
            v-model="criteria"
            clearable
            size="small"
            placeholder="输入Host名称搜索"
            prefix-icon="el-icon-search"
            class="filter-item"
          />
        </div>
        <el-tree
          :data="data"
          :props="defaultProps"
          @node-click="handleNodeClick"
        />
      </el-col>
      <el-col :xs="15" :sm="18" :md="19" :lg="20" :xl="20">
        <div>
          <el-input
            style="width: 200px"
            v-model="criteria"
            placeholder="模糊查询"
          ></el-input>
          <el-button type="primary">搜索</el-button>
          <el-button type="success">重置</el-button>
          <el-button type="primary" icon="el-icon-edit" circle> </el-button>
        </div>
        <div id="graph"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import upload from "@/components/upload.vue";

import {
  instancePage,
  databaseByInstanceId,
  graphInstances,
  graphDatabases,
  graphDatasets,
  graphColumns,
  graphGetCategory,
} from "@/api/index.js";

import * as echarts from "echarts/core";
import { TooltipComponent, LegendComponent } from "echarts/components";
import { GraphChart } from "echarts/charts";
import { LabelLayout } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([
  TooltipComponent,
  LegendComponent,
  GraphChart,
  CanvasRenderer,
  LabelLayout,
]);

export default {
  name: "database",
  components: {},
  data() {
    return {
      instanceIds: new Set(),
      databaseIds: new Set(),
      datasetIds: new Set(),
      columnIds: new Set(),
      flag: true,
      graph: {
        nodes: [],
        links: [],
        categories: ["Instance", "Database", "Dataset", "VDataset", "Column"],
      },
      criteria: "",
      data: [],
      defaultProps: {
        children: "children",
        label: "label",
        type: "type",
      },
    };
  },
  components: {
    upload,
  },
  methods: {
    handleNodeClick(data, node) {
      console.log(123);
      if (data.type === "instance") {
        this.databaseByInstanceIndex(data.id, node.data);
        this.fetchDatabases(data.id);
      } else if (data.type === "database") {
        this.fetchDatasets(data.id);
      }
    },
    databaseByInstanceIndex(id, node) {
      let instance = node;
      instance.children = [];
      databaseByInstanceId(id)
        .then((res) => {
          let databases = res.data;
          for (let i = 0; i < databases.length; i++) {
            let database = databases[i];
            instance.children.push({
              id: database.ID,
              label: database.Name,
              children: [],
              type: "database",
            });
          }
        })
        .catch((res) => {});
    },
    fetchInstances() {
      this.data = [];
      let page = {
        criteria: "",
        size: 10,
        current: 1,
        total: 0,
      };
      instancePage(page).then((res) => {
        let data = res.data;
        let records = data.records;
        for (let i = 0; i < records.length; i++) {
          let instance = records[i];
          this.data.push({
            id: instance.ID,
            label: instance.Host + ":" + instance.Port,
            children: [],
            type: "instance",
          });
        }
      });
    },
    drawChart(graph) {
      const option = {
        tooltip: {},
        legend: [
          {
            data: graph.categories.map(function (a) {
              return a.name;
            }),
          },
        ],
        series: [
          {
            name: "Sqllineage",
            type: "graph",
            layout: "force",
            data: graph.nodes,
            links: graph.links,
            categories: graph.categories,
            roam: true,
            label: {
              show: true,
              position: "right",
              formatter: "{b}",
            },
            labelLayout: {
              hideOverlap: true,
            },
            scaleLimit: {
              min: 0.4,
              max: 2,
            },
            lineStyle: {
              color: "source",
              curveness: 0.3,
            },
            force: {
              repulsion: 50,
            },
          },
        ],
      };
      const myChart = echarts.init(document.getElementById("graph")); // 图标初始化
      myChart.setOption(option); // 渲染页面
      //随着屏幕大小调节图表
      if (this.flag) {
        const _this = this;
        myChart.on("click", function (params) {
          _this.clickGraphNode(params);
        });
        this.flag = false;
      }
      window.addEventListener("resize", () => {
        myChart.resize();
      });
    },
    fetchGraphInstances() {
      this.graph.nodes = [];
      this.graph.links = [];
      graphInstances()
        .then((res) => {
          for (let i = 0; i < res.data.length; i++) {
            this.graph.nodes.push(res.data[i]);
          }
          setTimeout(this.drawChart(this.graph), 500);
        })
        .catch((res) => {});
    },
    fetchDatabases(id) {
      if (this.instanceIds.has(id)) {
        return;
      }
      this.instanceIds.add(id);
      let preStr = "instance_" + id;
      graphDatabases(id)
        .then((res) => {
          for (let i = 0; i < res.data.length; i++) {
            this.graph.nodes.push(res.data[i]);
            this.graph.links.push({
              source: preStr,
              target: res.data[i].id,
            });
          }
          setTimeout(this.drawChart(this.graph), 500);
        })
        .catch((res) => {});
    },
    fetchDatasets(id) {
      if (this.databaseIds.has(id)) {
        return;
      }
      this.databaseIds.add(id);
      let preStr = "database_" + id;
      graphDatasets(id)
        .then((res) => {
          for (let i = 0; i < res.data.length; i++) {
            this.graph.nodes.push(res.data[i]);
            this.graph.links.push({
              source: preStr,
              target: res.data[i].id,
            });
          }
          setTimeout(this.drawChart(this.graph), 500);
        })
        .catch((res) => {});
    },
    fetchColumns(id) {
      if (this.datasetIds.has(id)) {
        return;
      }
      this.datasetIds.add(id);
      let preStr = "dataset_" + id;
      console.log(1);
      graphColumns(id)
        .then((res) => {
          for (let i = 0; i < res.data.length; i++) {
            this.graph.nodes.push(res.data[i]);
            this.graph.links.push({
              source: preStr,
              target: res.data[i].id,
            });
            setTimeout(this.drawChart(this.graph), 500);
          }
        })
        .catch((res) => {});
    },
    fetchCategories() {
      graphGetCategory().then((res) => {
        this.graph.categories = [];
        for (let i = 0; i < res.data.length; i++) {
          this.graph.categories.push({
            name: res.data[i],
          });
        }
        setTimeout(this.drawChart(this.graph), 500);
      });
    },
    clickGraphNode(params) {
      console.log(params);
      switch (params.data.type) {
        case "Instance":
          break;
        case "Database":
          this.fetchDatasets(params.data.value);
          break;
        case "Dataset":
        case "VDataset":
          this.fetchColumns(params.data.value);
          break;
        case "Column":
          break;
      }
    },
  },
  created() {
    this.fetchInstances();
  },
  mounted() {
    this.fetchGraphInstances();
    this.fetchCategories();
  },
};
</script>

<style>
#pages {
  margin-top: 10px;
}
#graph {
  width: 100%;
  height: 718px;
}
</style>
