import React, {useState} from "react"
import marked from "marked";
import './MarkdownPreviewer.scss'


const Markdown = ({setText, text}) => {
  return (
  <div id="markdown">
    <div className="d-flex flex-column align-items-center">
      <h5>Markdown</h5>
      <textarea onChange={(e) => setText(e.target.value)} id="editor" value={text} 
        />
    </div>
  </div>
  )
}

const Preview = ({text}) => {
  const showHTML = () => {
       document.getElementById('html-format').classList.toggle('show');
  }

  return (
  <div className="card" id="previewer">
    <div className="card-body d-flex flex-column">
      <h5 className="title">
        Preview
      </h5>
      <div id="preview" dangerouslySetInnerHTML={{__html: marked(text)}}></div>
      <button id="preview-button" onClick={showHTML}>Show HTML format</button>
      <p id="html-format">{marked(text)}</p>
    </div>  
      
  </div>
  )
}

const App = () => {
  const [text, setText] = useState(`
# h1
## h2
This is a [link](https://www.google.com)
\`inline code\`
\`\`\`
let score = 0
if(true) {
  score++;
} else {
  score--;
}
\`\`\`
- Food: 
  - kiwi
  - apple
  - orange
**COOL!**
> Mission: to make human healthy.

![Fruit](https://images.unsplash.com/photo-1618897996318-5a901fa6ca71?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=464&q=80g)
  `)
  return (
    <div className="container-fluid" id="markdown-previewer">
    <Markdown setText={setText} text={text}/>
    <Preview text={text}/>
    </div>
  )
}

export default App;