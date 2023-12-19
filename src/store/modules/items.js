import datestr from './datestr'
import srvreq from './srvreq'
import tables from './tables'

function getItemById( { commit }, params ) {
    
    const itemsTable = structuredClone(tables[params.tableName])
    itemsTable.filter = [ 'id = @id' ]
    itemsTable.params = [ { name: 'id', type: 'Char', value: params.id } ]

    return getAllItems( { commit }, itemsTable )


}

function getAllItems( { commit }, itemsTable ){
    
    return new Promise((resolve, reject) => {
    
        commit('itemsRequest', 'loading')

        setTimeout(() => {
            
            if (Array.isArray(itemsTable)) {
                
                commit('itemsSuccess', itemsTable)
                resolve(itemsTable)

            } else {
                
                srvreq.fetchReq('gettable', itemsTable, 'POST', (err, res) => {

                    if (err) {
                        
                        commit('itemsError', res)

                    } else if (res.success) {

                        commit(itemsTable.itemsSuccess ? itemsTable.itemsSuccess : 'itemsSuccess', res.result ? res.result : res.rows )

                    } else {
                        
                        commit('itemsError', res.message)

                    }

                    resolve(res)

                })

            }

        }, 1)


    })

}

function addItem( { commit }, itemsTable ){
    
    return new Promise((resolve, reject) => {
    
        commit('itemsRequest', 'adding')

        setTimeout(() => {
            
            srvreq.fetchReq('insertrecord', itemsTable, 'POST', (err, res) => {

                if (err) {
                    
                    commit('itemsError', res)

                } else if (res.success) {

                    commit('itemsSuccess', res.result)

                } else {
                    
                    commit('itemsError', res.message)

                }

                resolve(res)
            })

        }, 1)


    })

}

function updateItem( { commit }, itemsTable ){
    
    return new Promise((resolve, reject) => {
    
        commit('itemsRequest', 'updating')

        setTimeout(() => {
            
            srvreq.fetchReq('updaterecord', itemsTable, 'POST', (err, res) => {

                if (err) {
                    
                    commit('itemsError', res)

                } else if (res.success) {

                    commit('itemsSuccess', res.result)

                } else {
                    
                    commit('itemsError', res.message)

                }

                resolve(res)
            })

        }, 1)


    })

}


function sendEmail( { commit }, emailParams ){
    
    return new Promise((resolve, reject) => {
    
        commit('itemsRequest', 'sendind')

        setTimeout(() => {
            
            srvreq.fetchReq('send_email', emailParams, 'POST', (err, res) => {

                if (err) {
                    
                    commit('itemsError', res)

                } else if (res.success) {

                    commit('itemsRequest', res.result)

                } else {
                    
                    commit('itemsError', res.message)

                }

                resolve(res)
            })

        }, 1)


    })

}

function getAllFields({ commit }, itemsTable ) {
    
    return new Promise((resolve, reject) => {
    
        setTimeout(() => {
            
            const projectId = localStorage.getItem('project_id')

            const fields = []

            const filter = itemsTable.filter.filter

            itemsTable.table.fields.forEach(element => {
                
                if (typeof element != 'string' 
                    && (element.name.toLowerCase().indexOf(filter.toLowerCase()) != -1 
                        || element.alias.toLowerCase().indexOf(filter.toLowerCase()) != -1 )
                    && (element.name != 'project_id' || datestr.isNil(projectId)) ) {
                    fields.push(element)
                }

            });

            commit('setFields', fields)
            resolve(fields)

        }, 1)


    })

}

export default {

    getAllFields,
    getAllItems, getItemById,
    addItem, updateItem,
    sendEmail,

    state: {
        status: 'success',
        message: '',
        items: [],
        fields: []
    },

  mutations: {
    itemsRequest(state, status){
      state.status = status
    },
    itemsSuccess(state, items){
      state.status = 'success'
      state.items = items
    },
    itemsError(state, message){
      state.status = 'error'
      state.message = message + ' ' + datestr.dateToDMYHMS(new Date())
    },

    setFields(state, fields){
        state.fields = fields
      }
  

  },

  getters : {

    isItemsProcessing: state => state.status != 'success' && state.status != 'error',
    itemsMessage: state => state.message,
    allItems: state => state.items,
    allFields: state => state.fields

  }

}
