import React from 'react';
import ReactDOM from 'react-dom';
import EmployerWatch from './EmployerWatch.js'

const api_endpoint = 'https://employer-watch-api.herokuapp.com'
//const api_endpoint = 'http://localhost:5000'

let root = document.getElementById('root')
ReactDOM.render(<EmployerWatch api-endpoint={api_endpoint} />, root)
