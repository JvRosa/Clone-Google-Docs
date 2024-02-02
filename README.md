# Clone-Google-Docs
Projeto com objetivo de criar um software similar ao Google Docs

![main screen](https://github.com/JvRosa/Clone-Google-Docs/assets/94145163/42204f90-c1ee-43e3-b12b-6325b1ece45b)

## Principais Objetivos do Projeto
Testar concorrência entre Threads (quanto do documento pode ser editado simultaneamente?)
Criar uma aplicação web com frontend utilizando Node.js e React

## Conexão Cliente - Servidor
Conexão client-server via socket
### Cliente
```ts
useEffect(() => {
	const  s  =  io("http://localhost:3001")
	setSocket(s)
	
	return () => {
		s.disconnect()
	}
}, [])
```
### Servidor
```ts
const  io  =  require("socket.io")(3001, {
	cors: {
		origin:  "http://localhost:3000",
	methods: ["GET", "POST"],
	},
})
```

## Layout e Edição de Texto

**Quill**: Editor WYSIWYG open source grátis para web, com arquitetura modular e API expressiva, completamente customizável

https://quilljs.com

## Controle de Concorrência
O texto é formatado na seleção atual do usuário, retornando um Delta representando a alteração.
### Cliente
```ts
useEffect(() =>{
	if (socket  ==  null  ||  quill  ==  null) return
	
	const  handler  = (delta) => {
		quill.updateContents(delta)
	}
	socket.on("receive-changes", handler)
	return () => {
	socket.off("receive-changes", handler)
	}
}, [socket, quill])

useEffect(() =>{
	if (socket  ==  null  ||  quill  ==  null) return

	const  handler  = (delta, oldDelta, source) => {
		if (source  !==  "user") return
		socket.emit("send-changes", delta)
	}
	quill.on("text-change", handler)
	return () => {
		quill.off("text-change", handler)
	}
}, [socket, quill])
```
### Servidor
```ts
io.on("connection", socket  => {
	console.log("conectado")
		socket.on("send-changes", delta  => {
			console.log(delta)
				socket.broadcast.emit("receive-changes", delta)
		})
})
```
## Resultados
**Aplicação web executada em duas instâncias, editando o arquivo em tempo real, simultaneamente:**

![dual instance](https://github.com/JvRosa/Clone-Google-Docs/assets/94145163/df1aad5f-8c10-418d-8eb1-734423408800)



**Delta de caracteres e posições no terminal:**

![terminal](https://github.com/JvRosa/Clone-Google-Docs/assets/94145163/8883cb09-9d2e-4626-9a3c-6b97db6d0220)
