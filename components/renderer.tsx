import {useRef, useState, useEffect} from "react";
import Quill from "quill";


interface RendererProps {
    value: string;
}

 const Renderer = ({value}: RendererProps) => {
     const [isEmpty, setIsEmpty] = useState(false)
     const renderRef = useRef<HTMLDivElement>(null)

     useEffect(() => {
         if(!renderRef.current) return

         const container = renderRef.current

         const quil = new Quill(document.createElement('div'), {
             theme:'snow'
         })

         quil.enable(false)

         const contents = JSON.parse(value)

         quil.setContents(contents)
         const isEmpty = quil.getText().replace(/<(.|\n)*?>/g, '').trim().length === 0
         setIsEmpty(isEmpty)

         container.innerHTML = quil.root.innerHTML

         return () => {
             if(container) {
                 container.innerHTML = ''
             }
         }
     }, [value])

     if(isEmpty) return null

     return <div ref={renderRef} className="ql-editor ql-renderer" />
 }

 export default Renderer