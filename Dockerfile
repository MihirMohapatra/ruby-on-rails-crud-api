FROM ruby:3.2.3-slim

ENV BUNDLE_PATH=/usr/local/bundle \
    RAILS_ENV=development

WORKDIR /rails

RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential libpq-dev postgresql-client && \
    rm -rf /var/lib/apt/lists/*

COPY Gemfile ./
RUN bundle install

COPY . .

ENTRYPOINT ["/bin/bash", "bin/docker-entrypoint"]
EXPOSE 3000

CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0"]
