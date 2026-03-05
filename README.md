# Project: SuperBookingApp

## Table of Contents:

1.  Steps to Install and setup.

### Setup Guide

# SuperBookingApp Setup Guide

## Prerequisites

Ensure you have the following installed on your system:

- Python (3.8 or higher)
- Node.js (16.x or higher)
- Git

## Setup Instructions

### 1. Clone the Repository

1. Open a terminal.
2. Run the following command to clone the repository:

```bash
git clone <repository-url>
```

3. Navigate to the project directory:

```bash
cd SuperBookingApp
```

### 2. Backend Setup

#### Create and Activate Python Virtual Environment

1. Create a Python virtual environment:

```bash
python -m venv env
```

2. Activate the virtual environment:

- On Windows:

```bash
.\env\Scripts\activate
```

- On macOS/Linux:

```bash
source env/bin/activate
```

#### Install Python Dependencies

1. Install the required Python packages:

```bash
pip install -r requirements.txt
```

2. Navigate to the `backend` directory:

```bash
cd backend
```

### 3. Frontend Setup

1. Navigate back to the `frontend` directory:

```bash
cd ../frontend
```

2. Install the required Node.js packages:

```bash
npm install
```

## Running the Application

### Backend

1. Ensure the virtual environment is activated.
2. Run the Django development server:

```bash
python manage.py runserver
```

**Note:** Run this command at "backend/"

### Frontend

1. Start the frontend development server:

```bash
npm run dev
```

**Note:** Run this command at "frontend/"

## Notes

- Replace `<repository-url>` with the actual URL of the repository.
- Ensure the backend server is running before accessing the frontend.
- For any issues, refer to the project documentation or contact the project head.
