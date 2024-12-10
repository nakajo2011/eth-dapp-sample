FROM node:20

# Set the working directory.
WORKDIR /app

# Copy package.json and yarn.lock files.
COPY package.json ./

# Copy the rest of the application code.
COPY ./ /app/

# Install dependencies.
RUN yarn install

# Expose the port for Hardhat node.
EXPOSE 8545

# Start Hardhat node and deploy contracts.
CMD ["sh", "-c", "npx hardhat compile && npx hardhat node"]