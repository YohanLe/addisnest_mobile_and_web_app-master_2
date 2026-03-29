# Deploying the AddisNest Application to AWS EC2

This guide provides a step-by-step process for deploying the AddisNest application to an AWS EC2 instance.

## 1. Setting up the EC2 Instance on AWS

This section guides you through creating and configuring an EC2 instance from the AWS Management Console.

### 1.1. Log in to AWS and Navigate to EC2
- Log in to your [AWS Management Console](https://aws.amazon.com/console/).
- In the search bar, type "EC2" and select it from the results.

### 1.2. Launch a New EC2 Instance
1.  Click the **"Launch instance"** button.
2.  **Name:** Give your instance a descriptive name, like `addisnest-production-server`.
3.  **Application and OS Images (Amazon Machine Image):** Select **"Ubuntu"**. The latest LTS version is a good choice (e.g., Ubuntu Server 22.04 LTS).
4.  **Instance type:** Choose an instance type. For development or a small application, `t2.micro` or `t3.micro` (often free-tier eligible) is a good starting point.
5.  **Key pair (login):**
    - If you don't have a key pair, click **"Create new key pair"**.
    - Give it a name (e.g., `addisnest-ec2-key`).
    - Select **"RSA"** for the key pair type and **".pem"** for the private key file format.
    - Click **"Create key pair"**. Your browser will download the `.pem` file. **Store this file securely; you will not be able to download it again.**
6.  **Network settings:**
    - Click **"Edit"**.
    - **Security group name:** Create a new security group, e.g., `addisnest-sg`.
    - **Description:** Add a description like "Security group for AddisNest web server".
    - **Inbound security groups rules:**
        - **Rule 1 (SSH):**
            - **Type:** SSH
            - **Source type:** My IP (This is more secure, but if your IP changes, you'll need to update it. For simplicity, you can use `Anywhere` (0.0.0.0/0), but be aware of the security implications).
        - **Rule 2 (HTTP):**
            - Click **"Add security group rule"**.
            - **Type:** HTTP
            - **Source type:** Anywhere (0.0.0.0/0)
        - **Rule 3 (HTTPS):**
            - Click **"Add security group rule"**.
            - **Type:** HTTPS
            - **Source type:** Anywhere (0.0.0.0/0)
7.  **Configure storage:** The default 8 GB is usually fine for a small application, but you can increase it if needed.
8.  **Launch instance:** Review the summary and click **"Launch instance"**.

### 1.3. Find Your EC2 Public IP
- After launching, go to your EC2 Instances list.
- Select your newly created instance.
- In the details pane below, you will find the **"Public IPv4 address"**. This is the IP you will use to connect via SSH and access your application.

## 2. Connecting to Your EC2 Instance

Connect to your EC2 instance via SSH. Open a terminal and use the following command, replacing the placeholders with your actual `.pem` file path and public IP address.

**On macOS/Linux:**
First, ensure your key file has the correct permissions:
```bash
chmod 400 /path/to/your-key.pem
```

**Connect:**

```bash
ssh -i /path/to/your-key.pem ubuntu@your-ec2-public-ip
```

**On Windows:**
You can use an SSH client like PuTTY or the built-in SSH client in PowerShell/CMD.

```powershell
ssh -i C:\path\to\your-key.pem ubuntu@your-ec2-public-ip
```
> **Note:** From here on, `your-ec2-public-ip` refers to the **Public IPv4 address** you found in step 1.3.
```

### 2.1. Update the System on EC2

```bash
sudo apt update
sudo apt upgrade -y
```

### 2.2. Install Node.js and npm

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Verify the installation:

```bash
node -v
npm -v
```

### 2.3. Install PM2 (Process Manager)

PM2 will keep your application running in the background.

```bash
sudo npm install -g pm2
```

### 2.4. Install Nginx (Web Server)

Nginx will act as a reverse proxy, directing traffic to your Node.js application.

```bash
sudo apt-get install -y nginx
```

Start and enable Nginx:

```bash
sudo systemctl start nginx
sudo systemctl enable nginx
```

## 3. Code Deployment

### 3.1. Clone the Repository

Clone your application's repository onto the EC2 instance.

```bash
git clone https://github.com/YohanLe/addisnest_mobile_and_web_app.git
cd addisnest_mobile_and_web_app
```

## 4. Application Setup

### 4.1. Install Dependencies

```bash
npm install
```

### 4.2. Configure Environment Variables

Create a `.env` file from the example:

```bash
cp .env.example .env
```

Edit the `.env` file with your production configuration (database connection string, API keys, etc.).

```bash
nano .env
```

### 4.3. Build the Application (if necessary)

If your project has a build step, run it now. Based on your `package.json`, you might have a `build` script.

```bash
# Example build command, adjust if necessary
# npm run build
```

## 5. Running the Application

### 5.1. Start the Application with PM2

Start your Node.js server with PM2. Your main server file seems to be `app-launcher.js` or a similar script.

```bash
pm2 start app-launcher.js --name addisnest-app
```

### 5.2. Configure PM2 to Start on Boot

```bash
pm2 startup
```

Follow the instructions provided by the command to complete the setup.

### 5.3. Save the PM2 Process List

```bash
pm2 save
```

## 6. Configure Nginx as a Reverse Proxy

### 6.1. Create an Nginx Configuration File

Create a new Nginx configuration file for your application.

```bash
sudo nano /etc/nginx/sites-available/addisnest
```

Add the following configuration, assuming your application runs on port 3000 (adjust if necessary):

```nginx
server {
    listen 80;
server_name your-ec2-public-ip; # Replace with your Public IPv4 address or your domain name

    location / {
        proxy_pass http://localhost:3000; # Or whatever port your app runs on
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 6.2. Enable the Nginx Configuration

Create a symbolic link to the `sites-enabled` directory.

```bash
sudo ln -s /etc/nginx/sites-available/addisnest /etc/nginx/sites-enabled
```

### 6.3. Test and Restart Nginx

Test the Nginx configuration for syntax errors.

```bash
sudo nginx -t
```

If the test is successful, restart Nginx.

```bash
sudo systemctl restart nginx
```

## 7. Access Your Application

You should now be able to access your application by navigating to your EC2 instance's public IP address or your configured domain name in a web browser.

## 8. (Optional) Deploying with Docker

As an alternative to the manual setup, you can deploy the application using Docker and Docker Compose. This method is generally recommended for its consistency and ease of management.

### 8.1. Install Docker and Docker Compose

Follow the official Docker documentation to install Docker and Docker Compose on your EC2 instance.

**Install Docker:**

```bash
sudo apt-get update
sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
sudo apt-get update
sudo apt-get install -y docker-ce
```

**Install Docker Compose:**

```bash
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 8.2. Clone the Repository

If you haven't already, clone your repository.

```bash
git clone https://github.com/YohanLe/addisnest_mobile_and_web_app.git
cd addisnest_mobile_and_web_app
```

### 8.3. Configure Environment Variables

Create a `.env` file for your production environment. The `docker-compose.yml` file will automatically pick it up.

```bash
cp .env.example .env
nano .env
```

Make sure to set `NODE_ENV=production` and fill in your database credentials and other secrets.

### 8.4. Build and Run with Docker Compose

Build the Docker image and start the container in detached mode.

```bash
sudo docker-compose up --build -d
```

Your application should now be running and accessible on port 3000. You can still use Nginx as a reverse proxy to handle incoming traffic on port 80, as described in section 6.

## 9. (Optional) Setting up a CI/CD Pipeline

For automated deployments, consider setting up a CI/CD pipeline using tools like GitHub Actions, Jenkins, or AWS CodePipeline. This will automatically deploy your code to the EC2 instance whenever you push changes to your repository.
