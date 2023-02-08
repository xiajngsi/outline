interface Options {
  prefix: string
}
class Trigger {
  options: Options
  constructor(options: Options) {
    this.options = options
  }
  
  getClassNames() {
    const prefix = this.options.prefix
    return {
      closeClassName:`${prefix}-close`
    }
  }

  generatorClose() {
    const {closeClassName} = this.getClassNames()
    const str = `<span class='${closeClassName}'>
    <svg t="1661342858920" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7263" width="15" height="15"><path d="M563.8 512l262.5-312.9c4.4-5.2 0.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9c-4.4 5.2-0.7 13.1 6.1 13.1h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z" p-id="7264"></path></svg>
    </span>`;
    const style = `
      .${closeClassName} {
        position: absolute;
        top: 12px;
        right: 12px
      }
    `;
  
    return { domStr: str, style };
  }
}

export {Trigger}