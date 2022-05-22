console.log(123)
// NodeType
const NodeType = {
    DatasetVertex: 1,
    DatabaseVertex: 2,
    ColumnVertex: 3,
    InstanceVertex: 4
}


// DirType
const DirType = {
    IN: 0,
    OUT: 1,
    BOTH: 2
}


// EdgeType
const EdgeType = {
    Table2table: 1,
    Table2column: 2,
    Column2column: 3
}


export  {
    NodeType,DirType,EdgeType
}
