import conn from './connections.js'

function fetchReq(req, data, method, callback){

    const url = conn.addr + req

    if (method == 'GET') {
        
        fetch(url, { method: method })
            .then(response => response.json() )
            .then(json => {

                callback(false, json)

            })
            .catch(error => {
                callback(true, error)
            })

    } else {
        
        fetch(url, { method: method, headers: {
            "Content-Type": "application/json"
        }, body: JSON.stringify(data) })
            .then(response => response.json())
            .then(json => {

                callback(false, json)


            })
            .catch(error => {
                callback(true, error)
            })

    }



}

export default {

    fetchReq

}