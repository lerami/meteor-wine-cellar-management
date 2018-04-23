import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Boxes } from '../api/boxes.js';

import './box.html';


Template.box.helpers({
  boxID() {
    return this.data._id;
  },
  leftID() {
    return 'left-'+this.data._id;
  },
  rightID() {
    return 'right-'+this.data._id;
  },
  topID() {
    return 'top-'+this.data._id;
  },
  x() {
    return (this.data.rank+this.data.pos)*81;
  },
  y() {
    return (this.data.pos+6-this.data.rank)*46-this.data.layer*81;
  },
})
