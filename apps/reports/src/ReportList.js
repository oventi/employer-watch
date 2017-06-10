import React from 'react'
import ReactDOM from 'react-dom'
import { Container, Row, Col, Button } from 'reactstrap'
import FwoReport from './FwoReport.js'

const config = require('./config.js')

class ReportList extends React.Component {
    constructor(props) {
        super(props)

        this.default_state = { reports: [], loading: true }
        this.state = this.default_state

        this.load_reports = this.load_reports.bind(this)
        this.previous_page = this.previous_page.bind(this)
        this.next_page = this.next_page.bind(this)

        //localStorage.page = 1
        if(typeof localStorage.cards === 'undefined') {
            localStorage.cards = '{}'
        }
    }

    componentDidMount() {
        $('button.previous').click(this.previous_page)
        $('button.next').click(this.next_page)

        this.load_reports(this.get_current_page())
    }

    get_current_page() {
        let page = typeof localStorage.page === 'undefined' ? 1 : localStorage.page

        return parseInt(page)
    }

    previous_page() {
        let page = this.get_current_page()
        let previous_page = page > 1 ? page - 1 : 1

        this.load_reports(previous_page)
    }

    next_page() {
        let page = this.get_current_page()
        let next_page = page + 1

        this.load_reports(next_page)
    }

    load_reports(page) {
        console.log('load_reports', page)
        let page_size = 1;
        let reports_uri = `${config.employer_watch_api}/list?page=${page}&page_size=${page_size}`

        $.getJSON(reports_uri, report_list => {
            let reports = []

            report_list.forEach(report => {
                //console.log('localStorage.cards', localStorage.cards)
                let cards = JSON.parse(localStorage.cards)
                if(!cards[report.key]) {
                    reports.push(<FwoReport key={report.key} data={report} after_action={this.next_page} />)
                }
            })

            if(reports.length > 0) {
                this.setState({ reports: reports })
                localStorage.page = page
            }
        })
    }

    componentDidUpdate() {
        $('.card').height(  ($(document).innerHeight() - 50) + 'px'  )
        $('.report_text').height(  ($(document).innerHeight() - 120) + 'px'  )
    }

    render() {
        return (
            <Container fluid={true}>
                {/*<Row>
                    <Col>
                        <Button className="previous float-left">previous</Button>
                        <Button className="next float-right">next</Button>
                    </Col>
                </Row>
                <hr />*/}
                {this.state.reports}
                {/*<hr />
                <Row>
                    <Col>
                        <Button className="previous float-left">previous</Button>
                        <Button className="next float-right">next</Button>
                    </Col>
                </Row>
                <br/>*/}
            </Container>
        )
    }
}

export default ReportList
