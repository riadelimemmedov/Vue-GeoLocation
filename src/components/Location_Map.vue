<template>
    <div>
        <div style="display:flex;align-items:center;justify-content:space-between;">
            <div>
                <h1>Your Coordinates</h1>
                <p>Latitude : <span class="coordinate_degree">{{myCoordinates.lat.toFixed(4)}}</span>
                    &nbsp;
                Longitude : <span class="coordinate_degree">{{myCoordinates.lng.toFixed(4)}}</span> </p>
            </div>
            <div style="text-align:center">
                <h1>Map Coordinates</h1>
                <p>Latitude : <span class="coordinate_degree">{{mapCoordinates.lat}}</span>
                    &nbsp;
                Longitude : <span class="coordinate_degree">{{mapCoordinates.lng}}</span> </p>
            </div>
        </div>

        <!-- !GmapMap -->
        <!-- Latitude => north or south -->
        <!-- Longitude => east or west -->

        <GmapMap
            :center="myCoordinates"
            :zoom="7"
            style="width:640px;height:360px;margin:32px auto;border:1px solid grey;border-radius:5px;padding:15px;margin-top:70px"
            ref="mapRef"
            @dragend="handleDrag"
        ><!-- Render google map -->
        </GmapMap>


        <!-- Button trigger modal -->
        <button type="button" @click="getSearchHistoryLocation()" class="btn btn-info" data-toggle="modal" data-target="#exampleModal">
            Get History Search
        </button> 

        <!-- Modal -->
        <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel text-muted">Search History</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <table class="table">
                            <thead>
                                <tr>
                                    <th scope="col" class="text-danger">Id</th>
                                    <th scope="col" class="text-danger">Latitude</th>
                                    <th scope="col" class="text-danger">Longitude</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(map,index) in allSearchedMaps" :key="index">
                                    <th scope="row">{{index}}</th>
                                    <td class="text-muted">{{map.lat}}</td>
                                    <td class="text-muted">{{map.lng}}</td>
                                </tr>
                            </tbody>
                            </table>
                </div>
                <div class="modal-footer">
                    <div class="container">
                        <div class="row">
                            <div class="col">
                                <button type="button" @click="cleanMapCache()" class="btn btn-danger text-light btn-block">Clear History</button>
                            </div>
                            <div class="col">
                                <button type="button" class="btn btn-dark text-light btn-block" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    import Vue from 'vue'
    export default{
        data(){
            return{
                map:null,
                zoom:7,
                allSearchedMaps:null,
                myCoordinates:{
                    lat:0,//!enlik
                    lng:0//!uzunluq
                },
            }
        },
        methods:{
            handleDrag(){
                //get center and zoom level.store in localstorage
                let center = {
                    lat : this.map.getCenter().lat(),//!Returns the coordinates at the center of the map. Returns => Geometry.Point
                    lng : this.map.getCenter().lng()
                }
                let zoom = this.map.getZoom()//!Returns the current zoom level of the map.Returns => Number
                window.localStorage.setItem('center',JSON.stringify(center))
                window.localStorage.setItem('zoom',Number(zoom))
                this.$store.dispatch('updateLocation',center)
            },
            getSearchHistoryLocation(){
                var stateData = this.$store.state.allSearchedMaps
                if(stateData.length<=10){
                    this.allSearchedMaps=stateData
                }
                else if(stateData.length>10){
                    this.allSearchedMaps=stateData.slice(0,11)
                }
                else{
                    console.log('not found stateData')
                }
            },
            cleanMapCache(){
                // this.$store.state.allSearchedMaps = null
                console.log('Succsersefully clean cache ')
                this.$store.dispatch('cleanLocation')
                this.allSearchedMaps = null
            }
        },
        created(){//!work when open components
            //If user save center data.Used instead of default value
            //console.log(process.env.VUE_APP_GOOGLEMAPAPIKEY) //location data in .env file
            //console.log(process.env)

            if(window.localStorage.getItem('center')){
                this.myCoordinates = JSON.parse(window.localStorage.getItem('center'));
            }
            else{
                //get users coordinates when opened browser by users or if user don't save coordinates to localStorage
                this.$getLocation({})
                .then((coordinates)=>{
                    this.myCoordinates = coordinates
                })
                .catch((err)=>{
                    console.log(err);
                    Vue.notify({
                        title: 'Permisson',
                        text: 'Turn on permision in browser'
                    })
                })
            }
            
            //if user save zoom value to localStorage
            if(window.localStorage.getItem('zoom')){
                this.zoom = parseInt(window.localStorage.getItem('zoom'))
            }
            
        },
        mounted(){//!work after open components 
            //add the map to a data object
            //?If you need to gain access to the Map
            this.$refs.mapRef.$mapPromise.then(map=>this.map=map)
        },
        computed:{
            mapCoordinates(){
                if(!this.map){
                    return{
                        lat:0,
                        lng:0
                    }
                }
                else{
                    return{
                        lat:this.map.getCenter().lat().toFixed(4),//!Returns the coordinates at the center of the map. Returns => Geometry.Point
                        lng:this.map.getCenter().lng().toFixed(4)
                    }
                }
            }
        }
    }
</script>

<style scoped>
    .coordinate_degree{
        color:red
    }
</style>