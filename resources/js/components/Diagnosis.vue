<template>
    <div id="content-wrapper">
        <div class="container-fluat">
            <div class="card">
                <div class="card-header">
                    <div class="row">
                        <div class="col-12">
<!--                            <strong>-->
<!--                                <router-link to="/home" class="breadcums">-->
<!--                                    <i class="nav-icon fas fa-tachometer-alt"></i>-->
<!--                                    <span>-->
<!--                                    Dashboard-->
<!--                                    <i class="right fas fa-angle-left"></i>-->
<!--                                </span>-->
<!--                                </router-link>-->
<!--                                <span class="breadcums">Diagnosis List</span>-->
<!--                            </strong>-->
                        </div>
                    </div>
                </div>
                <div class="card-body vld-parent">
                    <loading :active.sync="isLoading"
                             :can-cancel="true"
                             :on-cancel="onCancel"
                             :is-full-page="fullPage"></loading>
                    <div class="col-lg-12">
                        <div class="row">
                            <div class="col-lg-12 sadow">
                                <div class="col-lg-12">
                                    <h2 class="txt">{{ editMode ? "Update" : "Add new" }} Diagnosis</h2>
                                </div>
                                <hr/>
                                <div class="card-body">
                                    <form method="post" @submit.prevent="editMode ? update () : store()">
                                        <div class="form-group">
                                            <label>Diagnosis Name</label>
                                            <input class="form-control" type="text" id="diagnosis" name="name" v-model="name" placeholder="Diagnosis name"/>
                                            <span class="text-danger">{{diagnosisError}}</span>
                                        </div>
                                        <div class="form-group">
                                            <label>Status</label>
                                            <select class="form-control select2" style="width: 100%;" v-model="status" name="status">
                                                <option value="" disabled>Select a status</option>
                                                <option value="1">Active</option>
                                                <option value="0">Inactive</option>
                                            </select>
                                            <span class="text-danger">{{statusError}}</span>
                                        </div>
                                        <div class="form-group">
                                            <button type="submit" class="btn btn-primary btn-md float-right">{{ buttonMode ? 'Update' : 'Create' }}</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <div class="transaction-entry-field d-flex justify-content-between" style="margin-bottom: 10px">
                        <div class="d-flex">
                            <div>
                                <span class="mr-1">Show</span>
                            </div>
                            <div>
                                <select class="form-control form-control-xs selectpicker" v-model="perPage">
                                    <option value="5">5</option>
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                    <option value="75">75</option>
                                    <option value="100">100</option>
                                </select>
                            </div>
                            <div>
                                <span class="ml-1">entries</span>
                            </div>
                        </div>

                        <div class="d-flex justify-content-between">
                            <div class="d-flex"><span class="mr-1">Search:</span></div>
                            <div class="d-flex" style="margin-right: 10px;">
                                <select class="form-control" v-model="searchType">
                                    <option value="all" selected>All</option>
                                    <option value="diagnosis_name">Name</option>
                                </select>
                            </div>
                            <div class="d-flex">
                                <input type="text" class="form-control"
                                       v-if="searchType==='diagnosis_name'"
                                       v-model="search"
                                       :placeholder="searchPlaceholder">
                            </div>
                        </div>
                    </div>
                    <table class="table table-bordered">
                        <thead>
                        <tr class="align">
                            <th style="width: 10px">SN</th>
                            <th>Name</th>
                            <th>Status</th>
                            <th width="20%">Action</th>
                        </tr>
                        </thead>
                        <tbody v-if="diagnosisPages.length > 0">
                        <tr v-for="(diagnosis, index) in diagnosisPages[currentPage -1]" :key="diagnosis.id">
                            <td>{{ index+1 }}</td>
                            <td style="text-transform: capitalize">{{ diagnosis.name }}</td>
                            <td>
                                <span v-if="diagnosis.status === 1" class="badge badge-primary span">available</span>
                                <span v-if="diagnosis.status === 0" class="badge badge-danger span">Unavailable</span>
                            </td>
                            <td>
                                <button title="Edit" class="btn btn-raised btn-success btn-sm" @click="edit(diagnosis)">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button v-if="diagnosis.status === 0" title="inactive" class="btn btn-raised btn-primary btn-sm" @click="active(diagnosis)">
                                    <i class="fas fa-thumbs-up"></i>
                                </button>
                                <button v-if="diagnosis.status === 1" title="active" class="btn btn-raised btn-warning btn-sm" @click="inactive(diagnosis)">
                                    <i class="fas fa-thumbs-down"></i>
                                </button>
                                <button type="button" class="btn btn-danger btn-sm" title="Delete" @click="destroy(diagnosis, index)">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                            </td>
                        </tr>
                        </tbody>
                        <tbody v-else>
                        <tr>
                            <td colspan="7" style="background-color: darkorange" role="alert">
                                {{ message }}
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <paginate
                    v-if="pageCount > 1"
                    :page-count="pageCount"
                    v-model="currentPage"
                    :prev-text="'Prev'"
                    :next-text="'Next'"
                    :container-class="'pagination justify-content-center'"
                >
                </paginate>
            </div>
        </div>
    </div>
</template>

<script>
    // Import component
    import Loading from 'vue-loading-overlay';
    // Import stylesheet
    import 'vue-loading-overlay/dist/vue-loading.css';
    export default {
        data () {
            return {
                isLoading: false,
                fullPage: true,
                diagnoses: [],
                diagnosisPages: [],
                perPage: 10,
                pageCount: 1,
                currentPage: 1,
                message: 'Fetching diagnosis list From The Server. Please Wait.....!',
                searchType: 'all',
                search: '',
                searchPlaceholder: 'Searching...',
                buttonMode: false,
                editMode: false,
                id: '',
                name: '',
                status: '',
                diagnosisError: '',
                statusError: '',
                errorCount: 0,
            }
        },
        components: {
            Loading
        },
        watch: {
            searchType (value) {
                this.setCurrentPage(1)
                this.generatePages(this.diagnoses)
            },
            perPage (value) {
                this.setCurrentPage(1)
                this.generatePages(this.diagnoses)
            },
            search (value) {
                this.setCurrentPage(1)
                this.generatePages(this.diagnoses)
                if (this.search != '') {
                    let search = this.diagnoses.filter(d => {
                        if (d.name.indexOf(this.search) !== -1) {
                            return d
                        }
                    })
                    this.generatePages(search)
                }
            },
        },
        mounted() {
            //this.edit()
        },
        created() {
            axios.get('/show/all/diagnoses')
                .then(response => {
                    //console.log(response)
                    this.diagnoses = response.data
                    this.generatePages(this.diagnoses)

                    if (this.diagnoses.length === 0) {
                        this.message = 'Sorry! No diagnoses found.'
                    }
                })
                .catch(error => {
                    console.log(error)
                })

            // EventBus.$on('diagnosis-inserted', payload => {
            //     this.diagnoses.unshift(payload)
            //     this.generatePages(this.diagnoses)
            // })

            // EventBus.$on('diagnosis-updated', payload => {
            //     //console.log(payload)
            //     let index = this.diagnoses.findIndex(diagnosis => {
            //         return diagnosis.id === payload.id
            //     })
            //     this.diagnoses[index] = payload
            //     this.generatePages(this.diagnoses)
            // })
        },
        methods: {
            onCancel() {
                console.log('User cancelled the loader.')
            },
            diagnosis_reset_error () {
                this.errorCount = 0
                this.diagnosisError = ''
                this.statusError = ''
            },
            diagnosis_validation_error () {
                if (this.name.length === 0) {
                    this.diagnosisError = 'Please input diagnosis name'
                    this.errorCount++
                }
                if (this.status.length === 0) {
                    this.statusError = 'Please select a status'
                    this.errorCount++
                }
            },
            store () {
                this.diagnosis_reset_error()
                this.diagnosis_validation_error()
                this.isLoading = true
                axios.post('/add-new/diagnosis', {
                    name: this.name,
                    status: this.status
                })
                .then(response => {
                    if (response.status === 201) {
                        this.onCancel()
                        this.name = ''
                        this.status = ''
                        toast.fire({
                            type: 'success',
                            title: 'Diagnosis added successfully'
                        })
                        location.reload(true)
                    }
                })
                .catch(error => {
                    //console.log(error)
                    this.isLoading = false
                    if (error.response.status === 422 || error.response.status === 500) {
                        this.diagnosisError = error.response.data.errors.name
                        this.statusError = error.response.data.errors.status
                    }
                })
            },
            edit(diagnosis) {
                this.editMode = true
                this.buttonMode = true
                this.id = diagnosis.id
                this.name = diagnosis.name
                this.status = diagnosis.status
            },
            update () {
                this.diagnosis_reset_error()
                this.diagnosis_validation_error()
                this.isLoading = true
                axios.post('/update/diagnosis/' + this.id, {
                    id: this.id,
                    name: this.name,
                    status: this.status,
                })
                .then(response => {
                    if (response.status === 200) {
                        this.name = ''
                        this.status = ''
                        toast.fire({
                            type: 'success',
                            title: 'Diagnosis Updated successfully'
                        })
                        location.reload(true)
                        //EventBus.$emit('diagnosis-updated', response.data)
                    }
                })
                .catch(error => {
                    console.log(error)
                })
            },
            destroy(diagnosis, index) {
                axios.delete('/delete/diagnosis/' + diagnosis.id)
                .then(response => {
                    this.diagnoses.splice(index, 1)
                    toast.fire({
                        type: 'success',
                        title: 'Diagnosis delete successfully'
                    })
                    this.generatePages(this.diagnoses)
                })
                .catch(error => {
                    console.log(error)
                })
            },
            active(diagnosis) {
                axios.post('/diagnosis/' + diagnosis.id + '/active')
                    .then(response => {
                        if (response.status === 200) {
                            this.diagnoses = this.diagnoses.map(d => {
                                if (d.id === diagnosis.id) {
                                    d.status = 1
                                }
                                return d
                            })
                            this.generatePages(this.diagnoses)
                            toast.fire({
                                type: 'success',
                                title: 'Diagnosis active successfully'
                            })
                        }
                    })
                    .catch(error => {
                        console.log(error)
                    })
            },
            inactive (diagnosis) {
                axios.post('/diagnosis/' + diagnosis.id +'/inactive')
                    .then(response => {
                        if (response.status === 200) {
                            this.diagnoses = this.diagnoses.map(d => {
                                if (d.id === diagnosis.id) {
                                    d.status = 0
                                }
                                return d
                            })
                            this.generatePages(this.diagnoses)
                            toast.fire({
                                type: 'success',
                                title: 'Diagnosis inactive successfully'
                            })
                        }
                    })
                    .catch(error => {
                        console.log(error)
                    })
            },
            setCurrentPage (page) {
                this.currentPage = page
            },
            generatePages (diagnosis) {
                this.diagnosisPages = _.chunk(diagnosis, this.perPage)

                this.pageCount = 0
                this.pageCount = this.diagnosisPages.length
                if (this.pageCount === 0) {
                    this.message = "Sorry! No diagnosis found"
                }
            },
        }
    }
</script>

<style scoped>
    .breadcums {
        list-style: none;
        text-decoration: none;
        color: black;
        font-family: "Courier New", Courier, monospace;
        font-size: 14px;
    }
    .bg-border {
        border: 2px solid deepskyblue;
    }
    .bg-sub {
        background-color: navajowhite;
    }
    div.sadow {
        width: 250px;
        height: 370px;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        /*text-align: center;*/
    }
    .txt {
        text-align: center;
        padding-top: 10px;
        font-family: 'Just Another Hand', cursive;
    }
</style>
