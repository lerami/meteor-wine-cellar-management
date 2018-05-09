import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Boxes } from '../api/boxes.js';

import './insertBox.html';

Template.box.events({
    'submit form.new-box'(event) {

        // Prevent default browser form submit
        event.preventDefault();

        // Get value from form element
        const target = event.target;
        const id = target.id.value;
        const color = target.color.value;
        const year = target.year.value;
        const ref = target.ref.value;
        const qty = target.qty.value;
        const format = target.format.value;
        const rank = target.rank.value;
        const pos = target.pos.value;
        const layer = target.layer.value;
    
        // Insert a task into the collection
        Meteor.call('boxes.insert', id, color, year, ref, qty, format, rank, pos, layer);
    
        // Clear form
        target.id.value = '';
        target.color.value = '';
        target.year.value = '';
        target.ref.value = '';
        target.qty.value = '';
        target.format.value = '';
        target.rank.value = '';
        target.pos.value = '';
        target.layer.value = '';
      },
})