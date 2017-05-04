import React from 'react'
import ReactDOM from 'react-dom'
import {
    Container, Row, Col, Alert,
    InputGroup, Input, InputGroupAddon
} from 'reactstrap'
import SearchResult from './SearchResult.js'

const api_url = 'https://employer-watch-api.herokuapp.com'

class EmployerWatch extends React.Component {
    constructor(props) {
        super(props)

        this.default_state = { term: '', searching: false, results: null, error: false, search_count: 0 }
        this.state = this.default_state

        this.search = this.search.bind(this)
        window.onpopstate = this.back_button_handler.bind(this)
    }

    search() {
        let $input = $('#search_box_container input')
        let term = $input.val().replace('-', ' ').trim()
        if(term === '') {
            return
        }

        $('#footer').show()
        window.history.pushState({ action: 'search' }, 'search')

        let search_count = this.state.search_count + 1
        this.setState({ term: term, searching: true, results: [], error: false, search_count: search_count })
        $input.blur()

        let api_call_url = `${api_url}/search?term=${encodeURIComponent(term)}`
        $.getJSON(api_call_url, data => {
            this.setState({ searching: false, results: data, error: (typeof data.error !== 'undefined') })
        }).fail((jqx, status) => {
            this.setState({ searching: false, error: true })
        })
    }

    back_button_handler() {
        this.setState(this.default_state)
    }

    componentDidMount() {
        $('#search_box_container').on('focus', 'input', (e => {
            $('#footer').hide()
        }).bind(this))

        $('#search_box_container').on('keypress', 'input', (e => {
            if(e.keyCode === 13) { this.search() }
        }).bind(this))

        $('#search_box_container').on('click', 'button', this.search)
    }

    componentDidUpdate() {
        $('#search_box_container input').val(this.state.term)
        $(window).scrollTop(0)
    }

    get_notifications() {
        let spinner = !this.state.searching ? null : (
            <div key="spinner" className="spinner text-center">
                <i className="fa fa-spinner fa-pulse fa-2x fa-fw"></i>
            </div>
        )

        let error = null
        if(this.state.results && this.state.results.error) {
            error = <Alert key="building_index" color="info">System is restarting, please try again in a few minutes</Alert>
        }
        else if(this.state.error) {
            error = <Alert key="error" color="danger">There was an error when searching, please try again</Alert>
        }

        return [spinner, error]
    }

    get_search_results() {
        if(this.state.results === null || this.state.error || this.state.searching) {
            return null
        }

        let results = []
        this.state.results.forEach(result => {
            results.push(<SearchResult term={this.state.term} result={result} key={result.key} />)
        })

        if(results.length <= 0) {
            results = <Alert color="info">Your search did not match any documents</Alert>
        }

        return results
    }

    get_search_box() {
        let brand = <i className="fa fa-eye" aria-hidden="true"></i>
        let search = (
            <InputGroup>
                <Input type="search" />
                <span className="input-group-btn">
                    <button className="btn btn-secondary" type="button">
                        <i className="fa fa-search" aria-hidden="true"></i>
                    </button>
                </span>
            </InputGroup>
        )
        let rows = []

        if(this.state.search_count <= 0) {
            rows.push(
                <Row key="brand">
                    <Col>
                        <h1>{brand} <span>Employer Watch</span></h1>
                    </Col>
                </Row>
            )

            rows.push(<Row key="search"><Col>{search}</Col></Row>)
        }
        else {
            rows.push(
                <Row key="brand_search">
                    <Col key="search_brand" xs="2"><h1>{brand}</h1></Col>
                    <Col key="search_box" xs="10">{search}</Col>
                </Row>
            )
        }

        return rows
    }

    render() {
        let container_class = this.state.search_count <= 0 ? 'workflow_start' : 'workflow_results'

        let footer_class = 'small card '
        if(this.state.searching) {
            footer_class += 'hidden-xs-up'
        }
        else if(this.state.search_count <= 0) {
            footer_class += 'fixed-bottom'
        }

        return (
            <Container className={container_class} fluid="true">
                <div id="search_box_container">
                    {this.get_search_box()}
                </div>

                <div id="search_results_container">
                    {this.get_notifications()}
                    {this.get_search_results()}
                </div>

                <div id="footer" className={footer_class}>
                    <div className="card-block p-3">
                        <p className="mb-2">
                            Employer Watch Application. &copy; 2017 <a href="http://oventi.org">Oventi</a>.
                        </p>
                        <p className="mb-0">
                            <a href="https://www.fairwork.gov.au/about-us/news-and-media-releases">News and media releases</a>.
                            &copy; <a href="https://www.fairwork.gov.au/">FWO</a> under &nbsp;
                            <a rel="license" href="https://creativecommons.org/licenses/by/3.0/au/legalcode"><img alt="Creative Commons License" src="https://i.creativecommons.org/l/by/4.0/80x15.png" /></a>
                        </p>
                    </div>
                </div>
            </Container>
        )
    }
}

export default EmployerWatch
