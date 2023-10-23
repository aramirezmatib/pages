import { GridColDef } from "@mui/x-data-grid";
import { IEbavelFieldDefinition } from "../stores/stores";


export class TableSchema {

  schema: IEbavelFieldDefinition[]
  primareKey?: IEbavelFieldDefinition

  constructor(schema?: IEbavelFieldDefinition[]) {
    this.schema = schema || []
    this.primareKey = schema?.filter((c) => c.primareKey)[0]
    console.log(`primarekey`, this.primareKey?.id)
  }

  getGridColDef(): GridColDef[] {
    return this.schema.filter((column) => !column.system).map((c) => ({
      field: c.id,
      headerName: c.label,
      valueGetter(params) {
        return params.row.get(this.field);
      },
    }))
  }

  getRowId(row: any): any {
    return this.primareKey ? row.get(this.primareKey.id) : Math.random()
  }
}