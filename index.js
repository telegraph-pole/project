//var firebase = require("firebase/app");

//require("firebase/auth");
//require("firebase/firestore");

//var express = require('express');
//var router = express.Router();

///* GET home page. */
//router.get('/', function (req, res, next) {
//    res.render('index', { title: 'Express' });
//});

//router.get('/test', function (req, res, next) {
//    res.render('test');
//});

//module.exports = router;


const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.assistant = functions.https
.onRequest((request, response) => {
    const app = new DialogflowApp({ request: request, response: response });
    app.handleRequest(handlerRequest);

    function handlerRequest(assistant) {
        const anger = assistant.getArgument('anger');
        const flattery = assistant.getArgument('flattery');
        const info = assistant.getArgument('info');

        let message,
            statements = [];

        getGroupInfo({
            onSuccess: function (data) {

                if (anger && anger.length > 0) {
                    statements.push("±×·²¶© [" + data.info.anger + "]´Â ¾î¶³±î¿ä...? Èû³»¿ä!");
                }
                if (flattery && flattery.length > 0) {
                    statements.push("À½..ÀÌ°Ô ÁÁ°Ú¾î¿ä! [" + data.info.flattery + "]¶ó°í ´ë´äÇØ º¾½Ã´Ù!");
                }
                message = statements.join(" ");
                response.json({ 'speech': message, 'displayText': message });
            }
        });
    }
});

function getGroupInfo(options) {
    admin.database().ref('/group-info')
    .once('value')
    .then(function (snapshot) {
        const info = snapshot.val();
        return options.onSuccess({ info: info });
    })
    .catch(error => {
        console.log('error', error);
    });
}