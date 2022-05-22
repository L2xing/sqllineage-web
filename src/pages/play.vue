<template>
  <div id="play">
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
          :data="instances"
          :props="defaultProps"
          @node-click="handleNodeClick"
        />
      </el-col>
      <el-col :xs="15" :sm="18" :md="19" :lg="20" :xl="20">
        <el-tabs v-model="activeName">
          <el-tab-pane label="血缘展示" name="showSqlLineage">
            <!-- <div id="sqlGraph"></div> -->
            <sqllineage ref="sqllineage"></sqllineage>
          </el-tab-pane>
          <el-tab-pane label="血缘增加" name="addSqlLinage">
            <el-input
              type="textarea"
              :rows="3"
              placeholder="请输入sql（select...）"
              v-model="sql"
            >
            </el-input>
            <div style="margin-top: 20px; margin-bottom: 20px">
              <el-button type="success" @click="testSqlLineage">测试</el-button>
              <el-button type="warning" @click="reset">重置</el-button>
            </div>
            <div v-show="sqlOK">
              <el-form
                :model="ruleForm"
                :rules="rules"
                ref="ruleForm"
                label-width="100px"
                class="demo-ruleForm"
              >
                <el-form-item
                  class="inline tablename"
                  label="虚拟表名"
                  prop="tableName"
                >
                  <el-input
                    v-model="ruleForm.tableName"
                    placeholder="（必填）请输入表名"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  class="inline"
                  label="所属虚拟实例"
                  prop="instanceId"
                >
                  <el-select
                    v-model="ruleForm.instanceId"
                    placeholder="请选择所属虚拟实例"
                  >
                    <el-option
                      v-for="item in vinstances"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>

                <el-form-item class="inline">
                  <el-button type="primary" @click="addSqlLineage">
                    立即创建
                  </el-button>
                  <el-button type="info" @click="deleteSqlLineage">
                    取消
                  </el-button>
                </el-form-item>
              </el-form>
              <div id="colGraph"></div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from "echarts/core";
import { NodeType, DirType, EdgeType } from "@/api/graphNode.js";
import { TooltipComponent, LegendComponent } from "echarts/components";
import { TreeChart, GraphChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import { LabelLayout } from "echarts/features";
import sqllineage from "@/components/sqllineage";
import {MouseEvent, TableData, FieldData, Data } from "@/api/sqlline";


echarts.use([
  TooltipComponent,
  TreeChart,
  CanvasRenderer,
  LegendComponent,
  GraphChart,
  LabelLayout,
]);

import {
  instancePage,
  fetchDatasetsWithDatabaseId,
  databaseByInstanceId,
  parse,
  lineage,
  fetchVDatasets,
  graphGetCategory,
  fetchGraphNodes,
} from "@/api/index.js";
import { forEach } from "lodash";
import { Edge } from "../api/sqlline";

export default {
  data() {
    return {
      sqlOK: false,
      ruleForm: {
        tableName: "",
        uuid: "",
        instanceId: 0,
      },
      rules: {
        tableName: [
          { required: true, message: "（必填）请输入表名", trigger: "blur" },
        ],
        instanceId: [
          {
            required: true,
            message: "（必填）请选择一个虚拟实体",
            trigger: "blur",
          },
        ],
      },
      sql: "",
      activeName: "showSqlLineage",
      criteria: "",
      instances: [],
      defaultProps: {
        children: "children",
        label: "label",
        type: "type",
        value: "value",
      },
      treeData: {},
      colData: {},
      categories: [],
      vinstances: [],
      sqlLineageNodes: new Set(),
    };
  },
  components: {
    sqllineage,
  },
  mounted() {
    this.fetchCategories();
    this.fetchInstances();
  },
  methods: {
    deleteSqlLineage() {
      this.ruleForm = {
        tableName: "",
        uuid: "",
      };
      this.sqlOK = false;
    },
    addSqlLineage() {
      if (this.ruleForm.uuid === "" || this.ruleForm.tableName === "") {
        alert("请重新检验SQL！！");
        return;
      }
      lineage(this.ruleForm)
        .then((res) => {
          alert("数据血缘创建成功");
        })
        .catch((res) => {});
    },
    fetchInstances() {
      let page = {
        criteria: "",
        size: 100,
        current: 1,
        total: 0,
      };
      instancePage(page).then((res) => {
        this.instances = [];
        this.vinstances = [];
        let data = res.data;
        let records = data.records;
        for (let i = 0; i < records.length; i++) {
          let instance = records[i];
          let type;
          let label;
          if (instance.Type === "virtual") {
            type = "virtual";
            label = "virtual-" + instance.Host + ":" + instance.Port;
            this.vinstances.push({
              label: label,
              value: instance.ID,
            });
          } else {
            type = "instance";
            label = instance.Host + ":" + instance.Port;
          }
          this.instances.push({
            id: instance.ID,
            label: label,
            children: [],
            type: type,
            value: "db" + instance.ID,
          });
        }
      });
    },
    handleNodeClick(data, node) {
      if (this.activeName === "addSqlLinage") {
        this.sql = this.sql + " " + data.value;
      }
      if (data.type === "instance") {
        this.fetchDatabases(data, node.data);
      } else if (data.type === "database") {
        this.fetchDatasets(data, node.data);
      } else if (data.type === "virtual") {
        this.fetchDatabases(data, node.data);
      } else if (data.type === "dataset") {
        this.fetchDataColumn(data, node, data);
        if (this.activeName === "showSqlLineage") {
          this.fetchSqlLineage(data, node);
        }
      }
    },
    fetchDataColumn(data, node) {},
    // fetchSqlLineage(data, node) {
    //   //{nodeId, nodeType, dirType, edgeType}
    //   fetchGraphNodes(
    //     data.vertexId,
    //     NodeType.DatasetVertex,
    //     DirType.BOTH,
    //     EdgeType.Table2table
    //   )
    //     .then((res) => {
    //       if (res.code === 0) {
    //         this.sqlLineageNodes.clear();
    //         let data = {
    //           nodes: [],
    //           links: [],
    //           categories: this.categories,
    //         };
    //         console.log(123)
    //         let edges = res.data.Edges;
    //         let nodes = res.data.Nodes;

    //         nodes.forEach((node) => {
    //           if (!this.sqlLineageNodes.has(node.id)) {
    //             this.sqlLineageNodes.add(node.id);
    //             data.nodes.push({
    //               id: node.id,
    //               name: node.name,
    //               value: node.value,
    //               category: node.category,
    //               symbolSize: node.symbolSize,
    //               type: node.type,
    //             });
    //           }
    //         });
    //         edges.forEach((edge) => {
    //           data.links.push({
    //             source: edge.source,
    //             target: edge.target,
    //           });
    //         });
    //         this.drawSqlGraph(data);
    //       }
    //     })
    //     .catch((err) => {});
    // },
    fetchSqlLineage(data, node) {
      //{nodeId, nodeType, dirType, edgeType}
      let _this = this
      fetchGraphNodes(
        data.vertexId,
        NodeType.DatasetVertex,
        DirType.BOTH,
        EdgeType.Table2table
      )
        .then((res) => {
          console.log(res);
          if (res.code === 0) {
            let tables = new Array(0);
            let edges = new Array(0);
            let temp = new Map();
            res.data.tables.forEach(table =>{
              let t = new TableData(table.id, table.name)
              table.fields.forEach(f =>{
                let field =  new FieldData(f.id, f.name)
                temp.set(f.id, field)
                t.addField(field)
              })
              tables.push(t)  
            })
            res.data.fieldsEdges.forEach(edge =>{
                let f1 = temp.get(edge.origin)
                let f2 = temp.get(edge.target)
                edges.push({o:f1, t:f2})
            })
            _this.$refs.sqllineage.setData(tables, edges)
          }
        })
        .catch((err) => {});
    },
    fetchVDatasets(data, node) {
      console.log(node);
      let database = node;
      database.children = [];
      fetchVDatasets()
        .then((res) => {
          let datasets = res.data;
          for (let i = 0; i < datasets.length; i++) {
            let dataset = datasets[i];
            database.children.push({
              id: dataset.ID,
              label: dataset.Name,
              children: [],
              type: "vdataset",
              value: "db0@0.`" + dataset.Name + "`",
            });
          }
        })
        .catch((res) => {});
    },
    fetchDatasets(data, node) {
      let id = data.id;
      let database = node;
      database.children = [];
      fetchDatasetsWithDatabaseId(id)
        .then((res) => {
          let datasets = res.data;
          for (let i = 0; i < datasets.length; i++) {
            let dataset = datasets[i];
            database.children.push({
              id: dataset.ID,
              label: dataset.Name,
              children: [],
              type: "dataset",
              value: data.value + ".`" + dataset.Name + "`",
              vertexId: dataset.VertexId,
            });
          }
        })
        .catch((res) => {});
    },
    fetchDatabases(data, node) {
      let id = data.id;
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
              value: data.value + "@" + database.Name,
            });
          }
        })
        .catch((res) => {});
    },
    drawSqlGraph(data) {
      console.log(123);
      const option = {
        tooltip: {},
        legend: [
          {
            data: data.categories.map(function (a) {
              return a.name;
            }),
          },
        ],
        series: [
          {
            name: "sqlGraph",
            type: "graph",
            layout: "force",
            data: data.nodes,
            links: data.links,
            categories: data.categories,
            edgeSymbol: ["arrow"],
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
      let graphDom = document.getElementById("sqlGraph");
      const myChart = echarts.init(graphDom); // 图标初始化
      myChart.setOption(option); // 渲染页面
      window.addEventListener("resize", () => {
        myChart.resize();
      });
    },
    initColGraph(data) {
      let graph = data;
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
            edgeSymbol: ["arrow"],
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
      let graphDom = document.getElementById("colGraph");
      const myChart = echarts.init(graphDom); // 图标初始化
      myChart.setOption(option); // 渲染页面
      window.addEventListener("resize", () => {
        myChart.resize();
      });
    },
    reset() {
      this.sql = "";
      this.data = { nodes: [], links: [], categories: this.categories };
      this.initColGraph(this.data);
    },
    fetchCategories() {
      graphGetCategory().then((res) => {
        this.categories = [];
        for (let i = 0; i < res.data.length; i++) {
          this.categories.push({
            name: res.data[i],
          });
        }
        this.data = { nodes: [], links: [], categories: this.categories };
        this.initColGraph(this.data);
      });
    },
    testSqlLineage() {
      parse(this.sql)
        .then((res) => {
          if (res.code === 0) {
            console.log("解析成功");
            let data = res.data;
            let graphData = {
              nodes: [],
              links: [],
              categories: this.categories,
            };
            let preNode = "temp_table";
            graphData.nodes.push({
              id: preNode,
              name: preNode,
              value: 3,
              category: "VDataset",
              symbolSize: 20,
              type: "VDataset",
            });
            for (let i = 0; i < data.cols.length; i++) {
              let col = data.cols[i];
              graphData.nodes.push(col);
              graphData.links.push({
                source: preNode,
                target: col.id,
              });
            }
            for (let i = 0; i < data.tables.length; i++) {
              let table = data.tables[i];
              graphData.nodes.push(table);
              graphData.links.push({
                source: table.id,
                target: preNode,
              });
            }
            this.ruleForm.uuid = res.data.uuid;
            alert("SQL测试无误");
            this.sqlOK = true;
            this.initColGraph(graphData);
          }
        })
        .catch((res) => {});
    },
  },
};
</script>
<style scoped>
#treeGraph {
  width: 1080px;
  height: 718px;
}
#colGraph,
#sqlGraph {
  width: 1080px;
  height: 718px;
}
.inline {
  display: inline-block;
}
.tablename {
  width: 300px;
}
</style>
