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

        let card = $(e.currentTarget).closest('.card')
        let button = $(e.currentTarget)
        let spinner = $(e.currentTarget).parent().find('.saving')
        button.hide()
        spinner.show()

        let $inputs = $(e.currentTarget).parent().find('input')
        $inputs.each((index, input) => {
            let $input = $(input)
            data[$input.attr('name')] = $input.val()
        })

        let uri = window.location.href.replace(':5002', ':5003')
        let persistence_uri = `${uri}/save`
        $.ajax({
            url: persistence_uri, type: 'post', data: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' },
            dataType: 'json',
            success: () => {
                card.slideUp()

                let cards = JSON.parse(localStorage.cards)
                cards[card.attr('id')] = true
                localStorage.cards = JSON.stringify(cards)

                this.props.after_action()
            }
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
            <Card key={report.key} id={report.key}>
                <CardBlock>
                    <CardTitle className="h5">{report.title}</CardTitle>
                    <Row>
                        <Col key="report_text" className="report_text">
                            <CardText>{report.text}</CardText>
                        </Col>
                        <Col key="report_meta"  >
                            <Form action="/api/save" method="post" className="fwo_report">
                                <input type="hidden" name="key" value={report.key} />

                                <FwoReportMetaField name="company" label="Company name" value={company} />
                                <FwoReportMetaField name="trading" label="Trading name" value="" />
                                {/*<FwoReportMetaField name="address" label="Address" value="" />*/}
                                <FwoReportMetaField name="city" label="City / Town" value={city} />
                                <FwoReportMetaField name="state" label="State / Territory" value={state} />

                                <Button onClick={this.save_report} color="success" className="float-left">save</Button>
                                <Button onClick={this.props.after_action} color="secondary" className="float-right">dismiss</Button>
                                <div className="saving">
                                    <i className="fa fa-spinner fa-spin" aria-hidden="true"></i>
                                </div>
                            </Form>
                            <div id="page_number">PAGE: {localStorage.page}</div>
                        </Col>
                    </Row>
                </CardBlock>
            </Card>
        )
    }
}

export default FwoReport
