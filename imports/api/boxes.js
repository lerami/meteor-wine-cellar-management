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
    auth: {
      user: function () {
        return {
          userId: this.request.headers['x-user-id'],
          token: Accounts._hashLoginToken(this.request.headers['x-auth-token'])
        };
      }
    },
  
    defaultHeaders: {
      'Content-Type': 'application/json'
    },
    onLoggedIn: function () {
      console.log(this.user.username + ' (' + this.userId + ') logged in');
    },
    onLoggedOut: function () {
      console.log(this.user.username + ' (' + this.userId + ') logged out');
    },
    prettyJson: true,
    useDefaultAuth: true
  });


  Api.addCollection(Meteor.users, {
    excludedEndpoints: ['put','delete','patch'],
    routeOptions: {
      authRequired: false
    },
    endpoints: {
      post: {
        authRequired: false
      }
    }
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

  Api.addRoute('boxes/id/:_id', { authRequired: false }, {
    get: function() {
      return Boxes.findOne(this.urlParams._id );
    }
  })

  // Maps to: /api/boxes/:_id
  Api.addRoute('boxes/:year', { authRequired: false }, {
    get: function () {
      return Boxes.find({ year: this.urlParams.year }).fetch();
    }     
  });

  // Maps to: /api/boxes/add/:_id/:qty
  Api.addRoute('boxes/add/:_id/:qty', { authRequired: false }, {
    patch: function () {
      var data = Boxes.findOne(this.urlParams._id);
      var newQty = data.qty + Number(this.urlParams.qty);
      Meteor.call('boxes.update', data._id, newQty);
      return data; 
    }
  });

  // Maps to: /api/boxes/remove/:_id/:qty
  Api.addRoute('boxes/remove/:_id/:qty', { authRequired: false }, {
    patch: function () {
      var data = Boxes.findOne(this.urlParams._id);
      var newQty = data.qty - Number(this.urlParams.qty);
      Meteor.call('boxes.update', data._id, newQty); 
      return data;
    }
  });
}

Meteor.methods({
  'boxes.insert'(color, year, ref, qty, rank, pos, layer) {
    layer = Number(layer);
    rank = Number(rank);
    pos = Number(pos);
    qty = Number(qty);

    return Boxes.insert({
      color,
      year,
      ref,
      qty,
      rank,
      pos,
      layer,

      createdAt: new Date(),
    });
  },

  'boxes.update'(id, newqty) {
    newqty = Number(newqty)

    return Boxes.update(
      id, { $set: { qty: newqty } }
    )
  },

  'boxes.remove'(boxId) {
    check(boxId, String);

    Boxes.remove(boxId);
  },
});

