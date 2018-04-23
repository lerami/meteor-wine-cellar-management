import { Meteor } from 'meteor/meteor';

Meteor.startup(function () {
    if (Meteor.users.find().count() === 0) {
        Accounts.createUser({
            username: 'user',
            email:'',
            password: 'user',
            profile:{}
        });
    }
    
})
