# Employer Watch
API and apps to identify and show which employers are paying unfairly to their employees 
Prototype application: http://apps.oventi.net/employer-watch 

## Motivation
Ever since I migrated to Australia, I have noticed and keept my self informed about work exploitation. The issue started affecting me more personally when my partner was underpaid in a job. I [wrote about](http://15hoursahead.com/worker-exploitation-in-australia/) it in my blog, and algo got motivated to create a way to show employers who underpay.

## Purpose
1. Help people find a fair place to apply for a job, avoiding exploitation
2. Let consumers buy from fair workplaces and avoid places who exploit employees

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

----

## Preliminary Data Structures

### Employer
- location: Location, Geocode or Geohash
- reports: Report[]
- brand: string

### Report
- source: enum (gov, news article, person)
- employer: Employer
- location: Location

### Location
- country: string
- adm1: string (state, territory, province, etc)
- adm2: string (city, county, etc)
- address: string
- employers: Employer[]
