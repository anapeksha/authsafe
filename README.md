# AuthSafe

[![DockerCI](https://github.com/anapeksha/authsafe/actions/workflows/deployment-build-copy.yml/badge.svg)](https://github.com/anapeksha/authsafe/actions/workflows/deployment-build-copy.yml)

🚀 Connect with users effortlessly, secure their data with ease, and elevate your application's security to new heights. AuthSafe provides a seamless authentication service to handle all your security needs.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Contributing](#contributing)
- [License](#license)

## Installation

```bash
npm install
# or
yarn install
```

## Usage

Start the development server

```bash
npm dev
# or
yarn dev
```

Or build it for production

```bash
npm build
# or
yarn build
```

### Docker Usage

Pull the docker image

```bash
docker pull anapeksha/authsafe
```

Run the image

```bash
docker run -p 8080:8080 -e 'DATABASE_URL=postgresql://xxx' -e 'JWT_SECRET=xxxxxxxxxx' -v ${HOME}/logs:/usr/authsafe/app/logs anapeksha/authsafe
```

## Features

1. Seamless Authentication
2. JSON Web Token (JWT) integration
3. Built with Expressjs, lightweight
4. Scalable
5. Log maintenance system with Winston

## Endpoints

| Endpoint                   | Method   | Description         | Example request                                                                                 | Example response                                                                                       |
| -------------------------- | -------- | ------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `/auth/login`              | `POST`   | Login               | `POST /auth/login` `{"user":  {  "email":  "someone@example.com",  "password":  "12345678"  }}` | `{"message":"Logged in"}`                                                                              |
| `/auth/logout`             | `POST`   | Logout              | `POST /auth/logout`                                                                             | `{"message":"Logged out"}`                                                                             |
| `/user`                    | `GET`    | Get current user.   | `GET /user`                                                                                     | `{"id":"e53c4e44-65f5-4aa7-9cc3-758ac82be182","name":"John Doe","email":  "john.doe@example.com"}`     |
| `/user/create`             | `POST`   | Create new user     | `POST /user/create` `{"user":  {  "email":  "someone@example.com"  }}`                          | `{"user":  {  "email":  "someone-specific@example.com"}}`                                              |
| `/user/update`             | `PUT`    | Update current user | `PUT /user/update` `{"user":  {"name":  "John Dow"}}`                                           | `{"id": "e53c4e44-65f5-4aa7-9cc3-758ac82be182", "name": "John Doe", "email":  "john.doe@example.com"}` |
| `/user/delete`             | `DELETE` | Delete current user | `DELETE /user/delete`                                                                           | `{"id": "e53c4e44-65f5-4aa7-9cc3-758ac82be182", "name": "John Doe", "email":  "john.doe@example.com"}` |
| `/profile/change-password` | `PUT`    | Change password     | `PUT /profile/change-password` `{"user":  {  "password":  "123456"  }}`                         | `{"user":  {  "id": "e53c4e44-65f5-4aa7-9cc3-758ac82be182", "email":  "john.doe@example.com" }}`       |

## Contributing

1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a pull request.

## License

This project is distributed under the GPL 3.0 License. See `LICENSE` for more information.
