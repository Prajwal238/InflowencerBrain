const waitlistModel = require('../../models/getWaitlistModel');
const { v4: uuidv4 } = require('uuid');

function waitlistService() {}

waitlistService.prototype.addEmailToWaitlist = async function(data) {
    const {name, businessEmail, businessName} = data;
    var review;
    if(data?.review){
        review = data.review;
    }
    var _id = "rId-" + uuidv4();
    const waitlist = await waitlistModel.create({ _id, name, businessEmail, businessName, review });
    return waitlist;
}

module.exports = {
    "getInst": function() {
        return new waitlistService();
    }
};
