// canvas utils
/**
 * 画圆角矩形
 * */
CanvasRenderingContext2D.prototype.DrawORect = function (
  x = 0,
  y = 0,
  width = 100,
  height = 100,
  r = 0,
  color = "#3f3f3f",
  filled = false
) {
  let oldstrokeStyle = this.strokeStyle;
  let oldfillStyle = this.fillStyle;
  this.beginPath();
  this.moveTo(x + r, y);
  this.lineTo(x + width - r, y);
  this.arcTo(x + width, y, x + width, y + r, r);
  this.lineTo(x + width, y + height - r);
  this.arcTo(x + width, y + height, x + width - r, y + height, r);
  this.lineTo(x + r, y + height);
  this.arcTo(x, y + height, x, y + height - r, r);
  this.lineTo(x, y + r, x + r, y);
  this.arcTo(x, y, x + r, y, r);
  this.fillStyle = color;
  this.fill();
  this.stroke();
  this.strokeStyle = oldstrokeStyle;
  this.fillStyle = oldfillStyle;
};

/**
 * 画箭头
 * */
CanvasRenderingContext2D.prototype.DrawLine = function (
  x = 0,
  y = 0,
  x2 = 0,
  y2 = 0,
  color = "#3f3f3f"
) {
  let oldstrokeStyle = this.strokeStyle;
  let oldfillStyle = this.fillStyle;
  this.beginPath();

  this.moveTo(x, y);
  this.lineTo(x + 10, y);
  this.lineTo(x2 - 10, y2);
  this.lineTo(x2, y2);
  this.strokeStyle = color;
  this.stroke();
  this.strokeStyle = oldstrokeStyle;
  this.fillStyle = oldfillStyle;
};

// 自定义对象区
// 实体层
export class Obj {
  constructor(id=0, x = 0, y = 0, width = 0, height = 0) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  paint(c) {}

  mouseout() {}
  mouseover() {}
}

export class Table extends Obj {
  constructor(id, x, y, name) {
    let width = 280;
    let height = 33;
    super(id, x, y, width, height);
    this.name = name;
    this.fields = new Array(0);
  }
  paint(c) {
    // 画矩形
    c.DrawORect(this.x, this.y, this.width, this.height, 3);
    // 画标题
    this.drawName(c);
    // 画字段
    this.drawFields(c);
  }

  drawName(c) {
    let oldFont = c.font;
    let oldTextAlign = c.textAlign;
    let oldFillStyle = c.fillStyle;

    c.font = "17px Comic Sans MS";
    c.fillStyle = "#FFFFFF";
    c.textAlign = "center";
    c.fillText(this.name, this.x + this.width / 2, this.y + 20);

    c.font = oldFont;
    c.textAlign = oldTextAlign;
    c.fillStyle = oldFillStyle;
  }

  drawFields(c) {
    for (let field of this.fields) {
      field.paint(c);
    }
  }

  addField(field) {
    let x = this.x;
    let y = this.y + 30;
    let length = this.fields.length;
    y = length * 20 + y;
    field.x = x + 3;
    field.y = y;
    this.fields.push(field);
    this.height += 20;
  }
}

export class Field extends Obj {
  constructor(id, x, y, name) {
    let width = 274;
    let height = 20;
    super(id, x, y, width, height);
    this.name = name;
    this.initStyle();
    this.upEdges = new Set();
    this.downEdges = new Set();
  }

  paint(c) {
    this.drawRect(c);
    this.drawName(c);
  }

  drawRect(c) {
    let oldFillStyle = c.fillStyle;
    c.fillStyle = this.backgroudColor;
    c.fillRect(this.x, this.y, this.width, this.height);
    c.fillStyle = oldFillStyle;
  }

  drawName(c) {
    let oldFont = c.font;
    let oldTextAlign = c.textAlign;
    let oldFillStyle = c.fillStyle;

    c.font = "15px Comic Sans MS";
    c.fillStyle = this.fontColor;
    c.textAlign = "center";
    c.fillText(this.name, this.x + this.width / 2, this.y + 15);

    c.font = oldFont;
    c.textAlign = oldTextAlign;
    c.fillStyle = oldFillStyle;
  }

  mouseout() {
    console.log(this.name + "失去焦点");
    this.initStyle();
    this.upEdges.forEach(edge =>{
      edge.initStyle()
      edge.obj1.initStyle();
    })
    this.downEdges.forEach(edge =>{
      edge.initStyle()
      edge.obj2.initStyle()
    })
  }

  mouseover() {
    console.log(this.name + "获取焦点");
    this.choseStyle();
    this.upEdges.forEach(edge =>{
      edge.choseStyle()
      edge.obj1.choseStyle();
    })
    this.downEdges.forEach(edge =>{
      edge.choseStyle()
      edge.obj2.choseStyle()
    })
  }

  initStyle() {
    this.backgroudColor = "#FFFFFF";
    this.fontColor = "#000000";
  }

  choseStyle() {
    this.backgroudColor = "#d8d5c4";
    this.fontColor = "#733832";
  }
}

export class Edge {
  constructor(obj1, obj2) {
    this.obj1 = obj1;
    this.obj2 = obj2;
    obj1.downEdges.add(this)
    obj2.upEdges.add(this)
    this.color = "#3f3f3f";
  }

  paint(c) {
    let locs = this.getLocs();
    c.DrawLine(locs.x1, locs.y1, locs.x2, locs.y2, this.color);
  }

  getLocs() {
    let x1 = this.obj1.x + this.obj1.width;
    let y1 = this.obj1.y + this.obj1.height / 2;
    let x2 = this.obj2.x;
    let y2 = this.obj2.y + this.obj2.height / 2;
    return { x1, y1, x2, y2 };
  }

  initStyle() {
    this.color = "#000000";
  }

  choseStyle() {
    this.color = "#d8d5c4";
  }
}

function GetEdgeWithFileds(field1, field2) {
  return new Edge(x1, y1, x2, y2);
}

// 实体自定义事件
export class MouseEvent {
  constructor() {
    // 实现鼠标悬停效果
    this.old = null;
    this.cur = null;

    // 实现鼠标拖拽能力
    this.mousedownLoc = { x: 0, y: 0 };
    this.oldVLocs = new Map();

    // status:
    // 0 无状态，可以监听悬浮
    // 1 画布拖拽，全局进行对画布的拖拽
    this.status = 0;
  }

  push(v) {
    if (v === this.cur) {
      return;
    }
    this.old = this.cur;
    this.cur = v;
    if (this.old != null) {
      this.old.mouseout();
    }
    if (this.cur != null) {
      this.cur.mouseover();
    }
  }
}

// DEBUG 数据区

export class Data {
  constructor(td) {
    this.node = new Map();
    this.edge = new Set();
    this.middle = td;
    this.upNodes = new Set();
    this.downNodes = new Set();
  }

  addTable(td) {
    this.node.set(td.id, td);
    td.fields.forEach((field) => {
      this.node.set(field.id, field);
    });
  }

  addEdge(f1, f2) {
    if (f1.tid == this.middle.id) {
      // downNodes
      let table = this.node.get(f2.tid);
      this.downNodes.add(table);
    } else if (f2.tid == this.middle.id) {
      // upNodes
      let table = this.node.get(f1.tid);
      this.upNodes.add(table);
    }
    this.edge.add({ oid: f1.id, tid: f2.id });
  }

  draw(tables, edges, GLOBAL_OBJS) {
    let x = 20;
    let y = 20;
    // upNodes
    this.upNodes.forEach((table) => {
      let t = table.getTable(x, y);
      y += t.height + 50;
      tables.push(t);
    });

    // middle
    x += 380;
    y = 20;
    let middle = this.middle.getTable(x, y);
    tables.push(middle);

    // downNodes
    x += 380;
    y = 20;
    this.downNodes.forEach((table) => {
      let t = table.getTable(x, y);
      y += t.height + 50;
      tables.push(t);
    });

    this.edge.forEach((e) => {
      let f1 = null;
      let f2 = null;
      tables.forEach((t) => {
        t.fields.forEach((tf) => {
          if (tf.id == e.oid) {
            f1 = tf;
          } else if (tf.id == e.tid) {
            f2 = tf;
          }
        });
      });

      let newEdge = new Edge(f1, f2);
      edges.push(newEdge);
    });

    tables.forEach(table =>{
      GLOBAL_OBJS.push(table)
      table.fields.forEach(f =>{
       GLOBAL_OBJS.push(f)
      })
    })
  }
}

export class TableData {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.fields = new Set();
  }

  addField(fd) {
    fd.tid = this.id;
    this.fields.add(fd);
  }

  getTable(x, y) {
    let table = new Table(this.id, x, y, this.name);
    this.fields.forEach((field) => {
      let f = new Field(field.id, 0, 0, field.name);
      table.addField(f);
    });
    return table;
  }
}

export class FieldData {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.tid = -1;
  }
}