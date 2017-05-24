'use strict'

import React from 'react'
import ReactDOM from 'react-dom'

import { InputGroup, InputGroupAddon, Input } from 'reactstrap'

class FwoReportMetaField extends React.Component {
    render() {
        return (
            <InputGroup>
                <InputGroupAddon>{this.props.label}</InputGroupAddon>
                <Input name={this.props.name} value={this.props.value} />
            </InputGroup>
        )

        /*
        <div className="form-group row">
            <label className="col-sm-2 col-form-label">{this.props.label}</label>
            <div className="col-sm-10">
                <input type="email" className="form-control">
            </div>
        </div>
        */
    }
}

export default FwoReportMetaField
