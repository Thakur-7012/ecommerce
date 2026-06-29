# Ecommerce DB Dump

Database name: `ecommerce`

MongoDB URI:

```txt
mongodb://127.0.0.1:27017/ecommerce
```

Current collections found during dump: none.

The dump archive is at:

```txt
ecommerce-db-dump.archive
```

Restore command:

```txt
mongorestore --uri mongodb://127.0.0.1:27017/ecommerce --archive=ecommerce-db-dump.archive
```

After adding products through `POST /api/product/addProduct`, MongoDB will create the `products` collection.
