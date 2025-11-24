DevSecOps CI/CD : Deploying a Secure Hotstar Clone

GITHUB : 

Prerequisites



AWS account setup

Basic knowledge of AWS services

Understanding of DevSecOps principles

Familiarity with Docker, Jenkins, Java, SonarQube, AWS CLI, Kubectl, and Terraform,Docker Scout

Step-by-Step Deployment Process

Step 1: Setting up AWS EC2 Instance

Creating an EC2 instance with Ubuntu AMI, t2.large, and 30 GB storage

Assigning an IAM role with Admin access for learning purposes

Step 2: Installation of Required Tools on the Instance

Writing a script to automate the installation of:

Docker

Jenkins

Java

SonarQube container

AWS CLI

Kubectl

Terraform

Step 3: Jenkins Job Configuration

Creating Jenkins jobs for:

Creating an EKS cluster

Deploying the Hotstar clone application

Configuring the Jenkins job stages:

Sending files to SonarQube for static code analysis

Running npm install

Implementing OWASP for security checks

Installing and running Docker Scout for container security

Scanning files and Docker images with Docker Scout

Building and pushing Docker images

Deploying the application to the EKS cluster



Step 4: Clean-Up Process

Removing the EKS cluster

Deleting the IAM role

Terminating the Ubuntu instance



STEP 1A: Setting up AWS EC2 Instance and IAM Role

Sign in to the AWS Management Console: Access the AWS Management Console using your credentials

Navigate to the EC2 Dashboard: Click on the “Services” menu at the top of the page and select “EC2” under the “Compute” section. This will take you to the EC2 Dashboard.

Launch Instance: Click on the “Instances” link on the left sidebar and then click the “Launch Instance” button.

Choose an Amazon Machine Image (AMI): In the “Step 1: Choose an Amazon Machine Image (AMI)” section:

Select “AWS Marketplace” from the left-hand sidebar.

Search for “Ubuntu” in the search bar and choose the desired Ubuntu AMI (e.g., Ubuntu Server 24.04 LTS).

Click on “Select” to proceed.

Choose an Instance Type: In the “Step 2: Choose an Instance Type” section:

Scroll through the instance types and select “t2.large” from the list.

Click on “Next: Configure Instance Details” at the bottom.

Configure Instance Details: In the “Step 3: Configure Instance Details” section, you can leave most settings as default for now. However, you can configure settings like the network, subnet, IAM role, etc., according to your requirements.

Once done, click on “Next: Add Storage.”

Add Storage: In the “Step 4: Add Storage” section:

You can set the size of the root volume (usually /dev/sda1) to 30 GB by specifying the desired size in the “Size (GiB)” field.

Customize other storage settings if needed.

Click on “Next: Add Tags” when finished.

Add Tags (Optional): In the “Step 5: Add Tags” section, you can add tags to your instance for better identification and management. This step is optional but recommended for organizational purposes.

Click on “Next: Configure Security Group” when done.

Configure Security Group: In the “Step 6: Configure Security Group” section:

Create a new security group or select an existing one.

Ensure that at least SSH (port 22) is open for inbound traffic to allow remote access.

You might also want to open other ports as needed for your application’s requirements.

Click on “Review and Launch” when finished.

Review and Launch: Review the configuration details of your instance. If everything looks good:

Click on “Launch” to proceed.

A pop-up will prompt you to select or create a key pair. Choose an existing key pair or create a new one.

Finally, click on “Launch Instances.”

Accessing the Instance: Once the instance is launched, you can connect to it using SSH. Use the private key associated with the selected key pair to connect to the instance’s public IP or DNS address.

STEP 1B: IAM ROLE

Search for IAM in the search bar of AWS and Click on Create Role

Select entity type as AWS service

Use case as EC2 and click on Next.

For permission policy select Administrator Access (Just for learning purpose), click Next.

Provide a Name for Role and click on Create role.





Now Attach this role to EC2 Instance that we created earlier, so we can provision cluster from that instance.

Click on Actions –> Security –> Modify IAM role.



Step 2: Installation of Required Tools on the Instance

vi script1.sh

#!/bin/bash

sudo apt update -y

sudo apt install openjdk-17-jre -y

sudo wget -O /usr/share/keyrings/jenkins-keyring.asc \

  https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key

echo "deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc]" \

 https://pkg.jenkins.io/debian-stable binary/ | sudo tee \

 /etc/apt/sources.list.d/jenkins.list > /dev/null sudo apt-get update

sudo apt-get install jenkins -y



Now make the script1.sh executable;

sudo chmod +x script1.sh

Now apply by using below command;

./script1.sh



vi script2.sh

#!/bin/bash

sudo apt update -y sudo apt-get update

sudo apt install docker.io -y

sudo chmod 666 /var/run/docker.sock

sudo apt-get install -y apt-transport-https ca-certificates curl gpg sudo mkdir -p -m 755 /etc/apt/keyrings

curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.28/deb/Release.key | sudo gpg --dearmor -o

/etc/apt/keyrings/kubernetes-apt-keyring.gpg

echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.28/deb/ /' | sudo tee /etc/apt/sources.list.d/kubernetes.list sudo apt-get update

sudo apt-get install -y kubelet kubeadm kubectl sudo systemctl enable --now kubelet



#install terraform

sudo apt-get install -y gnupg software-properties-common wget -O- https://apt.releases.hashicorp.com/gpg | \

gpg --dearmor | \

sudo tee /usr/share/keyrings/hashicorp-archive-keyring.gpg > /dev/null gpg --no-default-keyring \

--keyring /usr/share/keyrings/hashicorp-archive-keyring.gpg \

--fingerprint

echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] \ https://apt.releases.hashicorp.com $(lsb_release -cs) main" | \

sudo tee /etc/apt/sources.list.d/hashicorp.list sudo apt update && sudo apt-get install terraform



#install Aws cli

curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" sudo apt install unzip

unzip awscliv2.zip sudo ./aws/install



Now make the script2.sh executable;

sudo chmod +x script2.sh

Now apply by using below command;

./script2.sh



Now time to SonarQube installation;

docker run -d --name sonar -p 9000:9000 sonarqube:lts-community



Now copy the public IP address of ec2 and paste it into the browser with :8080 for jenkins





Now, install the suggested plugins.









Now Copy the public IP again and paste it into a new tab in the browser with 9000



Note:- Initial username & password both are admin, you will have to change as per your choice



Step 3A: Jenkins Job Configuration

That is done now go to Jenkins and add a terraform plugin to provision the AWS EKS using the Pipeline Job. Go to Jenkins dashboard –> Manage Jenkins –> Plugins

Available Plugins, Search for Terraform and install it.





let’s find the path to our Terraform (we will use it in the tools section of Terraform) which terraform



Now come back to Manage Jenkins –> Tools Add the terraform in Tools





























Apply and save.

CHANGE YOUR S3 BUCKET NAME IN THE BACKEND.TF



Now create a new job for the Eks provision



I want to do this with build parameters to apply and destroy while building only. you have to add this inside job like the below image



Let’s add a pipeline pipeline{

agent any stages {

stage('Checkout from Git'){ steps{

git branch: 'main', url: ' https://github.com/Bijan1235/Hotstar-Clone.git'

}

}

stage('Terraform version'){ steps{

sh 'terraform --version'

}

}

stage('Terraform init'){ steps{

dir('EKS_TERRAFORM') {

sh 'terraform init'

}

}



}

stage('Terraform validate'){ steps{

dir('EKS_TERRAFORM') {

sh 'terraform validate'

}

}

}

stage('Terraform plan'){ steps{

dir('EKS_TERRAFORM') {

sh 'terraform plan'

}

}

}

stage('Terraform apply/destroy'){ steps{

dir('EKS_TERRAFORM') {

sh 'terraform ${action} --auto-approve'

}

}

}

}

}





let’s apply and save and Build with parameters and select action as apply







Check in Your Aws console whether it created EKS or not.



Ec2 instance is created for the Node group







Step 3B: Hotstar job

Go to Jenkins dashboard



Manage Jenkins –> Plugins –> Available Plugins



Search for the Below Plugins



Eclipse Temurin installer Sonarqube Scanner NodeJs

Owasp Dependency-Check Docker

Docker Commons Docker Pipeline Docker API Docker-build-step





Configure in Global Tool Configuration

Go to Manage Jenkins → Tools → Install JDK(17) and NodeJs(22)→ Click on Apply and Save





For Sonarqube use the latest version





For Owasp use the 10.0.3 version



Use the latest version of Docker



Click apply and save.

Configure Sonar Server in Manage Jenkins

Grab the Public IP Address of your EC2 Instance, Sonarqube works on Port 9000, so <Public IP>:9000. Goto

your Sonarqube Server. Click on Administration → Security → Users → Click on Tokens and Update Token

→ Give it a name → and click on Generate Token





click on update Token



Create a token with a name and generate



copy Token

Go to Jenkins Dashboard → Manage Jenkins → Credentials → Add Secret Text. It should look like this





You will this page once you click on create



Now, go to Dashboard → Manage Jenkins → System and Add like the below image.





Click on Apply and Save

In the Sonarqube Dashboard add a quality gate also Administration–> Configuration–>Webhooks

Click on Create Add details



Now add Docker credentials to the Jenkins to log in and push the image Manage Jenkins –> Credentials –> global –> add credential

Add DockerHub Username and Password under Global Credentials Now install Docker Scout on instance CLI;

docker login	#use credentials to login

curl -sSfL https://raw.githubusercontent.com/docker/scout-cli/main/install.sh | sh -s -- -b /usr/local/bin

Pipeline upto Docker

pipeline{ agent any tools{

jdk 'jdk17' nodejs 'node22'

}

environment {

SCANNER_HOME=tool 'sonar-scanner'

}

stages {

stage('clean workspace'){ steps{

cleanWs()

}



}

stage('Checkout from Git'){ steps{

git branch: 'main', url: ' https://github.com/Bijan1235/Hotstar-Clone.git'

}

}

stage("Sonarqube Analysis "){ steps{

withSonarQubeEnv('sonar-server') {

sh ''' $SCANNER_HOME/bin/sonar-scanner -Dsonar.projectName=Hotstar \

-Dsonar.projectKey=Hotstar'''

}

}

}

stage("quality gate"){ steps {

script {

waitForQualityGate abortPipeline: false, credentialsId: 'Sonar-token'

}

}

}

stage('Install Dependencies') { steps {

sh "npm install"

}

}

stage('OWASP FS SCAN') {

steps {

dependencyCheck additionalArguments: '--scan ./ --disableYarnAudit --disableNodeAudit', odcInstallation: 'DP-Check'

dependencyCheckPublisher pattern: '**/dependency-check-report.xml'

}

}



stage('Docker Scout FS') { steps {

script{

withDockerRegistry(credentialsId: 'docker', toolName: 'docker'){ sh 'docker-scout quickview fs://.'

sh 'docker-scout cves fs://.'

}

}

}

}

stage("Docker Build & Push"){ steps{

script{

withDockerRegistry(credentialsId: 'docker', toolName: 'docker'){ sh "docker build -t hotstar ."

sh "docker tag hotstar bijan9438/hotstar:latest " sh "docker push bijan9438/hotstar:latest"

}

}

}

}

stage('Docker Scout Image') { steps {

script{

withDockerRegistry(credentialsId: 'docker', toolName: 'docker'){ sh 'docker-scout quickview bijan9438/hotstar:latest'

sh 'docker-scout cves bijan9438/hotstar:latest'

sh 'docker-scout recommendations bijan9438/hotstar:latest'

}

}

}

}



stage("deploy_docker"){ steps{

sh "docker run -d --name hotstar -p 3000:3000 bijan9438/hotstar:latest"

}

}

}

}

Click on Apply and save. Build now

To see the report, you can go to Sonarqube Server and go to Projects.



You can see the report has been generated and the status shows as passed.

OWASP, You will see that in status, a graph will also be generated and Vulnerabilities.





Let’s See Docker Scout File scan report



When you log in to Dockerhub, you will see a new image is created



Let’s See Docker Scout Image analysis





Cves



Recommendations



Deploy to Container

<ec2publicip:3000>



Output



Go to instance CLI and write;

aws eks update-kubeconfig --name EKS_CLOUD --region ap-south-1 Let’s see the nodes

kubectl get nodes



Now Give this command in CLI cat /root/.kube/config

Copy the config file to Jenkins master or the local file manager and save it Install Kubernetes Plugin, Once it’s installed successfully





goto manage Jenkins –> manage credentials –> Click on Jenkins global –> add credentials



final step to deploy on the Kubernetes cluster stage('Deploy to kubernets'){

steps{

script{

dir('K8S') {

withKubeConfig(caCertificate: '', clusterName: '', contextName: '', credentialsId: 'k8s', namespace: '', restrictKubeConfigAccess: false, serverUrl: '') {

sh 'kubectl apply -f deployment.yml' sh 'kubectl apply -f service.yml'

}

}

}

}

}

Give the command after pipeline success kubectl get all





Copy the External IP and paste it in your browser, You will see output like this.



Step 4: Destruction

Now Go to Jenkins Dashboard and click on Terraform-Eks job And build with parameters and destroy action

It will delete the EKS cluster that provisioned



After 10 minutes cluster will delete and wait for it. Don’t remove ec2 instance till that time.





Cluster deleted



Delete the Ec2 instance & IAM role.

Check the load balancer also if it is deleted or not.

Finally completing the journey of deploying Hotstar clone using DevSecOps practices on AWS!

This process has highlighted the power of integrating security measures seamlessly into the deployment pipeline, ensuring not only efficiency but also a robust shield against potential threats.



Key Highlights:

Leveraging AWS services, Docker, Jenkins, and security tools, we orchestrated a secure and automated deployment pipeline.

Implementing DevSecOps principles helped fortify the application against vulnerabilities through continuous security checks.

The seamless integration of static code analysis, container security, and automated deployment showcases the strength of DevSecOps methodologies.

PORTS(UNLOCKED FOR THIS PROJECT):

