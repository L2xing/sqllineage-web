<template>
  <div>
    <canvas
      id="myCanvas"
      width="1000"
      height="600"
      style="border: 1px solid #000000"
    >
    </canvas>
  </div>
</template>

<script>
import { MouseEvent, TableData, FieldData, Data } from "@/api/sqlline";

export default {
  name: "sqllineage",
  data() {
    return {
      c: null,
      ctx: null,
      tables: new Array(),
      edges: new Array(),
      GLOBAL_OBJS: new Array(0),
      me: new MouseEvent(),
    };
  },
  methods: {
    // 开始绘画
    startPaint() {
      let c = this.c;
      let ctx = this.ctx;
      setInterval(() => {
        // 清空画步
        this.c.width = this.c.width;
        // 画表
        this.tables.forEach((t) => {
          t.paint(this.ctx);
        });
        // 画线
        this.edges.forEach((d) => {
          d.paint(this.ctx);
        });
      }, 1000 / 60);
    },

    //获取位置
    getLocation(x, y) {
      let canvas = this.c;
      var bbox = canvas.getBoundingClientRect();
      return {
        x: (x - bbox.left) * (canvas.width / bbox.width),
        y: (y - bbox.top) * (canvas.height / bbox.height),
      };
    },
    doMouseMove(event) {
      var loc = this.getLocation(event.pageX, event.pageY);
      if (this.me.status == 0) {
        var curV = null;
        for (let i = 0; i < this.tables.length; i++) {
          if (curV != null) {
            break;
          }
          let fs = this.tables[i].fields;
          for (let k = 0; k < fs.length; k++) {
            let field = fs[k];
            if (
              loc.x > field.x &&
              loc.x < field.x + field.width &&
              loc.y > field.y &&
              loc.y < field.y + field.height
            ) {
              curV = field;
              break;
            }
          }
        }
        this.me.push(curV);
      } else if (this.me.status == 1) {
        console.log("移动");
        let chax = loc.x - this.me.mousedownLoc.x;
        let chay = loc.y - this.me.mousedownLoc.y;
        this.GLOBAL_OBJS.forEach((obj) => {
          let curloc = this.me.oldVLocs.get(obj.id);
          obj.x = curloc.x + chax;
          obj.y = curloc.y + chay;
        });
      }
    },

    doMouseDown(event) {
      console.log("按下");
      var loc = this.getLocation(event.pageX, event.pageY);
      this.me.status = 1;
      this.me.mousedownLoc = loc;
      this.GLOBAL_OBJS.forEach((obj) => {
        this.me.oldVLocs.set(obj.id, { x: obj.x, y: obj.y });
      });
    },

    doMouseUp(event) {
      this.me.status = 0;
      var loc = this.getLocation(event.pageX, event.pageY);
      this.me.oldVLocs.clear();
    },
    setData(tables, edges) {
      this.tables = new Array();
      this.edges = new Array();
      this.GLOBAL_OBJS = new Array(0);
      let data = new Data(tables[0]);
      for (let i = 1; i < tables.length; i++) {
        data.addTable(tables[i]);
      }
      for (let i = 0; i < edges.length; i++) {
        data.addEdge(edges[i].o, edges[i].t);
      }
      data.draw(this.tables, this.edges, this.GLOBAL_OBJS);
    },
    mock() {
      let stu = new TableData(1, "student");
      let stu_name = new FieldData(2, "name");
      let stu_age = new FieldData(3, "age");
      stu.addField(stu_age);
      stu.addField(stu_name);

      let user = new TableData(21, "user");
      let user_name = new FieldData(22, "username");
      let user_password = new FieldData(23, "password");
      user.addField(user_name);
      user.addField(user_password);

      let userInfo = new TableData(31, "userinfo");
      let userinfo_age = new FieldData(32, "age");
      let userInfo_like = new FieldData(33, "like");
      userInfo.addField(userinfo_age);
      userInfo.addField(userInfo_like);

      let classe = new TableData(41, "classe");
      let classe_name = new FieldData(42, "name");
      classe.addField(classe_name);

      let check = new TableData(51, "check");
      let check_age = new FieldData(52, "age");
      let check_name = new FieldData(53, "name");
      check.addField(check_age);
      check.addField(check_name);

      let tables = [stu, user, userInfo, classe, check];
      let edges = [
        { o: user_name, t: stu_name },
        { o: userinfo_age, t: stu_age },
        { o: stu_name, t: classe_name },
        { o: stu_name, t: check_name },
        { o: stu_age, t: check_age },
      ];
      return { tables, edges };
    },
  },
  mounted() {
    this.c = document.getElementById("myCanvas");
    this.c.addEventListener("mousemove", this.doMouseMove, false);
    this.c.addEventListener("mousedown", this.doMouseDown, false);
    this.c.addEventListener("mouseup", this.doMouseUp, false);
    this.ctx = this.c.getContext("2d");
    this.startPaint();
    let data = this.mock();
    this.setData(data.tables, data.edges);
  },
};
</script>

<style>
</style>
       