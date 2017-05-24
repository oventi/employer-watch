import React from 'react'
import ReactDOM from 'react-dom'
import { Container } from 'reactstrap'
import FwoReport from './FwoReport.js'

const config = require('./config.js').default

class FwoReports extends React.Component {
    constructor(props) {
        super(props)

        this.default_state = { reports: [], loading: true }
        this.state = this.default_state
    }

    search() {
        let api_call_url = `${this.props['api-endpoint']}/search?term=${encodeURIComponent(term)}`
        $.getJSON(api_call_url, data => {
            this.setState({ searching: false, results: data, error: (typeof data.error !== 'undefined') })
        }).fail((jqx, status) => {
            this.setState({ searching: false, error: true })
        })
    }

    componentDidMount() {
        $.getJSON('/fwo_reports.json', report_list => {

            let reports = []

            report_list.forEach(report => {
                reports.push(<FwoReport key={report.key} data={report} />)
            })

            this.setState({ reports: reports.slice(0, 5) })
        })
    }

    componentDidUpdate() {

    }

    render() {
        return (
            <Container fluid={true}>
            {this.state.reports}
            </Container>
        )
    }
}

export default FwoReports
