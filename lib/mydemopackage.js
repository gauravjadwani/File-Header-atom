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
  objToheaderString(obj){
    console.log('stringFormater',obj);
    let customFormat='/**/';
    let data='';
    for(let i in obj){
      data=data+'@'+i+': '+obj[i]+"\n";
    }
    let d=[customFormat.slice(0, 2), "\n"+data, customFormat.slice(2)].join('');
    return d;
  },
  headerStringToObj(str){
    let arr=str.split("\n");
    let tempObj={};
    for(let item in arr){
      // console.log(arr[item]);
      let value=arr[item].split(/:(.+)/)
      // console.log('vvv',value,arr[item]);
      tempObj[value[0]]=value[1]
    }
    return tempObj;
    // console.log(tempObj,'tempObj');
    // console.log(arr,'headerStringToObj');
  },
  checkHeaderStatus(fileText){
    const check=fileText.indexOf("/*");
    return check;
    //function to check whether header is prsent on the file
  },
  editHeaderObjContents(obj,lastModifiedby,lastModifiedby){
    obj['@Last Modified By']=lastModifiedby;
    obj['@Last Modified']=lastModifiedby;
    return obj;
    // let str=editHeaderString.indexOf("@Last Modified: ");
    // console.log(editHeaderString)
  },
  toggle() {
    try{
    let editor = atom.workspace.getActiveTextEditor();
      // console.log('Mydemopackage was toggled!',moment().format('MMMM Do YYYY, h:mm:ss a'));
    if (editor) {
      let fileContent=editor.getText();
      let headerStatus=this.checkHeaderStatus(fileContent);


      if(headerStatus === -1){
        //adding the new header
        try{

        }
        catch(error){
          console.log('cathced',error);
        }
        let obj=atom.config.get('mydemopackage');
        obj['Created On']=moment().format('MMMM Do YYYY, h:mm:ss a');

        obj['Last Modified By']=obj['Author'];
        obj['Last Modified']=moment().format('MMMM Do YYYY, h:mm:ss a');
        let headerString=this.objToheaderString(obj);
        console.log(headerString);
        editor.setText(headerString+"\n"+fileContent)
      }
      else{
        //editing the header
        let start=headerStatus;
        let end=fileContent.indexOf("*/");
        let fileContentHeaderString=fileContent.substr(start +2 , end -2).trim();
        let headerObj=this.headerStringToObj(fileContentHeaderString);
        console.log('chalaelse',headerObj);
        let editedObjContents=this.editHeaderObjContents(
          headerObj,
          atom.config.get('mydemopackage.Author'),
          moment().format('MMMM Do YYYY, h:mm:ss a'))
        console.log('editedObjContents',editedObjContents);
        //-2 on the start and end so that can escape the "/*" and "*/"
        // let editHeaderContentsData=this.editHeaderContents(fileContentHeaderString,
        //   atom.config.get('mydemopackage.Author'),
        //   moment().format('MMMM Do YYYY, h:mm:ss a'));
        // console.log(editHeaderContents,"subs",start ,end)
        // console.log(i.trim())
        // console.log('fileContentHeaderString',fileContentHeaderString)

      }
      console.log(fileContent.indexOf("/*"),'no')
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

    // let headerContent=JSON.stringify(atom.config.get('mydemopackage'));


    // editor.insertText('')
    // console.log(content)
    // editor.selectToBeginningOfLine();

  }
  }catch(err){
    console.log(err);
  }
    //modalplaneshow
    // return (
    //   this.modalPanel.isVisible() ?
    //   this.modalPanel.hide() :
    //   this.modalPanel.show()
    // );
  },
  config: {
    "Author": {
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
