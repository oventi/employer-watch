import React from 'react';
import ReactDOM from 'react-dom';
import ReportList from './ReportList.js'

if(window) {
  window.util = {
    clean: () => {
      delete localStorage['page']
      delete localStorage['cards']

      window.location.reload()
    }
  }
}

let root = document.getElementById('root')
ReactDOM.render(<ReportList />, root)
