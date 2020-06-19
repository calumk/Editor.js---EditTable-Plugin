/**
 * Tool for creating image Blocks for Editor.js
 * Made with «Creating a Block Tool» tutorial {@link https://editorjs.io/creating-a-block-tool}
 *
 * @typedef {object} ImageToolData — Input/Output data format for our Tool
 * @property {string} url - image source URL
 * @property {string} url2 - image source URL2
 * @property {string} caption - image caption
 * @property {boolean} withBorder - flag for adding a border
 * @property {boolean} withBackground - flag for adding a background
 * @property {boolean} stretched - flag for stretching image to the full width of content
 *
 * @typedef {object} ImageToolConfig
 * @property {string} placeholder — custom placeholder for URL field
 */
class edittablePlugin {

  static get enableLineBreaks() {
    return true;
  }


  randomID() {
    return {
      random : Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    }
  }
  /**
   * Our tool should be placed at the Toolbox, so describe an icon and title
   */
  static get toolbox() {
    return {
      title: 'EditTable',
      icon:  `
      <svg width="18" height="14">
      <path d="M2.833 8v1.95a1.7 1.7 0 0 0 1.7 1.7h3.45V8h-5.15zm0-2h5.15V2.35h-3.45a1.7 1.7 0 0 0-1.7 1.7V6zm12.3 2h-5.15v3.65h3.45a1.7 1.7 0 0 0 1.7-1.7V8zm0-2V4.05a1.7 1.7 0 0 0-1.7-1.7h-3.45V6h5.15zM4.533.1h8.9a3.95 3.95 0 0 1 3.95 3.95v5.9a3.95 3.95 0 0 1-3.95 3.95h-8.9a3.95 3.95 0 0 1-3.95-3.95v-5.9A3.95 3.95 0 0 1 4.533.1z"/>
      </svg>
      `
    };
  }

  /**
   * Allow render Image Blocks by pasting HTML tags, files and URLs
   * @see {@link https://editorjs.io/paste-substitutions}
   * @return {{tags: string[], files: {mimeTypes: string[], extensions: string[]}, patterns: {image: RegExp}}}
   */
  static get pasteConfig() {
    return true;
  }


  /**
   * Automatic sanitize config
   * @see {@link https://editorjs.io/sanitize-saved-data}
   */
  static get sanitize(){
    return {
      table_json: true
    }
  }

  /**
   * Tool class constructor
   * @param {ImageToolData} data — previously saved data
   * @param {object} api — Editor.js Core API {@link  https://editorjs.io/api}
   * @param {ImageToolConfig} config — custom config that we provide to our tool's user
   */
  constructor({data, api, config}){
    this.api = api;
    this.config = config || {};
    this.data = {
      table_json: data.table_json || ''
    };

    this.random = this.randomID().random;

    this.wrapper = undefined;
    this.settings = [];
  }

  /**
   * Return a Tool's UI
   * @return {HTMLElement}
   */
  render(){
    if(!window.eTable){window.eTable={}};
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('simple-edittable');

    if (this.data && this.data.table_json){
      this._createEditTable(this.data.table_json);
      return this.wrapper;
    }

    const div = document.createElement('div');
    div.classList.add('is-edittable-display'+'_'+this.random);
    div.classList.add('is-edittable-display');

    this.wrapper.append(div);

    var _random = this.random;
    console.log(_random);

    setTimeout(function(){
      console.log("FIRE!")
      console.log('.is-edittable-display'+'_'+_random)
      window.eTable['.is-edittable-display'+'_'+_random] = $('.is-edittable-display'+'_'+_random).editTable({
        data: [
          ["Click on the plus symbols on the top and right to add cols or rows"]
        ]
      },_random);
    },500);

    return this.wrapper;
  }

  /**
   * @private
   * Create image with caption field
   * @param {string} url — image source
   * @param {string} captionText — caption value
   */
  _createEditTable(table_json){

    const div = document.createElement('div');
    div.classList.add('is-edittable-display'+'_'+this.random);
    div.classList.add('is-edittable-display');
    this.wrapper.append(div);

    var _random = this.random;
    var __data = {__random : _random, __table_json : table_json}
    setTimeout(function(){
      
      __data.__table_json = JSON.parse(__data.__table_json)
      window.eTable['.is-edittable-display'+'_'+__data.__random] = $('.is-edittable-display'+'_'+__data.__random).editTable({
        data: __data.__table_json
      },__data);
    },1000);

    this.wrapper;
    this._acceptTuneView();
  }

  /**
   * Extract data from the UI
   * @param {HTMLElement} blockContent — element returned by render method
   * @return {SimpleImageData}
   */
   save(blockContent){

    // console.log(blockContent)

    var _json = window.eTable['.is-edittable-display'+'_'+this.random].getJsonData();
    console.log("IN_EDITTABLE")
    console.log(_json)
    return Object.assign(this.data, {
      table_json : _json,
    });

  }

  /**
   * Skip empty blocks
   * @see {@link https://editorjs.io/saved-data-validation}
   * @param {ImageToolConfig} savedData
   * @return {boolean}
   */
  validate(savedData){
    return true;
  }

  /**
   * Making a Block settings: 'add border', 'add background', 'stretch to full width'
   * @see https://editorjs.io/making-a-block-settings — tutorial
   * @see https://editorjs.io/tools-api#rendersettings - API method description
   * @return {HTMLDivElement}
   */
  renderSettings(){
    const wrapper = document.createElement('div');

    this.settings.forEach( tune => {
      let button = document.createElement('div');

      button.classList.add(this.api.styles.settingsButton);
      button.classList.toggle(this.api.styles.settingsButtonActive, this.data[tune.name]);
      button.innerHTML = tune.icon;
      wrapper.appendChild(button);

      button.addEventListener('click', () => {
        this._toggleTune(tune.name);
        button.classList.toggle(this.api.styles.settingsButtonActive);
      });

    });

    return wrapper;
  }

  /**
   * @private
   * Click on the Settings Button
   * @param {string} tune — tune name from this.settings
   */
  _toggleTune(tune) {
    this.data[tune] = !this.data[tune];
    this._acceptTuneView();
  }

  /**
   * Add specified class corresponds with activated tunes
   * @private
   */
  _acceptTuneView() {
    this.settings.forEach( tune => {
      this.wrapper.classList.toggle(tune.name, !!this.data[tune.name]);

      if (tune.name === 'stretched') {
        this.api.blocks.stretchBlock(this.api.blocks.getCurrentBlockIndex(), !!this.data.stretched);
      }
    });
  }


}