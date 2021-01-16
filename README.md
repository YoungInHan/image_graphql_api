### Shopify image app

graphql and express

`mutation($image: Upload!) { uploadPictureFile( data: { name: "cat" description: "this is a feline cat creature" publicVisible: true } tags: ["cat", "feline", "pet", "animal", "cute"] image: $image ) { id name description tags link uploader { id username } } }`
