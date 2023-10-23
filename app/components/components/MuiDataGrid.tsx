import { useCallback, useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridRowsProp, GridSortModel } from '@mui/x-data-grid';
import {
  randomCreatedDate,
  randomTraderName,
  randomUpdatedDate,
} from '@mui/x-data-grid-generator';

import { useStores } from '../../stores/stores';
import { observer } from 'mobx-react-lite';
import { toJS } from "mobx";
import { TableSchema } from '../../models';
import { columnGroupsStateInitializer } from '@mui/x-data-grid/internals';

function MuiDataGrid() {

  const rootStore = useStores()
  // datasource es una `clase` definida en mobx-state-tree y queryStore es su espacio de almacenamiento en donde se guardaran diferentes datasource
  const datasource = rootStore.queryStore.get('ebavel')

  // El datasource tiene propiedades que se pueden modificar para obtener la pagina actual y elementos por pagina
  const [paginationModel, setPaginationModel] = useState({
    page: (datasource.pageInfo.currentPage - 1),
    pageSize: datasource.pageInfo.pageSize,
  });

  // Realizamos el primer fetch de datos por default en la pagina uno.
  useEffect(() => {
    datasource.fetch()
  }, [datasource])

  useEffect(() => {
    // Cada que el datagrid modifique la pagina o elementos por pagina modificamos el datasource para obtener de nuevo los datos
    if((paginationModel.page != (datasource.pageInfo.currentPage - 1)) || (paginationModel.pageSize != datasource.pageInfo.pageSize)) {
      datasource.setPageInfo({
        currentPage: paginationModel.page + 1,
        pageSize: paginationModel.pageSize,
      })
      datasource.fetch()
    }
  }, [paginationModel.page, paginationModel.pageSize])

  // Igual con el ordenamiento de las columnas, vamos al backend para ordenar la coleccion completa de datos
  const handleSortModelChange = useCallback((sortModel: GridSortModel) => {
    datasource.setOrderBy(sortModel.map(({field, sort}) => ({field, sort: `${sort}`})))
    datasource.fetch()
  }, []);

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <DataGrid
        // datasource.data es reactivo y hace render al complemento cada que cambian sus datos ya que es un objeto de mobx
        rows={toJS(datasource.data)}
        columns={datasource.schema.getGridColDef()}
        paginationMode="server"
        sortingMode="server"
        getRowId={(row) => datasource.schema.getRowId(row)}
        rowCount={datasource.pageInfo.totalRows}
        loading={datasource.isLoading}
        pageSizeOptions={[20, 50, 100]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        onSortModelChange={handleSortModelChange}
        disableColumnFilter
      />
    </div>
  );
}

export default observer(MuiDataGrid)