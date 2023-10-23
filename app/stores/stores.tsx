import { Instance, SnapshotIn, flow, types, IType } from "mobx-state-tree"
import { createContext, useContext, useEffect, useState } from "react"
import { withSetPropAction } from "./withSetPropAction";
import { TableSchema } from "../models";
import { number } from "mobx-state-tree/dist/internal";
import { makeObservable, runInAction, reaction, observable } from "mobx"

const GenericRow = types.maybe(
    types.map(
        types.maybeNull(types.union(types.string, types.number, types.map(types.string), types.array(types.maybeNull(types.string))))
    )
)

const EbavelFieldDefinition = types.model({
    id: types.string,
    type: types.union(types.literal('integer'), types.literal('datetime'), types.literal('text'), types.literal('image'), types.literal('document')),
    primareKey: types.optional(types.boolean, false),
    label: types.maybe(types.string),
    required: types.optional(types.boolean, false),
    system: types.optional(types.boolean, false),
})

export interface IEbavelFieldDefinition extends SnapshotIn<typeof EbavelFieldDefinition> { }

const QueryStoreModel = types
    .model("QueryStore", {
        resource: types.maybe(types.model({
            url: types.string,
            params: types.optional(types.map(
                types.maybe(types.union(types.string, types.number, types.integer))
            ), {}),
            headers: types.optional(types.map(
                types.maybe(types.string)
            ), {})

        })),
        data: types.optional(types.array(GenericRow), []),
        isLoading: types.optional(types.boolean, false),
        columns: types.array(EbavelFieldDefinition),
        total: types.optional(types.integer, 0),
        pageInfo: types.optional(types.model({
            currentPage: types.integer,
            pageSize: types.integer,
            totalRows: types.optional(types.integer, 0),
            totalPages: types.optional(types.integer, 0),
        }), {
            currentPage: 1,
            pageSize: 50,
        }),
    })
    .views((self) => ({
        get schema() {
            return new TableSchema(self.columns)
        }
    }))
    .actions(withSetPropAction)
    .actions((store) => ({
        fetch: flow(function* () {
            if (store.resource) {
                // <- note the star, this is a generator function!
                store.isLoading = true
                try {

                    const extraParams = {
                        '$currentPage': store.pageInfo.currentPage,
                        '$pageSize': store.pageInfo.pageSize,
                    }

                    const extraHeaders = {
                        'Content-Type': 'application/json',
                    }

                    // ... yield can be used in async/await style
                    const response = yield fetch(store.resource.url, {
                        method: "POST",
                        body: JSON.stringify({ ...store.resource.params.toJSON(), ...extraParams }),
                        headers: { ...store.resource.headers.toJSON(), ...extraHeaders }
                    });
                    const result = yield response.json();

                    store.setProp('columns', result.payload.schema)
                    store.setProp('pageInfo', result.payload.pagination['FRMW_5983F2DE'])
                    store.setProp('data', result.payload.data['FRMW_5983F2DE'])
                } catch (error) {
                    // ... including try/catch error handling
                    console.error("Failed to fetch projects", error)
                }

                store.isLoading = false
            }
        }),
        page: () => {
            return store.pageInfo.currentPage
        },
        setPage: (page: number) => {
            store.pageInfo.currentPage = page
        },
        setPageSize: (size: number) => {
            store.pageInfo.pageSize = size
        },
        setPageInfo: (pageInfo: {currentPage: number, pageSize: number}) => {
            store.pageInfo = {...store.pageInfo, ...pageInfo }
        },
        setOrderBy: (sorts: {field: string, sort: string}[]) => {
            store.resource?.params.set('$orderby', sorts.map((s) => `${s.field} ${s.sort}`).join(','))
            console.log(store.resource?.params)
        }
    }))

const EditorState = types.model({
    selected: types.model({
        id: types.maybeNull(types.string),
        name: types.maybeNull(types.string),
    })
})

interface IQueryStore extends Instance<typeof QueryStoreModel> { }

const RootStoreModel = types.model("RootStore")
    .props({
        queryStore: types.model({
            collection: types.map(QueryStoreModel)
        }).actions((self) => ({
            get: (id: string) => {
                return self.collection.get(id) || QueryStoreModel.create({})
            }
        })),
        editorState: EditorState
    })
    .actions((store) => ({
        addQueryStore(key: string, endpoint: string) {

        }
    }))

interface IRootStore extends Instance<typeof RootStoreModel> { }

const _rootStore = RootStoreModel.create({
    queryStore: {
        collection: {
            'ebavel': {
                resource: {
                    url: 'https://kpionline10.bitam.com/eBavel6_test/api/v1/fbm_bmd_0586/data/FRM_2090B3EE/FRMW_5983F2DE',
                    headers: {
                        'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJCSVRBTSJ9.JDhlSCRzWihqKGVmcUlsKGdcZSchYsKhKGooZVxucW1bb25lUUYkOGU2dHMrMiFKYSpkKS9PZC1xOXVzZTR0ckkrZCkuKHQtWzMhLW0rwqFLbS8hLCNadXJlJyMscTJnLGk1IW5kMmQtWyfCoUtpSyFLZSpkKS4obClhSGxiSDhoXWQ5ZCg2KHQtZTUjS2krwqEqdS8hLCMrwqEtWzh6ck1IZCkuKGg5ZSd0cmEpaW9sN2pvaSxpOWUraTknLGhvJkxocnA5aClpKWhdcEt0OcKhNnRyaDhpLF9MdXJ0SWpddSp0OXRMaUppKGg5JkxpKVsqaWJfOXRvbE1pOGVRJWxl.'
                    },
                    //params: {api_token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJCSVRBTSJ9.KT1qTSl4YS1vLWprdk5xLWxjaiwmZyctby1qY3N2cmJ0c2pWSyk9ajt5eDA3Jk9mL2kuNFRpMnY-enhqOXl3TjBpLjMteTJiOCYycjAnUHI0JjEoYXp3aiwoMXY3bDFuOiZzaTdpMmIsJ1BuUCZQai9pLjMtcS5mTXFnTT1tZGk-aS07LXkyajooUG4wJy96NCYxKDAnMmI9JXdSTWkuMy1tZ3ItbWRiLG0ucVJvZGFRb3QnT3p0ai5udCdNbj5pUW0-aU5uPmoxeU9xT3l0Yi9tLnoxbWR1O3kxZi9tT3lRb3dlTXl0djFtT2otemRhPG0-eT55PWpWbGNqMCloYS1vLmVPb3QnPm5kL05uZGZWZQ.'}
                },
                'pageInfo': {
                    currentPage: 1,
                    pageSize: 50,
                },
            }
        }
    },
    editorState: {
        selected: {
            id: null,
            name: null
        }
    }
})
const RootStoreContext = createContext<IRootStore>(_rootStore)
const RootStoreProvider = RootStoreContext.Provider
export const useStores = () => useContext(RootStoreContext)

/////////////////////////////////////////////////////

/*
// Definición de la interfaz
interface GenericRow {
    [key: string]: string | number | { [key: string]: string } | null;
}

// Modelo de datos para un objeto individual
class GenericRowModel {
    protected id: string = ''

    constructor(data: GenericRow) {
        makeObservable(this);
        // Inicializa las propiedades del objeto según tu estructura de datos
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                this[key] = data[key] || null;
            }
        }
    }

    public get key(): string {
        return this[this.id]
    }
}

// Object Store para almacenar y gestionar objetos
class GenericRowStore {
    protected objects = new Map<string, GenericRowModel>();
    protected id = ''
    protected endpoint = ''

    constructor() {
        makeObservable(this)
    }

    addObject(data: GenericRow) {
        const obj = new GenericRowModel(data);
        this.objects.set(obj.key, obj);
    }

    @action
    removeObject(id: string) {
        this.objects.delete(id);
    }

    @action
    clearObjects() {
        this.objects.clear();
    }

    // Otras acciones y consultas según tus necesidades
}

// Domain Store para manejar una colección de objetos
class GenericDomainStore {
    objectStore = new GenericRowStore();

    constructor() {
        makeObservable(this);
    }

    @action
    clearData() {
        this.objectStore.clearObjects();
    }

    // Otras acciones y consultas según tus necesidades
}

// Crear una instancia de Domain Store
const myDomainStore = new GenericDomainStore();

export default myDomainStore;
*/