'use strict'

import React from 'react'
import ReactDOM from 'react-dom'

import { Card, CardImg, CardText, CardBlock, CardTitle, CardSubtitle, Button } from 'reactstrap'

class SearchResult extends React.Component {
    constructor(props) {
        super(props)

        this.result = this.props.result
        this.unique_id = 0;
    }

    get_highlighted_search_words(text) {
        let term_regex = new RegExp(this.props.term.replace(' ', '|'), 'gi')
        let prefix = new Date().getTime() + Math.random()

        if(!text.match(term_regex)) {
            return text
        }

        let words = text.split(' ')
        words = words.map((word, i) => {
            if(word.match(term_regex)) {
                return <strong key={'word' + prefix + i} className="search_word">{word}</strong>
            }

            return `${word} `
        })

        return words
    }

    get_description() {
        let description = []

        let sentence_regex = new RegExp('.*(' + this.props.term.replace(' ', '|') + ').*\.', 'gi')
        let sentences = this.result.text.match(sentence_regex)
        if(sentences) {
            //sentences.forEach((sentence, i) => {
            let words = this.get_highlighted_search_words(sentences[0])
            description = description.concat(words)
            //})
        }
        else {
            description = this.result.meta.description
        }

        return description
    }

    render() {
        let url = this.result.url
        let title = this.get_highlighted_search_words(this.result.title)
        let description = this.get_description()

        return (
            <Card>
                <CardBlock>
                    <CardTitle className="h5">
                        <a href={url} target="fwo">{title}</a>
                    </CardTitle>
                    {/*<CardSubtitle>{subtitle}</CardSubtitle>*/}
                    <CardText>{description}</CardText>
                </CardBlock>
            </Card>
        )
    }
}

export default SearchResult
