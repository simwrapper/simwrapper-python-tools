FROM nginx:alpine

WORKDIR /app
COPY . /app

# nginx config
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/
COPY htpasswd /etc/nginx/htpasswd

# python
ENV PYTHONUNBUFFERED=1
RUN apk add --update --no-cache python3 py3-pip && ln -sf python3 /usr/bin/python
RUN pip3 install --no-cache --upgrade pip setuptools

# Flask/Gunicorn
RUN pip3 install --no-cache gunicorn flask flask-restful flask-reuploaded

# Supervisor
RUN apk add supervisor
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

EXPOSE 80

CMD /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
