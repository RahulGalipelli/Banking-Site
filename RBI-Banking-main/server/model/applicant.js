const mongoose = require('mongoose');

const applicantSchema = new mongoose.Schema({
    
})

const Applicants = mongoose.model('applicant', applicantSchema);

module.exports = Applicants;