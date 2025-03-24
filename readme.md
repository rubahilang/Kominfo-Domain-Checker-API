# Komdigi/Kominfo Domain Checker API

This API checks whether a domain is flagged as "nawala" (blocked) or "internet positive" according to Komdigi/Kominfo guidelines.

## Features

- **Domain Verification**: Checks if a domain is accessible or blocked.
- **Multiple Domain Support**: Query one or more domains using the `domain` or `domains` parameter.
- **Redirect Handling**: Detects if a domain redirects to a different root domain, which may indicate blocking.
- **SSL Bypass**: Uses an HTTPS agent to bypass SSL certificate verification issues.
- **Detailed Logging**: Provides comprehensive logging of HTTP statuses and redirection details.

# WARNING!!
## This script does not use Trust Positive Database, this script will only work if you use an Indonesian ISP as your network to run this script.

# Installation

1. **Clone the Repository**

```sh
git clone https://github.com/rubahilang/Kominfo-Domain-Checker-API
```

2. **Navigate to the Project Directory**

```sh
cd repository
```

3. **Install Dependencies**

```sh
npm install
```

## Usage

### Running the Server

Start the server with:

```sh
npm start
```

The server will be accessible at `http://localhost:3000`.

### API Endpoints

- **Single Domain Check**

  Send a GET request with the `domain` parameter:

  `http://localhost:3000/?domain=example.com`

- **Multiple Domains Check**

  Send a GET request with the `domains` parameter (comma-separated):

  `http://localhost:3000/?domains=example.com,example.org`

_Note: This README provides an overview and usage instructions. The complete source code is available in the repository._

## License

This project is licensed under the [MIT License](LICENSE).

## Contributing

Contributions, issues, and feature requests are welcome. Please fork the repository and submit a pull request.

## Contact

For further questions, please contact [email@example.com](mailto:email@example.com).
