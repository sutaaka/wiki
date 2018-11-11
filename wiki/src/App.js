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
  const pages = props.pages.map(page => <li>{page.name}</li>)
  return (
    <ul>{pages}</ul>
  )
}

class App extends Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this)
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

  onClick(nodeData, evt) {
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
        this.setState({ pages: response.data })
      })
  }

  render() {
    return (
      <>
        {/* <Tree /> will fill width/height of its container; in this case `#treeWrapper` */}
        <div id="treeWrapper" style={{width: '500em', height: '500em'}}>
          <Tree
            data={this.state.data}
            onClick={this.onClick}
          />
        </div>

        <Pages pages={this.state.pages}/>
      </>
    );
  }
}

export default App;
