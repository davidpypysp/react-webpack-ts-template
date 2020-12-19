FROM node:latest

RUN mkdir /remote_desktop_web
ADD dist /remote_desktop_web/dist
ADD server_dist /remote_desktop_web/server_dist

EXPOSE 5000

CMD ["node", "/remote_desktop_web/server_dist/server.bundle.js"]