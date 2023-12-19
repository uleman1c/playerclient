<script setup>
import TheWelcome from '../components/TheWelcome.vue'
</script>

<template>
  <main>
    <h5>{{ allFiles }}</h5>
  </main>
</template>

<script>

import { mapGetters, mapActions } from "vuex";

export default {

    computed: {
        ...mapGetters( { allFiles: 'files/allItems' } ), 
    },

    methods: {

        ...mapActions( { getAllFiles: 'files/getAllItems' } ), 

/*         onMainMenuClick(url){

            window.location.href = url

        }
 */    },

    mounted(){

      document.title = 'PlayerNK'

        const params = {
          filter: [ 'main_menu.is_deleted = @is_deleted' ],
          params: [ { name: 'is_deleted', type: 'Bit', value: false } ]
        }

        this.getAllFiles( params ).then((res) => {

/*             const params = {
            filter: [ 'is_deleted = @is_deleted and (si_level = 2 or si_level = 3)' ],
            params: [ { name: 'is_deleted', type: 'Bit', value: false } ]
            }

            this.getAllCategories( params ).then((res) => {

            })
 */
        })


    }


}

</script>
