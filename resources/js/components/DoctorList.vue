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
<!--                                <span class="breadcums">Doctor List</span>-->
<!--                            </strong>-->
                            <loading :active.sync="isLoading"
                                     :can-cancel="true"
                                     :on-cancel="onCancel"
                                     :is-full-page="fullPage"></loading>
                            <!-- Button trigger modal -->
                            <button type="button" class="btn btn-primary float-right" data-toggle="modal" data-target=".addNewDoctor">
                                Add Doctor
                            </button>

                            <!-- Modal -->
                            <div class="modal fade addNewDoctor" id="addNewDoctor" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-labelledby="addNewDoctorLabel" aria-hidden="true">
                                <div class="modal-dialog modal-lg">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h4 class="modal-title" id="addNewDoctorLabel">{{ titleMode ? 'Update doctor list' : 'Add new doctor' }}</h4>
                                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        <div class="modal-body">
                                            <form method="post" @submit.prevent="editMode ? update () : store()">
                                                <div class="form-group">
                                                    <label for="name">Name</label>
                                                    <input type="text" class="form-control" id="name" name="name" v-model="name" placeholder="Doctor name...">
                                                    <small class="text-danger" v-text="nameError"></small>
                                                </div>
                                                <div class="form-group">
                                                    <label for="email">Email</label>
                                                    <input type="email" name="email" class="form-control" id="email" v-model="email" placeholder="Doctor email...">
                                                    <small class="text-danger" v-text="emailError"></small>
                                                    <small class="text-success" v-text="emailSuccess"></small>
                                                </div>
                                                <div class="form-group">
                                                    <label for="phone">Phone</label>
                                                    <input type="text" name="phone" class="form-control" id="phone" v-model="phone" placeholder="Doctor phone...">
                                                    <small class="text-danger" v-text="phoneError"></small>
                                                </div>
                                                <div class="form-group">
                                                    <label for="specialist">Specialist</label>
                                                    <select class="form-control" id="specialist" name="specialist" v-model="specialist">
                                                        <option value="">Select Specialist name</option>
                                                        <option v-for="diagnosis in diagnoses" :key="diagnosis.id" :value="diagnosis.id">{{ diagnosis.name }}</option>
                                                    </select>
                                                    <small class="text-danger" v-text="specialistError"></small>
                                                </div>
                                                <div class="form-group">
                                                    <label for="appointment_day">Appointment day</label>
                                                    <input type="text" name="appointment_day" class="form-control" v-model="appointment_day" id="appointment_day" placeholder="Appointment day...">
                                                    <small class="text-danger" v-text="appointment_dayError"></small>
                                                </div>
                                                <div class="form-group">
                                                    <label for="appointment_time">Appointment time</label>
                                                    <input type="text" name="appointment_time" class="form-control" v-model="appointment_time" id="appointment_time" placeholder="Appointment time...">
                                                    <small class="text-danger" v-text="appointment_timeError"></small>
                                                </div>
                                                <div class="modal-footer">
                                                    <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                                                    <button type="submit" class="btn btn-primary">{{ buttonMode ? 'Update' : 'Create' }}</button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
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
                                    <option value="doctor_name">Doctor Name</option>
                                    <option value="phone">Phone</option>
                                    <option value="email">Email</option>
                                </select>
                            </div>
                            <div class="d-flex">
                                <input type="text" class="form-control"
                                       v-if="searchType==='doctor_name' || searchType==='email' || searchType==='phone'"
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
                            <th>Phone</th>
                            <th>Email</th>
                            <th>Specialist</th>
                            <th width="20%">Action</th>
                        </tr>
                        </thead>
                        <tbody v-if="doctorPages.length > 0">
                            <tr v-for="(doctor, index) in doctorPages[currentPage - 1]" :key="doctor.id">
                                <td>{{ index+1 }}</td>
                                <td>{{ doctor.name }}</td>
                                <td>{{ doctor.phone }}</td>
                                <td>{{ doctor.email }}</td>
                                <td>{{ doctor.diagnosis.name }}</td>
                                <td width="15%" style="text-align: center">
                                    <button title="Edit" data-toggle="modal" data-target=".editNewDoctor" class="btn btn-raised btn-success btn-sm" @click="edit(doctor)">
                                        <i class="fas fa-edit"></i>
                                    </button>
<!--                                    <button title="view data" data-toggle="modal" data-target=".showDoctor" @click="show(doctor)" class="btn btn-raised btn-primary btn-sm">-->
<!--                                        <i class="fas fa-eye"></i>-->
<!--                                    </button>-->
                                    <button type="button" class="btn btn-danger btn-sm" title="Delete" @click="destroy(doctor, index)">
                                        <i class="fas fa-trash-alt"></i>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <!---Edit Modal start--->
                    <div class="modal fade editNewDoctor" id="editNewDoctor" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-labelledby="editNewDoctorLabel" aria-hidden="true">
                        <div class="modal-dialog modal-lg">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h4 class="modal-title" id="editNewDoctorLabel">Update Doctor List</h4>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div class="modal-body">
                                    <form method="post" @submit.prevent="update()">
                                        <div class="form-group">
                                            <label for="editName">Name</label>
                                            <input type="text" class="form-control" id="editName" name="name" v-model="name" placeholder="Doctor name...">
                                            <small class="text-danger" v-text="edit_nameError"></small>
                                        </div>
                                        <div class="form-group">
                                            <label for="editEmail">Email</label>
                                            <input type="email" name="email" class="form-control" id="editEmail" v-model="email" placeholder="Doctor email...">
                                            <small class="text-danger" v-text="edit_emailError"></small>
                                            <small class="text-success" v-text="edit_emailSuccess"></small>
                                        </div>
                                        <div class="form-group">
                                            <label for="editPhone">Phone</label>
                                            <input type="text" name="phone" class="form-control" id="editPhone" v-model="phone" placeholder="Doctor phone...">
                                            <small class="text-danger" v-text="edit_phoneError"></small>
                                        </div>
                                        <div class="form-group">
                                            <label for="editSpecialist">Specialist</label>
                                            <select class="form-control" id="editSpecialist" name="editSpecialist" v-model="specialist">
                                                <option value="">Select Specialist name</option>
                                                <option v-for="diagnosis in diagnoses" :key="diagnosis.id" :value="diagnosis.id">{{ diagnosis.name }}</option>
                                            </select>
                                            <small class="text-danger" v-text="edit_specialistError"></small>
                                        </div>
                                        <div class="form-group">
                                            <label for="editAppointment_day">Appointment day</label>
                                            <input type="text" name="appointment_day" class="form-control" v-model="appointment_day" id="editAppointment_day" placeholder="Appointment day...">
                                            <small class="text-danger" v-text="edit_appointment_dayError"></small>
                                        </div>
                                        <div class="form-group">
                                            <label for="editAppointment_time">Appointment time</label>
                                            <input type="text" name="appointment_time" class="form-control" v-model="appointment_time" id="editAppointment_time" placeholder="Appointment time...">
                                            <small class="text-danger" v-text="edit_appointment_timeError"></small>
                                        </div>
                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                                            <button type="submit" class="btn btn-primary">Update</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!---Edit Modal end--->
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
        data() {
            return {
                diagnoses: [],
                doctors: [],
                doctorPages: [],
                isLoading: false,
                fullPage: true,
                perPage: 10,
                pageCount: 1,
                currentPage: 1,
                message: 'Fetching doctor list From The Server. Please Wait.....!',
                searchType: 'all',
                search: '',
                searchPlaceholder: 'Searching...',
                buttonMode: false,
                editMode: false,
                titleMode: false,
                id: '',
                name: '',
                email: '',
                phone: '',
                specialist: '',
                appointment_day: '',
                appointment_time: '',
                emailSuccess: '',
                mailformat: '/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/',
                nameError: '',
                emailError: '',
                phoneError: '',
                specialistError: '',
                appointment_dayError: '',
                appointment_timeError: '',

                edit_nameError: '',
                edit_emailError: '',
                edit_emailSuccess: '',
                edit_phoneError: '',
                edit_specialistError: '',
                edit_appointment_dayError: '',
                edit_appointment_timeError: '',
            }
        },
        components: {
            Loading,
        },
        watch : {
            email () {
                this.emailError = ''
                var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if (re.test(this.email)) {
                    axios.get('/email-available', { params: {email: this.email} })
                    .then(response => {
                        if (response.status === 200 && response.data.available === false) {
                            this.emailError = 'email is already registered'
                            this.emailSuccess = ''
                            this.errorCount++
                        }
                        if (response.status === 200 && response.data.available === true) {
                            this.emailError = ''
                            this.emailSuccess = 'This email is Accepted'
                        }
                    })
                    .catch(error => {
                        console.log(error)
                    })
                }
            },

            searchType (value) {
                this.setCurrentPage(1)
                this.generatePages(this.doctors)
            },
            perPage (value) {
                this.setCurrentPage(1)
                this.generatePages(this.doctors)
            },
            search (value) {
                this.setCurrentPage(1)
                this.generatePages(this.doctors)
                if (this.search != '') {
                    let search = this.doctors.filter(d => {
                        if (d.name.indexOf(this.search) !== -1) {
                            return d
                        }
                        if (d.phone.indexOf(this.search) !== -1) {
                            return d
                        }
                        if (d.email.indexOf(this.search) !== -1) {
                            return d
                        }
                    })
                    this.generatePages(search)
                }
            },
        },
        created() {
            axios.get('/diagnosis-list')
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

            axios.get('/doctor-show')
                .then(response => {
                    this.doctors = response.data
                    this.generatePages(this.doctors)

                    if (this.doctors.length === 0) {
                        this.message = 'Sorry! No doctor found.'
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
        methods : {
            onCancel() {
                console.log('User cancelled the loader.')
            },
            doctor_reset_error () {
                this.errorCount = 0
                this.nameError = ''
                this.emailError = ''
                this.phoneError = ''
                this.specialistError = ''
                this.appointment_dayError = ''
                this.appointment_timeError = ''
            },
            doctor_validation_error () {
                if (this.name.length === 0) {
                    this.nameError = 'Please input doctor name'
                    this.errorCount++
                }
                if (this.email.length === 0) {
                    this.emailError = 'Please input doctor email'
                    this.errorCount++
                }
                if (this.phone.length === 0) {
                    this.phoneError = 'Please input doctor phone'
                    this.errorCount++
                }
                if (this.specialist.length === 0) {
                    this.specialistError = 'Please select doctor specialist'
                    this.errorCount++
                }
                if (this.appointment_day.length === 0) {
                    this.appointment_dayError = 'Please input doctor appointment_day'
                    this.errorCount++
                }
                if (this.appointment_time.length === 0) {
                    this.appointment_timeError = 'Please input doctor appointment_time'
                    this.errorCount++
                }
            },
            store() {
                this.doctor_reset_error()
                this.doctor_validation_error()
                this.isLoading = true
                axios.post('/doctor-save', {
                    name: this.name,
                    email: this.email,
                    phone: this.phone,
                    specialist: this.specialist,
                    appointment_day: this.appointment_day,
                    appointment_time: this.appointment_time,
                })
                .then(response => {
                    $('#addNewDoctor').modal('hide')
                    this.onCancel()
                    this.name = ''
                    this.email = ''
                    this.phone = ''
                    this.specialist = ''
                    this.appointment_day = ''
                    this.appointment_time = ''
                    toast.fire({
                        type: 'success',
                        title: 'Doctor added successfully'
                    })
                    location.reload(true)
                })
                .catch(error => {
                    //console.log(error)
                    this.isLoading = false
                    if (error.response.status === 422 || error.response.status === 500) {
                        this.nameError = error.response.data.errors.name
                        this.emailError = error.response.data.errors.email
                        this.phoneError = error.response.data.errors.phone
                        this.specialistError = error.response.data.errors.specialist
                        this.appointment_dayError = error.response.data.errors.appointment_day
                        this.appointment_timeError = error.response.data.errors.appointment_time
                    }
                })
            },
            edit(doctor) {
                this.editMode = true
                this.buttonMode = true
                this.titleMode = true
                this.id = doctor.id
                this.name = doctor.name
                this.email = doctor.email
                this.phone = doctor.phone
                this.specialist = doctor.specialist
                this.appointment_day = doctor.appointment_day
                this.appointment_time = doctor.appointment_time
            },

            update() {
                this.doctor_validation_error()
                this.doctor_reset_error()
                this.isLoading = true
                axios.post('/update/doctor-info/' + this.id, {
                    id: this.id,
                    name: this.name,
                    email: this.email,
                    phone: this.phone,
                    specialist: this.specialist,
                    appointment_day: this.appointment_day,
                    appointment_time: this.appointment_time,
                })
                    .then(response => {
                        if (response.status === 200) {
                            this.name = ''
                            this.email = ''
                            this.phone = ''
                            this.specialist = ''
                            this.appointment_day = ''
                            this.appointment_time = ''
                            toast.fire({
                                type: 'success',
                                title: 'Doctor info Updated successfully'
                            })
                            location.reload(true)
                            //EventBus.$emit('diagnosis-updated', response.data)
                        }
                    })
                .catch(error => {
                    console.log(error)
                })
            },

            destroy(doctor, index) {
                axios.delete('/doctor-delete/' + doctor.id)
                    .then(response => {
                        this.doctors.splice(index, 1)
                        toast.fire({
                            type: 'success',
                            title: 'Doctor delete successfully'
                        })
                        this.generatePages(this.doctors)
                    })
            },
            setCurrentPage (page) {
                this.currentPage = page
            },
            generatePages (doctor) {
                this.doctorPages = _.chunk(doctor, this.perPage)

                this.pageCount = 0
                this.pageCount = this.doctorPages.length
                if (this.pageCount === 0) {
                    this.message = "Sorry! No doctor found"
                }
            },
        },
    }
</script>
