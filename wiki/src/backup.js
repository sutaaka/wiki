import React, { Component } from 'react';
import './App.css';
// import logo from './logo.svg';
// import { Provider } from 'react-redux'
import Tree from 'react-d3-tree';
import axios from 'axios';
import clone from 'clone'

const getAncestorNodeNames = (nodeData, names = []) => {
  const newNames = names.concat(nodeData.name)
  if(nodeData.parent) {
    return getAncestorNodeNames(nodeData.parent, newNames)
  } else {
    return newNames
  }
}

const mutateData = (data, nodeNames, categories) => {
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
    this.onClick = this.onClick.bind(this)
    this.onContextMenu = this.onContextMenu.bind(this)
    this.state = {
      pages: [],
      data: [
        {
          name: '主要カテゴリ',
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

  onContextMenu(){
    console.log("right")
  }


  onClick(nodeData, evt) {
    console.log(nodeData)
    if(! nodeData._children){
      console.log('yay!')
      console.log(nodeData._children)
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

      axios
        .post('http://localhost:3001/page', {
          word: nodeData.name
        })
        .then((response) => {
          //console.log(response)
          this.setState({ pages: response.data })
        })
    }
  }


  render() {
    return (
      <div id="root" style={{width: '1500px', height: '1000px', position: "relative", top: "5px", left: "5px"}}>
        {/* <Tree /> will fill width/height of its container; in this case `#treeWrapper` */}
        <div id="treeWrapper" style={{width: '1000px', height: '1000px',position: "absolute", top: "15px", left: "15px"}}>
          <Tree
            data={this.state.data}
            onClick={this.onClick}
            onContextMenu={this.onClick}
            nodeSvgShape={svgSquare}
          />
        </div>

        <div id="pages" style={{width: '270px', height: '1000px', position: "absolute", top: "15px", left: "1020px"}}>
          <Pages pages={this.state.pages}/>
        </div>
      </div>
    );
  }
}

export default App;
