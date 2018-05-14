import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Boxes } from '../api/boxes.js';
import QRCode from 'qrcode'

import './insertBox.html';

Template.insertBox.events({

    'submit #insertForm'(event) {
        console.log(event)
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
        Meteor.call('boxes.insert', id, color, year, ref, qty, format, rank, pos, layer, (err, res) => {
            if (err) {
                swal("Il y a eu une erreur!", "Veuillez vérifier que les informations saisies sont correctes.", "error");
            } else {
                QRCode.toDataURL(id, function (err, url) {
                    swal({
                        title: "La palox a été ajouté avec succès!",
                        text: "Vous pouvez maintenant télécharger le QR code à imprimer et coller sur la palox!",
                        icon: "success",
                        button: "Télécharger le QR code"
                    })
                        .then((willUpload) => {
                            if (willUpload) {
                                swal({
                                    title: "Vous pouvez imprimer le QR code ci-dessus!",
                                    icon: url,
                                });
                            }
                        });
                })

            }
        });

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