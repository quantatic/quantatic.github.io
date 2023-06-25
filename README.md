## Install Dependencies

```bash
$ npm install
```

## Start

```
$ npm run dev
...
VITE v......  ready in ... ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
...
```

## Common Issues

### GL fails to build during `npm install` with `error: ‘uintptr_t’ does not name a type`
Depending on your version of GCC and G++, some opengl-related libraries may fail to compile properly.
If this happens, try installing with:
```
$ CC=gcc-11 CXX=g++-11 npm install
```