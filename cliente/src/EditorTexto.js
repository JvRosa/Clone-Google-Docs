import { useCallback, useEffect, useState } from "react"
import Quill from "quill"
import "quill/dist/quill.snow.css"
import { io } from "socket.io-client"

export default function EditorTexto() {
    const [socket, setSocket] = useState()
    const [quill, setQuill] = useState()

    useEffect(() => {
        const s = io("http://localhost:3001")
        setSocket(s)

        return () => {
            s.disconnect()
        }
    }, [])

    useEffect(() =>{
        if (socket == null || quill == null) return
        
        const handler = (delta) => {
            quill.updateContents(delta)
        }
        socket.on("receive-changes", handler)
        return () => {
            socket.off("receive-changes", handler)
        }
    }, [socket, quill])

    useEffect(() =>{
        if (socket == null || quill == null) return

        const handler = (delta, oldDelta, source) => {
            if (source !== "user") return
            socket.emit("send-changes", delta)
        }
        quill.on("text-change", handler)
        return () => {
            quill.off("text-change", handler)
        }
    }, [socket, quill])

    const wrapperRef = useCallback((wrapper) => {
        if (wrapper == null) return
        wrapper.innerHTML = ''
        const editor = document.createElement('div')
        wrapper.append(editor)
        const q = new Quill(editor, { theme: "snow"})
            setQuill(q)
    }, [])
    return <div className="container" ref={wrapperRef}></div>
}
