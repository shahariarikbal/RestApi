<template>
    <div>
        <div id="content-wrapper">
            <div class="container-fluid">
                <div class="card">
                    <div class="card-header">
                        <div class="row">
                            <div class="col-12">
                                <loading :active.sync="isLoading"
                                         :can-cancel="true"
                                         :on-cancel="onCancel"
                                         :is-full-page="fullPage"></loading>
                                <!-- Button trigger modal -->
                                <button type="button" class="btn btn-primary float-right" data-toggle="modal" data-target=".addNewPatient">
                                    Add Patient
                                </button>
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
                                        <option value="doctor_name">Name</option>
                                        <option value="phone">Phone</option>
                                    </select>
                                </div>
                                <div class="d-flex">
                                    <input type="text" class="form-control"
                                           v-if="searchType==='name' || searchType==='phone'"
                                           v-model="search"
                                           :placeholder="searchPlaceholder">
                                </div>
                            </div>
                        </div>
                        <table class="table table-bordered">
                            <thead>
                            <tr class="align text-center">
                                <th style="width: 10px">SN</th>
                                <th>Name</th>
                                <th>Phone</th>
                                <th>Doctor Name</th>
                                <th>Disease Name</th>
                                <th width="20%">Action</th>
                            </tr>
                            </thead>
                            <tbody>

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
        <!---Add new modal start--->
        <div class="modal fade addNewPatient" id="addNewPatient" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-labelledby="addNewPatientLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title" id="addNewPatientLabel">Add new Patient</h4>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form method="post" @submit.prevent="store()">
                            <div class="form-group">
                                <label for="name">Name*</label>
                                <input type="text" class="form-control" id="name" name="name" v-model="name" placeholder="Patient name...">
                                <small class="text-danger" v-text="nameError"></small>
                            </div>
                            <div class="form-group">
                                <label for="email">Email</label>
                                <input type="email" name="email" class="form-control" id="email" v-model="email" placeholder="Patient email...">
                                <small class="text-danger" v-text="emailError"></small>
                                <small class="text-success" v-text="emailSuccess"></small>
                            </div>
                            <div class="form-group">
                                <label for="phone">Phone*</label>
                                <input type="text" name="phone" class="form-control" id="phone" v-model="phone" placeholder="Patient phone...">
                                <small class="text-danger" v-text="phoneError"></small>
                            </div>
                            <div class="form-group">
                                <label for="doctor_name">Doctor Name*</label>
                                <select class="form-control" id="doctor_name" name="doctor_name" v-model="doctor_name">
                                    <option value="">Select Doctor name</option>
                                    <option v-for="diagnosis in diagnoses" :key="diagnosis.id" :value="diagnosis.id">{{ diagnosis.name }}</option>
                                </select>
                                <small class="text-danger" v-text="specialistError"></small>
                            </div>
                            <div class="form-group">
                                <label for="specialist">Specialist*</label>
                                <select class="form-control" id="specialist" name="specialist" v-model="specialist">
                                    <option value="">Select Specialist name</option>
                                    <option v-for="diagnosis in diagnoses" :key="diagnosis.id" :value="diagnosis.id">{{ diagnosis.name }}</option>
                                </select>
                                <small class="text-danger" v-text="specialistError"></small>
                            </div>
                            <div class="form-group">
                                <label for="appointment_day">Appointment day*</label>
                                <select class="form-control" name="appointment_day" id="appointment_day" v-model="appointment_day">
                                    <option value="saturday">Saturday</option>
                                    <option value="sunday">Sunday</option>
                                    <option value="monday">Monday</option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                </select>
                                <small class="text-danger" v-text="appointment_dayError"></small>
                            </div>
                            <div class="form-group">
                                <label for="appointment_date">Appointment date*</label>
                                <input type="text" name="appointment_date" class="form-control" v-model="appointment_date" id="appointment_date" placeholder="Appointment day...">
                                <small class="text-danger" v-text="appointment_dateError"></small>
                            </div>
                            <div class="form-group">
                                <label for="appointment_time">Appointment time*</label>
                                <input type="text" name="appointment_time" class="form-control" v-model="appointment_time" id="appointment_time" placeholder="Appointment time...">
                                <small class="text-danger" v-text="appointment_timeError"></small>
                            </div>
                            <div class="form-group">
                                <label for="address">Address*</label>
                                <textarea class="form-control" rows="3" name="address" id="address" placeholder="Patient address" v-model="address"></textarea>
                                <small class="text-danger" v-text="addressError"></small>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                                <button type="submit" class="btn btn-primary">Appointment</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <!---Add new modal end--->
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
                patients: [],
                patientsPages: [],
                isLoading: false,
                fullPage: true,
                perPage: 10,
                pageCount: 1,
                currentPage: 1,
                message: 'Fetching patients list From The Server. Please Wait.....!',
                searchType: 'all',
                search: '',
                searchPlaceholder: 'Searching...',

                id: '',
                name: '',
                email: '',
                phone: '',
                specialist: '',
                doctor_name: '',
                appointment_day: '',
                appointment_date: '',
                appointment_time: '',
                address: '',
                emailSuccess: '',
                mailformat: '/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/',
                nameError: '',
                emailError: '',
                phoneError: '',
                specialistError: '',
                appointment_dayError: '',
                appointment_timeError: '',
                appointment_dateError: '',
                addressError: '',
                doctor_nameError: '',
            }
        },
        components: {
            Loading,
        },
    }
</script>

<style scoped>

</style>
