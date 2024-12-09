FROM node:18

# Set the working directory.
WORKDIR /app

# Copy the rest of the application code.
COPY . .

# Install dependencies.
RUN yarn install

# Expose the port the app runs on.
EXPOSE 1234

# Start the application.
CMD ["yarn", "start"]