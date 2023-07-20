# Define the base image
FROM python:3.8

# This file must be run from the project root!

# Set the working directory in the container
WORKDIR /strategies

# Copy the requirements file
COPY /strategies/requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the code
COPY /strategies/ .

# Expose the port the app runs in
EXPOSE 4000

# The command to run the app
CMD [ "python3", "./main.py" ]
