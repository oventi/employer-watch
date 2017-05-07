# Proof of concept API

## Build and run
```bash
npm install
npm start
```

## Use

The api will be accesible via <http://localhost:5000>, and the building of the search index will start. Until that is ready, an error will be returned.

Once the search index is built, use the ```/search?term=[text]``` call to get results in json. For example <http://localhost:5000/search?term=subway> 
