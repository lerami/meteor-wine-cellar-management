import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Boxes } from '../api/boxes.js';

import './info.html';

Session.set('updating',false);

Template.box.helpers({
    updating() {
        return Session.get('updating');
      },
  })
  
  Template.box.events({
    'click .update': function (event) {
        Session.set('updating',true);
      },
      'click .update-box'(event) {
    
        // Prevent default browser form submit
        event.preventDefault();
    
        Session.set('updating',false);
      },
    })