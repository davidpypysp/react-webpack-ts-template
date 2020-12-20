FROM node:latest

ADD dist /dist

EXPOSE 5000

CMD ["node", "/dist/server.bundle.js"]