## Install Dependencies

```bash
$ npm install
```

## Start

```
$ npm start
...
<i> [webpack-dev-server] Project is running at:
<i> [webpack-dev-server] Loopback: http://localhost:8080/
...
```

## Common Issues

### GL fails to build during `npm install` with `error: ‘uintptr_t’ does not name a type`
Depending on your version of GCC and G++, some opengl-related libraries may fail to compile properly.
If this happens, try installing with:
```
$ CC=gcc-11 CXX=g++-11 npm install
```