# Employer Watch
API and apps to identify and show which employers are paying unfairly to their employees.
Prototype application: http://apps.oventi.net/employer-watch

## Motivation
Ever since I migrated to Australia, I have noticed and kept myself informed about work exploitation. The issue started affecting me more personally when my partner was underpaid in a job. I [wrote about](http://15hoursahead.com/worker-exploitation-in-australia/) it in my blog, and algo got motivated to create a way to show employers who underpay.

## Purpose
1. Help people find a fair place to apply for a job, avoiding exploitation
2. Let consumers buy from fair workplaces and avoid places who exploit employees

## [Frequently Asked Questions](docs/faq.md)

## Roadmap
* Data
  * Define data structures
  * Crawl web pages and other resources to find work exploitation data ([FWO](https://www.fairwork.gov.au/about-us/news-and-media-releases) for example)
  * Data mine and ETL to data structures
  * Setup distributed NoSQL databases
* API
  * Define resources / calls and paths (consider data's country of origin)
  * Define calls for registering new company's work exploitation complaints / reports
  * Implement code with NodeJS
  * Setup in AWS
  * [Try Lambda with API Gateway](http://docs.aws.amazon.com/apigateway/latest/developerguide/getting-started.html)
* Apps
  * Search app with React
  * iOS/Android apps with React Native
  * Web based app to register complaints for a company

## Examples

[Proof of concept API](./api): search work exploitation reports

[Proof of search app](./apps/search): react web app to use POC api and search reports

----

## Proposed API calls
- Search work exploitation reports by full text and keywords
- Search employers who are exploiting workers by employer name and location
- List companies who are exploiting workers
- List locations that have employers exploiting workers
- List work exploitation reports by employer and location

## Proposed end user applications
- Work exploitation search app
- List of fair and unfair employers per country
- Map of work exploitation
- Check exploitation reports of an employer

## Preliminary Data Structures

### Employer
- id
- key (temporary)
- company: string
- trading: string
- brand: string
- location: Location, Geocode or Geohash

### Source
- organisation
- url

### Report
- id
- key (temporary)
- timestamp
- source: Source
- title
- summary (meta description)
- text

### Location
- country: string
- adm1: string (state, territory, province, etc)
- adm2: string (city, county, etc)
- address: string
- employers: Employer[]

----

## Preliminary API urls

### Employer
/1.0/au/employers
```json
{
    "employers": [
        { "id": "123", "etc": "" },
        { "id": "456", "etc": "" }
    ],
    "meta": {
        "self": "/1.0/au/employers",
        "previous": "/1.0/au/employers",
        "next": "/1.0/au/employers/2"
    }
}
```

/1.0/au/employer/[employer id]
```json
{ "id": "123", "etc": "" }
```

### Reports

/1.0/au/reports
```json
{
    "reports": [
        { "id": "123", "etc": "" }
    ],
    "meta": {
        "self": "/1.0/au/reports",
        "previous": "/1.0/au/reports",
        "next": "/1.0/au/reports/2"
    }
}
```

/1.0/au/reports/[page id/number]

/1.0/au/report/[report id]
