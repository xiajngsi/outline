import Readability from '@mozilla/readability/Readability'
import axios from 'axios'
import { h } from './element';


export class Summarize {
  constructor() {

  }

  generateArticleButton = () => {
    const button = h('button', undefined)
    button.innerHTML('点击')
    button.addEvent('click', () => {
      this.getArticleContent().then((result) => {
        const bodyContentNode = document.body.firstChild

        document.body.insertBefore(result.response, bodyContentNode) 
      })
    })
    return button 
  }

  getArticleContent = () => {
    var documentClone = document.cloneNode(true);
    var article = new Readability(documentClone).parse();
    const text = article?.textContent

    return axios.post("https://lp.penseer.com/gpt", {
      "message": `Summarize the article in chinese
    ${text}`
    }).then(result => console.log(result))
      .catch(error => console.log('error', error));
  } 
}