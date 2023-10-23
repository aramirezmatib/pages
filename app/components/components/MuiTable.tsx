import { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TablePagination from '@mui/material/TablePagination';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Avatar, Skeleton } from '@mui/material';
import { isObject } from '@mui/x-data-grid/internals';

import { ISchema, useStores } from '../../stores/stores';
import { observer } from 'mobx-react-lite';


interface iRecordField {
  id: string, type: "integer" | "datetime" | "text" | "image" | "document"
  primaryKey?: boolean
  label?: string | undefined
  required?: boolean
  hidden?: boolean
}

class RecordField {
  private id: string;
  private primaryKey: boolean;
  private type: "integer" | "datetime" | "text" | "image" | "document";
  private label?: string | undefined;
  private required?: boolean;
  private hidden?: boolean;

  constructor(data: iRecordField) {
    this.id = data.id;
    this.type = data.type;
    this.label = data.label;
    this.required = data.required || false;
    this.hidden = data.hidden || false;
    this.primaryKey = data.primaryKey || false;
  }

  getId(): string {
    return this.id;
  }

  // Métodos get y set para la propiedad 'label'
  getLabel(): string | undefined {
    return this.label;
  }

  setLabel(newLabel: string | undefined): void {
    this.label = newLabel;
  }

  // Métodos get y set para la propiedad 'required'
  isRequired(): boolean {
    return this.required || false;
  }

  setRequired(isRequired: boolean): void {
    this.required = isRequired;
  }

  // Métodos get y set para la propiedad 'hidden'
  isHidden(): boolean {
    return this.hidden || false;
  }

  setHidden(isHidden: boolean): void {
    this.hidden = isHidden;
  }

  isImage(): boolean {
    return this.type == 'image';
  }
}

class TableSchema {

  schema: RecordField[]

  constructor(schema: ISchema[]) {
    this.schema = schema.map(f => new RecordField(f))
  }

  getVisibleColumns(): RecordField[] {
    return this.schema.filter((column) => !column.isHidden());
  }
}

const schema = new TableSchema([
  {
    id: "id_FRM_C71388CD",
    primareKey: true,
    type: "integer",
    hidden: true,
    required: true,
  },
  {
    id: "createdUserKey",
    type: "integer",
    hidden: true,
  },
  {
    id: "modifiedDate",
    type: "datetime",
    hidden: true,
  },
  {
    id: "FFRMS_40EF9FEF",
    label: "Nombre",
    type: "text",
    required: false,
  },
  {
    id: "FFRMS_40EF9FEF",
    label: "Foto",
    type: "image",
    required: false,
  },
  {
    id: "FFRMS_F11745DD",
    label: "Documento",
    type: "document",
    required: false,
    hidden: false,
  },
])

interface GenericRow {
  [key: string]: string | number | {
    [key: string]: string
  };
}

interface PageInfo {
  currentPage: number;
  pageSize: number;
  totalItems: number;
}

interface DataSourceResult<T> {
  pageInfo: PageInfo;
  total: number;
  loading: boolean;
  error: string | null;
  data: T[];
  schema: iRecordField[]
}

// 1. Define el hook personalizado para la solicitud de datos
function useDataSource(apiEndpoint: string, view: string): DataSourceResult<GenericRow> {
  const [data, setData] = useState([]);
  const [schema, setSchema] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(apiEndpoint, { method: "POST" });
        if (!response.ok) {
          throw new Error('Error al obtener los datos');
        }
        const result = await response.json();
        setData(result.payload.data[view] || []);
        setSchema(result.payload.schema)
        setError(null)
      } catch (error) {
        setError(error)
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [apiEndpoint]);

  //return { data, loading };

  return {
    pageInfo: { currentPage: 1, pageSize: 10, totalItems: 30 },
    total: 30,
    loading: false,
    error,
    data,
    schema
  }
}

const TableEmpty = observer(() => {
  const rootStore = useStores()
  const datasource = rootStore.queryStore.get('ebavel')

  const schema = new TableSchema(datasource.schema)
  const headers = schema.getVisibleColumns();

  const columns = headers.length
  const animation = 'wave'

  return <>
    <TableHead>
      <TableRow>
        {headers.map((column, index) => (
          <TableCell key={index}>{column.getLabel()}</TableCell>
        ))}
      </TableRow>
    </TableHead>
    <TableBody>
      {Array.from({ length: datasource?.pageInfo.pageSize }, () => null).map((c, index) => (
        <TableRow key={index}>
          {
            Array.from({ length: columns }, () => null).map((column, index) => (
              <TableCell key={index}><Skeleton animation={animation} /></TableCell>
            ))
          }
        </TableRow>
      ))
      }
    </TableBody>
  </>
})

export default observer(function MuiTable({ endpoint, view }: { endpoint: string, view: string }) {

  // const dataTest = useDataSource(endpoint, view)
  const rootStore = useStores()
  //rootStore.addQueryStore('ebavel', 'https://kpionline10.bitam.com/eBavel6_test/api/v1/fbm_bmd_0586/data/FRM_69EA2207/FRMW_00F80780?api_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJCSVRBTSJ9.ayVQNmtfR29Vb1BRXDdXb1JJUG5oTWlvVW9QSVlcWEhaWVA_NGslUCNhX3J5aDhMcU9wdj1PdFwmYl9QIWFdN3JPcHVvYXRIemh0WHJpOVh2aHNqR2JdUG5qc1x5UnNUwqFoWU95T3RIbmk5VDloOVBxT3B1b1dwTDZXTTYlU0pPJk9vI29hdFDCoWo5VHJpcWJ2aHNqcml0SCVnXTs2T3B1b1NNWG9TSkhuU3BXO1VKRzpVWmk4YlpQcFRaaTZUJk86UyZPN1QmUHNhOFc4YVpIcVNwYnNTSlsjYXNMcVM4YTpVXUs2YVpcc1M4UG9iSkckUyZhJmElUD9SSVBya05Hb1VwSzhVWmklVUpPN1VKXD9l.')

  useEffect(() => {
    rootStore.queryStore.get('ebavel')?.fetch()
  }, [])

  const datasource = rootStore.queryStore.get('ebavel')

  /*if (dataTest.error) {
    return <div>Error</div>
  }*/

  const schema = new TableSchema(datasource.schema)
  const headers = schema.getVisibleColumns();

  const handleChangePage = (event: unknown, newPage: number) => {
    datasource.setPage(newPage + 1);
  };

  return (
    <Paper sx={{ width: '100%', height: '100%', mb: 2 }}>
      <TableContainer>
        <Table sx={{  }} aria-label="simple table" stickyHeader>
          {
            datasource.data.length == 0 || datasource.isLoading ?
              <TableEmpty></TableEmpty>
              :
              <>
                <TableHead>
                  <TableRow>
                    {headers.map((column, index) => (
                      <TableCell key={index}>{column.getLabel()}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rootStore.queryStore.get('ebavel').data.map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      {headers.map((column, index) => {
                        const value = isObject(row?.get(column.getId())) ? Object.values(row?.get(column.getId())).concat() : row?.get(column.getId())
                        if (column.isImage()) {
                          return <TableCell key={index}><Avatar src={value}></Avatar></TableCell>
                        }
                        return <TableCell key={index}>{value}</TableCell>
                      })}
                    </TableRow>
                  ))}
                </TableBody></>
          }
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={parseInt(rootStore.queryStore.get('ebavel')?.pageInfo.totalRows)}
        rowsPerPage={parseInt(rootStore.queryStore.get('ebavel')?.pageInfo.pageSize)}
        page={rootStore.queryStore.get('ebavel')?.pageInfo.currentPage - 1}
        onPageChange={handleChangePage}
        onRowsPerPageChange={() => { }}
      />
    </Paper>
  );
}
)