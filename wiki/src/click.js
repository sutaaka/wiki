import React, { Component } from 'react';
import './App.css';
// import logo from './logo.svg';
// import { Provider } from 'react-redux'
import Tree from 'react-d3-tree';
import axios from 'axios';
import clone from 'clone';
//import update from 'immutability-helper';

//const selectList = []

function sleep(waitMsec) {
  var startMsec = new Date();

  while (new Date() - startMsec < waitMsec);
}

const getAncestorNodeNames = (nodeData, names = []) => {
  const newNames = names.concat(nodeData.name)
  if(nodeData.parent) {
    return getAncestorNodeNames(nodeData.parent, newNames)
  } else {
    return newNames
  }
}

const selectNode = (data, nodeNames) => {
  //console.log("fillColor")
  const child = data.find(child => child.name === nodeNames[0])

  if (nodeNames.length > 1) {
    return selectNode(child.children, nodeNames.slice(1))
  } else {
    if(child.clicked){
      console.log('true')
      child.nodeSvgShape = {
        shape: 'rect',
        shapeProps: {
        width: 20,
        height: 20,
        x: -10,
        y: -10,
        }
      }
      child.clicked = false
    }
    else{
      //console.log(child)
    child.nodeSvgShape = {
    shape: 'rect',
    shapeProps: {
    width: 20,
    height: 20,
    x: -10,
    y: -10,
    fill: 'red'
    }
  }
  child.clicked = true
}
  }
}

const mutateData = (data, nodeNames, categories) => {
  //console.log(categories)
  const child = data.find(child => child.name === nodeNames[0])

  if (nodeNames.length > 1) {
    return mutateData(child.children, nodeNames.slice(1), categories)
  } else {
    child.children = categories.map(category => {
      return {
        name: category
      }
    })
  }
}

const SelectList = (props) =>{
  const selectList = props.selectList
}

const Pages = (props) => {
  console.log(props)
  const pages = props.pages.map((page,index) => <li key={index}>{page.page.name}</li>)
  return (
    <ul>{pages}</ul>
  )
}

const svgSquare = {
  shape: 'rect',
  shapeProps: {
    width: 20,
    height: 20,
    x: -10,
    y: -10,
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.onMouseOver = this.onMouseOver.bind(this)
    this.onClick = this.onClick.bind(this)
    this.onClickLi = this.onClickLi.bind(this)
    this.state = {
      select: [],
      pages: [],
      data: [
        {
          name: '音楽',
          attributes: {
          },
          children: [
          ],
        },
      ]
    };
  }

  componentDidMount() {
  }

  componentDidUpdate(prevProps, prevState){
    //console.log('sleep')
    sleep(500)
    //console.log('sleeped')
    /* 再描画後に実際のDOMにアクセスするためのメソッド */
  }

  onClickLi(e) {
    e.stopPropagation()  // ** コード追加 **
    console.log('this' + this.state.select)
    axios
        .post('http://localhost:3001/search', {
          word: this.state.select
        })
        .then((response) => {
          //console.log(response)
          this.setState({ pages: response.data })
          console.log(response)
        })
          // const data = clone(this.state.data)
          //const nodeNames = getAncestorNodeNames(nodeData).reverse()
          //mutateData(data, nodeNames, response.data)
          //this.setState({ data })

}


  onClick(nodeData, evt){
    console.log("nodeData" + nodeData)
    if(nodeData.clicked){

    }
    else{
      //this.setState({ selectList: [this.state.selectList.concat(nodeData.name)] })
    }
    const data = clone(this.state.data)
    const ss = this.state.select
    const nodeNames = getAncestorNodeNames(nodeData).reverse()
    selectNode(data, nodeNames)

    if(ss.indexOf(nodeData.name) >= 0){
      console.log('fill')
       const selects = ss.filter(function(select) {
        return select !== nodeData.name;
      });
      console.log("fill  = " + selects)
      this.setState({select: selects})
    }
    else{
      console.log('push')
      const selects = ss
      selects.push(nodeData.name)
      this.setState({select: selects})
    }
    this.setState({ data })
    console.log('maekawa' + this.state.select)
  }

  onMouseOver(nodeData, evt) {
    console.log(nodeData)
    if(! nodeData.children){
      console.log('yay!')
      axios
        .post('http://localhost:3001/category', {
          word: nodeData.name
        })
        .then((response) => {
          const data = clone(this.state.data)
          const nodeNames = getAncestorNodeNames(nodeData).reverse()
          mutateData(data, nodeNames, response.data)
          this.setState({ data })
        })
      // axios
        // .post('http://localhost:3001/page', {
          // word: nodeData.name
        // })
        // .then((response) => {
          // console.log('res')
          // console.log(response)
          // this.setState({ pages: response.data })
        // })
    }
  }

  render() {
    return (
      <div id="root" style={{width: '1500px', height: '1000px', position: "relative", top: "5px", left: "5px"}}>
        {/* <Tree /> will fill width/height of its container; in this case `#treeWrapper` */}
        <div id="treeWrapper" style={{width: '1000px', height: '1000px',position: "absolute", top: "15px", left: "15px"}}>
          <Tree
            data={this.state.data}
            onMouseOver={this.onMouseOver}
            onClick={this.onClick}
            nodeSvgShape={svgSquare}
          />
        </div>

        <div id="pages" style={{width: '270px', height: '1000px', position: "absolute", top: "15px", left: "1020px"}}>
          <Pages pages={this.state.pages}/>
        </div>

        <div id="select">
          <ul onClick={this.onClickLi}>
            <button type="button">
              <li></li>
            </button>
          </ul>
        </div>

      </div>
    );
  }
}

export default App;