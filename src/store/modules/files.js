import tables from './tables'
import items from "./items"

export default {

    namespaced: true,

    state: {

      ...structuredClone(items.state),

    },

    getters : {
      
      ...items.getters,

    },
    
    mutations: { 
      ...items.mutations,

    },

    actions: {
      
      getAllItems( { commit }, params ){
        
          const itemsTable = structuredClone(tables.files)
          itemsTable.top = 100
          itemsTable.order = [ 'si_level, sort_order' ]
          itemsTable.filter = params.filter
          itemsTable.params = params.params

          return items.getAllItems( { commit }, itemsTable )
          
      },

      getAllItemsForMainMenu( { commit }, params ){
        
          const itemsTable = structuredClone(tables.categories)
          itemsTable.top = 1000
          itemsTable.order = [ 'si_level, sort_order' ]
          itemsTable.filter = params.filter
          itemsTable.params = params.params

          itemsTable.itemsSuccess = 'itemsForMainMenuSuccess'

          return items.getAllItems( { commit }, itemsTable )

      },

      getAllItemsSub( { commit }, params ){
        
        const itemsTable = structuredClone(tables.categories)
        itemsTable.top = 1000
        itemsTable.order = [ 'si_level, sort_order' ]
        itemsTable.filter = params.filter
        itemsTable.params = params.params

        itemsTable.itemsSuccess = 'itemsSubSuccess'

        return items.getAllItems( { commit }, itemsTable )

    },

      getAllItemsForHierarchy( { commit }, params ){
        
        const itemsTable = structuredClone(tables.categories)
        itemsTable.top = 1000
        itemsTable.order = [ 'si_level, sort_order' ]
        itemsTable.filter = params.filter
        itemsTable.params = params.params

        itemsTable.itemsSuccess = 'itemsForHierarchySuccess'

        return items.getAllItems( { commit }, itemsTable )

    },

  },


}