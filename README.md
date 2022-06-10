## Jubelio Fullstack Web Ecommerce

### `Getting Started`

This is an app test for Jubelio Full Stack App.

  

### `Installing`

to install all dependencies use this command below in each folder (**./fe** and **./api**)

```

npm install

```

or

```

yarn install

```

### `Starting`

to start use

  

**DB**

- Create DB on Postgres named `jubelio_db`

- Execute db_jubelio.sql

- Change **.env** file to match DB credentials

  

**API** (default using port 8081)

```

cd api

```

```

node server.js

```

  

**FE** (default using port 3000)

```

cd fe

```

```

npm start

```

### `API Docs`

- Postman collection : jubelio_api.postman_collection.json

- HTML docs : inside ./jubelio_api_html_docs

### Roadmap

 - [x] Create simple e-commerce web app
	 - [x] Web API endpoints (list product and detail)
	 - [x] Integrate with Elevania API to fetch all product list and import to database
 - [x] Tech Stack
	 - [x] Frontend
		 - [x] UI library: React.js
		 - [x] State management: MobX
	 - [x] Backend
		 - [x] JS Platform: Node JS
		 - [x] API framework: Hapi.js
	 - [x] Database
		 - [x] PostgreSQL
 - [ ] Requirement
	 - [x] -   Fetching all product list from Elevania API and import to database
	 - [x] -   The data of the product must have Name, SKU, Image, Price, and Description.
	 - [x] -   SKU cannot be duplicate, and Description can be null.
	 - [x] -   Create the secure Web API endpoints of Product.
	 - [x] -   Display list of all products (with product image) in card layout theme, and editable detail product inside modal popup.
	 - [x] -   Must use infinite scroll for pagination
	 - [x] -   User can add new product and save to database.
	 - [x] -   User can edit or delete existing product and save to database.
	 - [x] -   Use a raw SQL query, instead of ORM.
	 - [x] -   Provide migration script for create table in database.
	 - [x] -   Use API key:  to integrate with Elevania API.
 - [ ] Non-functional requirement
	 - [ ] -   Good, sensible file structuring that promotes modularity and good separation of logical/UI layers. (not applied to everything)
	 - [ ] -   Adhere a good coding practices. (not applied to everything)
	 - [x] -   Add a unit testing script for Web API is a big plus.
	 - [x]  -   Responsive UI display is a big plus.
	 - [ ] -   Configuring full stack logging & tracing is a big plus.
	 - [ ] -   Set customized Lints that encourage good coding practices is a big plus. (using standardJS)
	 - [ ] -   Preferable to use a distributed version control system.
	 - [x] -   Clear instructions on how to run your app locally. Please provide clear explanations about your project and how do we run it locally (using README.md is preferable).
	 - [x] -   Delivering with a file zip is big no.