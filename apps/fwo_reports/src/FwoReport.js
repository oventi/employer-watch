'use strict'

import React from 'react'
import ReactDOM from 'react-dom'

import FwoReportMetaField from './FwoReportMetaField.js'
import { Card, Row, Col, Form, CardText, CardBlock, CardTitle, Button } from 'reactstrap'

const config = require('./config.js')

class FwoReport extends React.Component {
    constructor(props) {
        super(props)

        this.save_report = this.save_report.bind(this)
    }

    save_report(e) {
        let data = {}

        let $inputs = $(e.currentTarget).parent().find('input')
        $inputs.each((index, input) => {
            let $input = $(input)
            data[$input.attr('name')] = $input.val()
        })

        $.ajax({
            url: `${config.api}/save`, type: 'post', data: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' },
            dataType: 'json',
            success: () => {}
        })
    }

    render() {
        let report = this.props.data

        let company = report.meta['organisations'] ? report.meta.organisations[0] : ''
        let city = report.meta['locations'] && report.meta['locations']['lgas'] && report.meta['locations']['lgas']['lga'] ?
                report.meta.locations.lgas[0].lga : ''
        let state = report.meta['locations'] && report.meta['locations']['divisions'] ?
                report.meta.locations.divisions[0] : ''

        return (
            <Card key={report.key}>
                <CardBlock>
                    <CardTitle className="h5">{report.title}</CardTitle>
                    <Row>
                        <Col key="report_text">
                            <CardText>{report.text}</CardText>
                        </Col>
                        <Col key="report_meta">
                            <Form action="/api/save" method="post" className="fwo_report">
                                <input type="hidden" name="key" value={report.key} />

                                <FwoReportMetaField name="company" label="Company name" value={company} />
                                <FwoReportMetaField name="trading" label="Trading name" value="" />
                                <FwoReportMetaField name="address" label="Address" value="" />
                                <FwoReportMetaField name="city" label="City / Town" value={city} />
                                <FwoReportMetaField name="state" label="State / Territory" value={state} />

                                <Button onClick={this.save_report} color="success">save</Button>
                            </Form>
                        </Col>
                    </Row>
                </CardBlock>
            </Card>
        )

        /*
        <div className="form-group row">
            <Col><input type="text" className="form-control" value={company} placeholder="Company name" /></Col>
            <Col><input type="text" className="form-control" placeholder="Trading name" /></Col>
        </div>
        <div className="form-group">
            <input type="text" className="form-control" placeholder="Address" />
        </div>
        <div className="form-group row">
            <Col><input type="text" className="form-control" placeholder="City / Town" value={city} /></Col>
            <Col><input type="text" className="form-control" placeholder="State / Territory" value={state} /></Col>
        </div>
        */
    }
}

export default FwoReport
