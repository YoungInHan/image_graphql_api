# Shopify image API challenge

This repository is my backend API for the Shopify recruiting challenge. It is a pure GraphQL API with all endpoints being accessable at `/graphql`.

The server is currently deployed on Heroku at

```
https://nameless-coast-47770.herokuapp.com/graphql
```

## Endpoints

Examples are given for the following endpoints

### createUser (mutation)

```
mutation {
  createUser(data:{username: "foo", email: "foo@bar.com", password: "bar"}) {
    id
    username
    email
	}
}
```

### login (mutation)

must ensure `"request.credentials": "include",` in GraphQL playground settings

```
mutation {
  login(email: "y@gmail.com", password: "pass") {
    id
    username
  }
}
```

### createPicture (mutation)

```
mutation {
  createPicture(
    data: {
      name: "dog"
      description: "this is a dog"
      link: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/%27aehoe%27.JPG/1280px-%27aehoe%27.JPG"
      publicVisible: true
    }
    tags: ["animal", "dog"]
  ) {
    id
    name
    description
    uploadDate
    uploader {
      username
    }
  }
}
```

### deletePicture (mutation)

```
mutation {
  deletePicture(id:"6002437f9fa42c00041095cf")
}
```

### uploadPictureFile (mutation) - experimental

```
mutation($image: Upload!) {
  uploadPictureFile(
    data: {
      name: "cat"
      description: "this is a feline cat creature"
      publicVisible: true
    }
    tags: ["cat", "feline", "pet", "animal", "cute"]
    image: $image
  ) {
    id
    name
    description
    tags
    link
    uploader {
      id
      username
    }
  }
}
```

### returnPublicPictures (query)

```
query {
  returnPublicPictures {
    name
    description
    uploader{
      username
    }
  }
}
```

### returnCurrentUserPictures (query)

```
query {
  returnCurrentUserPictures {
    name
    description
    tags
  }
}
```

### search (query)

```
query {
  search(searchText: "cat") {
    name
    description
    tags
    uploader{
      username
    }
  }
}
```
