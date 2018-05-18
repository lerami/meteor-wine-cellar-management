import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

export const Boxes = new Mongo.Collection('box');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('box', function boxesPublication() {
    return Boxes.find();
  });

  Meteor.publish('userData', function () {
    return Meteor.users.find();
  });

  // Global API configuration
  var Api = new Restivus({
    // auth: {
    //   user: function () {
    //     return {
    //       userId: this.request.headers['x-user-id'],
    //       token: Accounts._hashLoginToken(this.request.headers['x-auth-token'])
    //     };
    //   }
    // },

    defaultHeaders: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Z-Key',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Content-Type': 'application/json'
  },
  defaultOptionsEndpoint: function() {
      this.response.writeHead(201, {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Z-Key',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      });
      return;
  },
    // onLoggedIn: function () {
    //   console.log(this.user.username + ' (' + this.userId + ') logged in');
    // },
    // onLoggedOut: function () {
    //   console.log(this.user.username + ' (' + this.userId + ') logged out');
    // },
    prettyJson: true,
    useDefaultAuth: true,
    enableCors: true
  });

  // Generates: GET on /api/boxes, GET on
  // /api/boxes/:_id and PATCH on
  // /api/boxes/:_id/add(remove)/:qty for the Boxes collection
  Api.addCollection(Boxes);

  // Maps to: /api/boxes
  Api.addRoute('boxes', { authRequired: false }, {
    get: function() {
      return Boxes.find().fetch();
    }
  });

  Api.addRoute('boxes/update/id/:_id/rank/:rank/pos/:pos/layer/:layer', { authRequired: false }, {
    put: function() {
      Meteor.call('boxes.updatePosition',this.urlParams._id, this.urlParams.rank, this.urlParams.pos, this.urlParams.layer);
      return Boxes.findOne(this.urlParams.id)
    }
  })

  Api.addRoute('boxes/id/:_id', { authRequired: false }, {
    get: function() {
      return Boxes.findOne({_id: this.urlParams._id});
    }
  })

  Api.addRoute('boxes/search/color/:color/ref/:ref/year/:year/format/:format', { authRequired: false }, {
    get: function () {
      var searchJson = {};
      if (this.urlParams.color != "null"){
        searchJson.color = this.urlParams.color;
      }
      if (this.urlParams.ref != "null"){
        searchJson.ref = this.urlParams.ref;
      }
      if (this.urlParams.year != "null"){
        searchJson.year = this.urlParams.year;
      }
      if (this.urlParams.format != "null"){
        searchJson.format = this.urlParams.format;
      }
      return Boxes.find(searchJson).fetch();
    }
  });

  // Maps to: /api/boxes/add/:_id/:qty
  Api.addRoute('boxes/add/:_id/:qty', { authRequired: false }, {
    patch: function () {
      var data = Boxes.findOne(this.urlParams._id);
      var newQty = data.qty + Number(this.urlParams.qty);
      Meteor.call('boxes.updateQty', data._id, newQty);
      return Boxes.findOne(this.urlParams._id);
    }
  });

  // Maps to: /api/boxes/remove/:_id/:qty
  Api.addRoute('boxes/remove/:_id/:qty', { authRequired: false }, {
    patch: function () {
      var data = Boxes.findOne(this.urlParams._id);
      var newQty = data.qty - Number(this.urlParams.qty);
      Meteor.call('boxes.updateQty', data._id, newQty);
      return Boxes.findOne(this.urlParams._id);
    }
  });

  Api.addRoute('boxes/color/:_id/:color', {authRequired: false}, {
    patch: function() {
      var data = Boxes.findOne(this.urlParams._id);
      var newColor = this.urlParams.color;
      Meteor.call('boxes.updateColor', data._id, newColor);
      return Boxes.findOne(this.urlParams._id);
    }
  });

  Api.addRoute('boxes/ref/:_id/:ref', {authRequired: false}, {
    patch: function() {
      var data = Boxes.findOne(this.urlParams._id);
      var newRef = this.urlParams.ref;
      Meteor.call('boxes.updateRef', data._id, newRef);
      return Boxes.findOne(this.urlParams._id);
    }
  });

  Api.addRoute('boxes/year/:_id/:year', {authRequired: false}, {
    patch: function() {
      var data = Boxes.findOne(this.urlParams._id);
      var newYear = this.urlParams.year;
      Meteor.call('boxes.updateYear', data._id, newYear);
      return Boxes.findOne(this.urlParams._id);
    }
  });
}

Meteor.methods({
  'boxes.insert'(id, color, year, ref, qty, format, rank, pos, layer) {
    layer = Number(layer);
    rank = Number(rank);
    pos = Number(pos);
    qty = Number(qty);

    return Boxes.insert({
      _id: id,
      color,
      year,
      ref,
      qty,
      format,
      rank,
      pos,
      layer,

      createdAt: new Date(),
    });
  },

  'boxes.updateQty'(id, newqty) {
    newqty = Number(newqty)

    return Boxes.update(
      id, { $set: { qty: newqty } }
    )
  },

  'boxes.updateColor'(id, newColor) {
    return Boxes.update(
      id, { $set: {color: newColor } }
    )
  },

  'boxes.updateRef'(id, newRef) {
    return Boxes.update(
      id, { $set: {ref: newRef } }
    )
  },

  'boxes.updateYear'(id, newYear) {
    return Boxes.update(
      id, { $set: {year: newYear } }
    )
  },

  'boxes.updatePosition'(id, newRank, newPos, newLayer){
    return Boxes.update(
      id, { $set: {rank: newRank, pos: newPos, layer: newLayer}}
    )
  },

  'boxes.remove'(boxId) {
    check(boxId, String);

    Boxes.remove(boxId);
  },
});
