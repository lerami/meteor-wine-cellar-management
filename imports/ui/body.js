import { Template } from 'meteor/templating';
import { Boxes } from '../api/boxes.js';
import { Session } from 'meteor/session';
import swal from 'sweetalert';

import './body.html';
import './box.js';
import './insertBox.js';

Session.set('selectedLayer', 2);
Session.set('adding', false);
Session.set('removing', false);
Session.set('selectedBox', );
Session.set('insertNewBox', false);

Template.body.onCreated(function bodyOnCreated() {
  Meteor.subscribe('box');
});

Template.body.helpers({
  boxes() {
    var layerOn = Session.get('selectedLayer');
    return Boxes.find({ layer: { $lte: layerOn } }, { sort: { rank: -1, pos: 1, layer: 1 } });
  },
  selectedLayer() {
    return Session.get('selectedLayer');
  },
  adding() {
    return Session.get('adding');
  },
  removing() {
    return Session.get('removing');
  },
  selectedBox() {
    return Session.get('selectedBox');
  },
  insertNewBox() {
    return Session.get('insertNewBox');
  },
  nbMatch() {
    return Session.get('nbMatch');
  }
});

Template.body.events({

  'click #lookforcy'(event) {
    $("#lookforcy").css({ left: 0 })
    $("#overlay").show();
  },

  'click #lookforref'(event) {
    $("#lookforref").css({ left: 0 });
    $("#overlay").show();
  },

  'click #btn-cy'(event) {
    $("#search-by-cy").slideToggle();
  },

  'click #btn-ref'(event) {
    $("#search-by-ref").slideToggle();
  },

  'click #closebtn'(event) {
    $(".sidenav").width("200px");
    $("#overlay").show();
  },

  'click #overlay'(event) {
    $(".sidenav").width("0px");
    $("#lookforcy").css({ left: "-355px" });
    $("#lookforref").css({ left: "-285px" });
    $("#overlay").hide();
  },

  'click #insertBoxButton'(event) {
    // Session.set('insertNewBox',true);
    Modal.show("insertBox");
    // $("#dark-overlay").show();
  },

  'click #dark-overlay'(event) {
    // Session.set('insertNewBox', false);
    $("insertDivForm").hide();
    $("#dark-overlay").hide();
  },

  'submit #insertForm'(event) {

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

  'submit #search-by-ref'(event) {
    event.preventDefault();

    $('.topFace.matchTop').removeClass('matchTop');
    $('.leftFace.matchLeft').removeClass('matchLeft');
    $('.rightFace.matchRight').removeClass('matchRight');

    const target = event.target;
    const ref = target.ref.value.toUpperCase();

    var matchBoxes = Boxes.find({ ref: ref }).fetch();

    for (i = 0; i < matchBoxes.length; i++) {
      const id = matchBoxes[i]._id;
      $('#top-' + id).addClass('matchTop');
      $('#left-' + id).addClass('matchLeft');
      $('#right-' + id).addClass('matchRight');
    }

    $('.topFace.selectedTop').removeClass('selectedTop');
    $('.leftFace.selectedLeft').removeClass('selectedLeft');
    $('.rightFace.selectedRight').removeClass('selectedRight');

    Session.set('selectedBox', matchBoxes[0]);
    $('#top-' + matchBoxes[0]._id).addClass('selectedTop');
    $('#left-' + matchBoxes[0]._id).addClass('selectedLeft');
    $('#right-' + matchBoxes[0]._id).addClass('selectedRight');
    Session.set('nbMatch', matchBoxes.length);
    Session.set('selectedLayer', 2);

    target.ref.value = '';
    $("#overlay").hide();
    $("#lookforref").css({ left: "-285px" });
  },

  'submit #search-by-cy'(event) {
    event.preventDefault();

    $('.topFace.matchTop').removeClass('matchTop');
    $('.leftFace.matchLeft').removeClass('matchLeft');
    $('.rightFace.matchRight').removeClass('matchRight');

    const target = event.target;
    const color = target.color.value;
    const year = target.year.value;

    var matchBoxes = Boxes.find({ color: color, year: year }).fetch();

    for (i = 0; i < matchBoxes.length; i++) {
      const id = matchBoxes[i]._id;
      $('#top-' + id).addClass('matchTop');
      $('#left-' + id).addClass('matchLeft');
      $('#right-' + id).addClass('matchRight');
    }

    $('.topFace.selectedTop').removeClass('selectedTop');
    $('.leftFace.selectedLeft').removeClass('selectedLeft');
    $('.rightFace.selectedRight').removeClass('selectedRight');

    Session.set('selectedBox', matchBoxes[0]);
    $('#top-' + matchBoxes[0]._id).addClass('selectedTop');
    $('#left-' + matchBoxes[0]._id).addClass('selectedLeft');
    $('#right-' + matchBoxes[0]._id).addClass('selectedRight');
    Session.set('nbMatch', matchBoxes.length);
    Session.set('selectedLayer', 2);

    target.year.value = '';
    $("#overlay").hide();
    $("#lookforcy").css({ left: "-355px" });
  },

  'click .arrow-up'(event) {
    var layerOn = Session.get('selectedLayer');
    if (layerOn < 2) {
      layerOn++;
    }
    Session.set('selectedLayer', layerOn);
  },

  'click .arrow-down'(event) {
    var layerOn = Session.get('selectedLayer');
    if (layerOn > 0) {
      layerOn--;
    }
    Session.set('selectedLayer', layerOn);
  },

  'click .adding-button': function (event) {
    Session.set('adding', true);
  },

  'submit .adding-box'(event) {

    // Prevent default browser form submit
    event.preventDefault();

    var data = Session.get('selectedBox');

    // Get value from form element
    const target = event.target;
    const qtyplus = Number(target.qtyplus.value);

    const newqty = data.qty + qtyplus;

    // Insert a task into the collection
    Meteor.call('boxes.update', data._id, newqty);


    // Clear form
    target.qtyplus.value = '';

    Session.set('adding', false);
  },

  'click .removing-button': function (event) {
    Session.set('removing', true);
  },

  'submit .removing-box'(event) {

    // Prevent default browser form submit
    event.preventDefault();

    var data = Session.get('selectedBox');

    // Get value from form element
    const target = event.target;
    const qtyminus = Number(target.qtyminus.value);

    const newqty = data.qty - qtyminus;

    // Insert a task into the collection
    Meteor.call('boxes.update', data._id, newqty);


    // Clear form
    target.qtyminus.value = '';

    Session.set('removing', false);
  },

  'click .cube'(event) {
 
    Session.set('selectedBox', this.data);

    $('.topFace.selectedTop').removeClass('selectedTop');
    $('.leftFace.selectedLeft').removeClass('selectedLeft');
    $('.rightFace.selectedRight').removeClass('selectedRight');

    $('#left-' + this.data._id).toggleClass("selectedLeft");
    $('#right-' + this.data._id).toggleClass("selectedRight");
    $('#top-' + this.data._id).toggleClass("selectedTop");
  },

  'click .reset'(event) {
    Session.set('selectedBox', );
    Session.set('nbMatch', );

    $('.topFace.selectedTop').removeClass('selectedTop');
    $('.leftFace.selectedLeft').removeClass('selectedLeft');
    $('.rightFace.selectedRight').removeClass('selectedRight');

    $('.topFace.matchTop').removeClass('matchTop');
    $('.leftFace.matchLeft').removeClass('matchLeft');
    $('.rightFace.matchRight').removeClass('matchRight');
  },

});

