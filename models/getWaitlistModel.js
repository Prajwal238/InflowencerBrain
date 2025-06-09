const Waitlist = require('../dbSchema/waitlistModel');

async function create(data) {
    const waitlist = await Waitlist.create(data);
    return waitlist;
}

module.exports = {
    create
};