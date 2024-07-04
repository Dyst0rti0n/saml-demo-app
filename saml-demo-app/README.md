# SAML Demo App

This project demonstrates a simple application with SAML authentication and intentionally introduced vulnerabilities for educational purposes.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Generating SAML Certificates](#generating-saml-certificates)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Contact](#contact)

## Prerequisites

- Node.js and npm: Install from [Node.js](https://nodejs.org/).
- OpenSSL: Install from [OpenSSL](https://slproweb.com/products/Win32OpenSSL.html) for Windows or use the package manager for MacOS/Linux.
- `saml-idp` package: Install globally using npm.

```bash
npm install -g saml-idp
```

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Dyst0rti0n/saml-demo-app.git
   cd saml-demo-app
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

## Generating SAML Certificates

1. **Generate the Service Provider (SP) certificates**:

   ```bash
   openssl req -newkey rsa:2048 -new -nodes -x509 -days 365 -keyout private-key.pem -out certificate.pem
   ```

2. **Generate the Identity Provider (IdP) certificates**:

   ```bash
   openssl req -newkey rsa:2048 -new -nodes -x509 -days 365 -keyout idp-private-key.pem -out idp-public-cert.pem
   ```

   - Fill in the required information for the certificates with random nonsense (Country, State, etc.).

## Running the Application

1. **Start the Identity Provider (IdP)**:

   ```bash
   saml-idp --acsUrl http://localhost:3000/assert --audience http://localhost:3000/metadata.xml --key idp-private-key.pem --cert idp-public-cert.pem
   ```

2. **Start the Service Provider (SP) Application**:

   ```bash
   node app.js
   ```

3. **Access the application**:
   Open your web browser and navigate to [http://localhost:3000](http://localhost:3000).

## Project Structure

This is how it should look given you've created the certificates correctly.
```
saml-demo-app/
├── app.js
├── package.json
├── private-key.pem
├── certificate.pem
├── idp-private-key.pem
├── idp-public-cert.pem
├── views/
│   ├── index.ejs
│   ├── welcome.ejs
└── README.md
```

## Contact

For any questions or issues, please contact [Dyst0rti0n](https://github.com/Dyst0rti0n).
