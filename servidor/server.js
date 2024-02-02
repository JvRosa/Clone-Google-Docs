//const Document = require("./Document")

const io = require("socket.io")(3001, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
})

io.on("connection", socket => {
  console.log("conectado")
  
    socket.on("send-changes", delta => {
      console.log(delta)
        socket.broadcast.emit("receive-changes", delta)
    })
})


//  socket.on("get-document", async documentId => {
//    const document = await findOrCreateDocument(documentId)
//    socket.join(documentId)
//    socket.emit("load-document", document.data)
//    console.log(delta)
//    socket.on("send-changes", delta => {
//      socket.broadcast.to(documentId).emit("receive-changes", delta)
//   })
//
//    socket.on("save-document", async data => {
//      await Document.findByIdAndUpdate(documentId, { data })
//    })
//  })
//})
//
//async function findOrCreateDocument(id) {
//  if (id == null) return
//
//  const document = await Document.findById(id)
//  if (document) return document
//  return await Document.create({ _id: id, data: defaultValue })
//}
