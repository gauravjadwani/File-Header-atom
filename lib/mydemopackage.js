'use babel';

import MydemopackageView from './mydemopackage-view';
import { CompositeDisposable } from 'atom';
import moment from 'moment';

export default {

  mydemopackageView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.mydemopackageView = new MydemopackageView(state.mydemopackageViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.mydemopackageView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'mydemopackage:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.mydemopackageView.destroy();
  },

  serialize() {
    return {
      mydemopackageViewState: this.mydemopackageView.serialize()
    };
  },
  stringFormater(obj){
    console.log('stringFormater');
    let customFormat='/**/';
    let data='';
    for(let i in obj){
      data=data+'@'+i+': '+obj[i]+"\n";
    }
    let d=[customFormat.slice(0, 2), "\n"+data, customFormat.slice(2)].join('');
    return d;
  },
  checkHeaderStatus(headerObj){
    //function to check whether header is prsent on the file
  },
  toggle() {
    try{
    let editor = atom.workspace.getActiveTextEditor();
      console.log('Mydemopackage was toggled!',moment().format('MMMM Do YYYY, h:mm:ss a'));
    if (editor) {
      let fileContent=editor.getText();
      // selection = editor.getSelectedText()
    // let reversed = selection.split('').reverse().join('')
    // editor.insertText(reversed)
    // let items={};
    // let items['getAuthorName']=atom.config.get();
    // let items['getName']=atom.config.get('mydemopackage.Name');
    // let items['getEmail']=atom.config.get('mydemopackage.Email');
    // let items['setDate']=moment().format('MMMM Do YYYY, h:mm:ss a');
    // let items['setLastModifiedBy']=items['getAuthorName'];
    // let items['setLastModified']=moment().format('MMMM Do YYYY, h:mm:ss a');
    let obj=atom.config.get('mydemopackage');
    obj['Created On']=moment().format('MMMM Do YYYY, h:mm:ss a');
    obj['last modified by']=obj['Author'];
    obj['Last Modified']=moment().format('MMMM Do YYYY, h:mm:ss a');
    let headerString=this.stringFormater(obj);
    // let headerContent=JSON.stringify(atom.config.get('mydemopackage'));


    // editor.insertText('')
    // console.log(content)
    // editor.selectToBeginningOfLine();
    console.log(headerString);
    editor.setText(headerString+"\n"+fileContent)
  }
  }catch(err){
    console.log(err);
  }

    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  },
  config: {
    "Author": {
      "description": "Name of the Author",
      "type": "string",
      "default": "Adam"
    },
    "Name": {
      "description": "Name of the Author",
      "type": "string",
      "default": "Adam"
    },
    "Email": {
      "description": "Email of the Author",
      "type": "string",
      "default": "Adam@eve.com"
    },
    "gitlab": {
      "description": "If you rely on a private Gitlab server, please type your base URI here (default: https://gitlab.com).",
      "type": "string",
      "default": "https://gitlab.com"
    },
    "Copyright": {
      "description": "If you rely on a private Gitlab server, please type your base URI here (default: https://gitlab.com).",
      "type": "string",
      "default": "https://gitlab.com"
    }
  }
};
