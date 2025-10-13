# Expense Sharing Backend

A Spring Boot backend application for managing expense sharing among groups.

## Features

- Create and manage expense groups
- Add and track expenses
- Split expenses among participants
- Get expense statistics and analytics
- RESTful API with JSON responses
- MySQL database integration
- Input validation and error handling

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+
- IDE (Eclipse, IntelliJ IDEA, etc.)

## Setup Instructions

### 1. Database Setup
Create a MySQL database:
```sql
CREATE DATABASE expense_sharing_db;
```

### 2. Configure Database Connection
Update `src/main/resources/application.properties` with your MySQL credentials:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/expense_sharing_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD
```

### 3. Build and Run
```bash
# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

## API Endpoints

### Groups
- `POST /groups` - Create a new group
- `GET /groups` - Get all groups
- `GET /groups/{id}` - Get group by ID

### Expenses
- `POST /expenses` - Create a new expense
- `GET /expenses` - Get all expenses
- `GET /expenses/{id}` - Get expense by ID
- `POST /expenses/split` - Split an expense
- `GET /expenses/stats` - Get expense statistics

## Data Models

### Group
```json
{
  "id": 1,
  "name": "Trip to Paris",
  "description": "Vacation expenses",
  "members": ["John", "Jane", "Bob"],
  "createdAt": "2024-01-15T10:30:00"
}
```

### Expense
```json
{
  "id": 1,
  "title": "Restaurant Bill",
  "amount": 120.50,
  "date": "2024-01-15T19:30:00",
  "paidBy": "John",
  "participants": ["John", "Jane", "Bob"],
  "groupId": 1,
  "createdAt": "2024-01-15T20:00:00"
}
```

### Split Request
```json
{
  "expenseId": 1
}
```

### Split Response
```json
[
  {
    "participant": "John",
    "amount": 40.17
  },
  {
    "participant": "Jane",
    "amount": 40.17
  },
  {
    "participant": "Bob",
    "amount": 40.16
  }
]
```

## Eclipse Import Instructions

1. Open Eclipse IDE
2. File → Import → Existing Maven Projects
3. Browse to the project directory
4. Select the project and click Finish
5. Wait for Maven dependencies to download
6. Right-click project → Run As → Spring Boot App

## Technologies Used

- **Framework**: Spring Boot 3.2.1
- **Language**: Java 17
- **Database**: MySQL 8.0
- **ORM**: JPA/Hibernate
- **Build Tool**: Maven
- **Validation**: Bean Validation (Hibernate Validator)
- **Testing**: JUnit 5, Spring Boot Test

## CORS Configuration

CORS is pre-configured to allow requests from any origin. For production, update the CORS configuration in `WebConfig.java` to restrict origins as needed.

## Error Handling

The application includes comprehensive error handling with:
- Custom exception classes
- Global exception handler
- Proper HTTP status codes
- Detailed error messages

## Testing

Run tests with:
```bash
mvn test
```

## Production Deployment

1. Update `application.properties` for production database
2. Set `spring.jpa.hibernate.ddl-auto=validate` in production
3. Configure proper CORS origins
4. Add authentication/authorization if needed
5. Build with `mvn clean package`
6. Deploy the generated JAR file"# ExpenseSharingBackend" 
