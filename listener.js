const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const moment = require("moment");
const utils = require("./services/utils")
const mongoose = require("./services/mongoose");
const personMessageModel = require("./model/person.model");
const port = process.env.port || 3000;


app.set('view engine', 'pug');
app.set('views', './views');
app.get('/', function (req, res) {
   res.render("index", {
      port: port
   })
});

const frontendSocket = io.of('/frontend');
io.on('connection', function (socket) {
   console.log("user connected")
   socket.on("MessageFromEmitterService", async function (message) {
      let { security, ...data } = JSON.parse(utils.decryptMessage(message));
      let key = utils.hashKey(JSON.stringify(data));
      console.log(data);
      console.log(security)
      console.log(key)
      if (security != key) {
         socket.emit("NotValidMessage")
      } else {
         let currentDate = moment();
         let result = await personMessageModel.findOne({
            name: data.name,
            startTime: { $lte: currentDate.valueOf() },
            endTime: { $gte: currentDate.valueOf() }
         })
         if (result) {
            result.messages.push({
               origin: data.origin, destination: data.destination
            })
            await result.save()
         } else {
            await personMessageModel.create({
               name: data.name,
               startTime: currentDate.valueOf(),
               endTime: currentDate.add(1, 'minutes').valueOf(),
               messages: [{
                  origin: data.origin, destination: data.destination
               }]
            })
         }
         frontendSocket.emit("MessageFromServer",data);
      }
   })
   socket.on('disconnect', function () {
      console.log('A user disconnected');
   });
});






async function startServer() {
   try {
      await mongoose.makeConnection();
      http.listen(port, function () {
         console.log('listening on *:', port);
      });
   } catch (err) {
      console.log("Error in start server function");
   }
}


startServer();

