Sure! Here is your **fully formatted, clean, professional, GitHub-ready `README.md`** for your **DevSecOps CI/CD: Secure Hotstar Clone Deployment** project.

---

# 🚀 DevSecOps CI/CD: Deploying a Secure Hotstar Clone

### **GitHub Repository**

🔗 **[https://github.com/Bijan1235/Hotstar-Clone.git](https://github.com/Bijan1235/Hotstar-Clone.git)**

---

## 📌 **Overview**

This project demonstrates how to deploy a **Hotstar Clone** application on AWS using a **complete DevSecOps pipeline**. It integrates infrastructure automation, continuous integration, continuous deployment, and continuous security using tools like **Terraform, Jenkins, SonarQube, Docker, Kubernetes (EKS), Docker Scout, OWASP**, and AWS services.

---

## 🧰 **Prerequisites**

* AWS Account
* Basic AWS Knowledge
* Understanding of DevSecOps Principles
* Familiarity With:

  * Docker
  * Jenkins
  * Java
  * SonarQube
  * AWS CLI
  * Kubectl
  * Terraform
  * Docker Scout

---

# 🏗️ Step-by-Step Deployment Process

---

# **Step 1 — Setup AWS EC2 Instance & IAM Role**

## **1A: Launch EC2 Instance**

1. Open AWS Console → EC2
2. Launch Instance
3. Select **Ubuntu Server 24.04 LTS**
4. Choose **t2.large**
5. Add **30GB** storage
6. Configure Security Group:

   * Allow **SSH (22)**
   * Allow required app ports later
7. Launch with a key pair
8. Connect via SSH once ready

## **1B: Create IAM Role for EC2**

1. Go to **IAM**
2. Create Role → AWS Service → EC2
3. Attach **AdministratorAccess** (for learning only)
4. Name and create role
5. Attach role to EC2:

   * EC2 → Actions → Security → Modify IAM Role

---

# **Step 2 — Install Required Tools on EC2**

### Create script1.sh

```bash
#!/bin/bash
sudo apt update -y
sudo apt install openjdk-17-jre -y
sudo wget -O /usr/share/keyrings/jenkins-keyring.asc https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key
echo "deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] https://pkg.jenkins.io/debian-stable binary/" | sudo tee /etc/apt/sources.list.d/jenkins.list > /dev/null
sudo apt-get update
sudo apt-get install jenkins -y
```

Run:

```bash
sudo chmod +x script1.sh
./script1.sh
```

---

### Create script2.sh

```bash
#!/bin/bash
sudo apt update -y
sudo apt install docker.io -y
sudo chmod 666 /var/run/docker.sock

# Install kubectl
sudo apt-get install -y apt-transport-https ca-certificates curl gpg
sudo mkdir -p -m 755 /etc/apt/keyrings
curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.28/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
echo "deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.28/deb/ /" | sudo tee /etc/apt/sources.list.d/kubernetes.list
sudo apt-get update
sudo apt-get install -y kubelet kubeadm kubectl
sudo systemctl enable --now kubelet

# Install Terraform
sudo apt-get install -y gnupg software-properties-common
wget -O- https://apt.releases.hashicorp.com/gpg | gpg --dearmor | sudo tee /usr/share/keyrings/hashicorp-archive-keyring.gpg > /dev/null
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
sudo apt update && sudo apt-get install terraform -y

# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
sudo apt install unzip -y
unzip awscliv2.zip
sudo ./aws/install
```

Run:

```bash
sudo chmod +x script2.sh
./script2.sh
```

---

### Install SonarQube

```bash
docker run -d --name sonar -p 9000:9000 sonarqube:lts-community
```

Access UI:
👉 **http://EC2_PUBLIC_IP:9000**
Default login:

* **username:** admin
* **password:** admin

---

# **Step 3 — Jenkins CI/CD Configuration**

Install plugins:

* Terraform
* SonarQube Scanner
* NodeJS
* Eclipse Temurin (JDK)
* OWASP Dependency Check
* Docker
* Docker Pipeline
* Docker Scout

Add tools in **Manage Jenkins → Tools**:

* JDK 17
* Node 22
* Sonar Scanner
* OWASP 10.0.3
* Docker

---

## **3A — EKS Provisioning Job (Terraform)**

Add pipeline:

```groovy
pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/Bijan1235/Hotstar-Clone.git'
            }
        }

        stage('Terraform Init') {
            steps {
                dir('EKS_TERRAFORM') {
                    sh 'terraform init'
                }
            }
        }

        stage('Terraform Validate') {
            steps {
                dir('EKS_TERRAFORM') {
                    sh 'terraform validate'
                }
            }
        }

        stage('Terraform Plan') {
            steps {
                dir('EKS_TERRAFORM') {
                    sh 'terraform plan'
                }
            }
        }

        stage('Terraform Apply/Destroy') {
            steps {
                dir('EKS_TERRAFORM') {
                    sh "terraform ${action} --auto-approve"
                }
            }
        }
    }
}
```

Trigger with **Build With Parameters → apply**
After 10 min, EKS cluster will be created.

---

## **3B — Hotstar Build Pipeline**

### Configure SonarQube Token

Add in Jenkins Credentials → **Secret Text**

### Configure Docker Credentials

Add DockerHub credentials as "docker"

### Install Docker Scout

```bash
docker login
curl -sSfL https://raw.githubusercontent.com/docker/scout-cli/main/install.sh | sh -s -- -b /usr/local/bin
```

---

### Full CI/CD Pipeline

```groovy
pipeline {
    agent any

    tools {
        jdk 'jdk17'
        nodejs 'node22'
    }

    environment {
        SCANNER_HOME = tool 'sonar-scanner'
    }

    stages {

        stage('Clean Workspace') {
            steps { cleanWs() }
        }

        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/Bijan1235/Hotstar-Clone.git'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('sonar-server') {
                    sh '''
                        $SCANNER_HOME/bin/sonar-scanner \
                        -Dsonar.projectName=Hotstar \
                        -Dsonar.projectKey=Hotstar
                    '''
                }
            }
        }

        stage('Quality Gate') {
            steps {
                script {
                    waitForQualityGate abortPipeline: false, credentialsId: 'Sonar-token'
                }
            }
        }

        stage('Install Dependencies') {
            steps { sh "npm install" }
        }

        stage('OWASP Scan') {
            steps {
                dependencyCheck additionalArguments: '--scan ./ --disableYarnAudit --disableNodeAudit',
                                odcInstallation: 'DP-Check'
                dependencyCheckPublisher pattern: '**/dependency-check-report.xml'
            }
        }

        stage('DockerScout File Scan') {
            steps {
                script {
                    withDockerRegistry(credentialsId: 'docker', toolName: 'docker') {
                        sh 'docker-scout quickview fs://.'
                        sh 'docker-scout cves fs://.'
                    }
                }
            }
        }

        stage('Docker Build & Push') {
            steps {
                script {
                    withDockerRegistry(credentialsId: 'docker', toolName: 'docker') {
                        sh "docker build -t hotstar ."
                        sh "docker tag hotstar bijan9438/hotstar:latest"
                        sh "docker push bijan9438/hotstar:latest"
                    }
                }
            }
        }

        stage('DockerScout Image Scan') {
            steps {
                script {
                    withDockerRegistry(credentialsId: 'docker', toolName: 'docker') {
                        sh 'docker-scout quickview bijan9438/hotstar:latest'
                        sh 'docker-scout cves bijan9438/hotstar:latest'
                        sh 'docker-scout recommendations bijan9438/hotstar:latest'
                    }
                }
            }
        }

        stage('Deploy Docker Locally') {
            steps {
                sh "docker run -d --name hotstar -p 3000:3000 bijan9438/hotstar:latest"
            }
        }
    }
}
```

---

# **Deploy to Kubernetes (EKS)**

Configure kubeconfig:

```bash
aws eks update-kubeconfig --name EKS_CLOUD --region ap-south-1
```

Create Kubernetes credentials in Jenkins.

Add final stage:

```groovy
stage('Deploy to Kubernetes') {
    steps {
        script {
            dir('K8S') {
                withKubeConfig(credentialsId: 'k8s') {
                    sh 'kubectl apply -f deployment.yml'
                    sh 'kubectl apply -f service.yml'
                }
            }
        }
    }
}
```

Verify:

```bash
kubectl get all
```

Copy **External IP** → Open in browser.

---

# 🔥 Output Screenshot (Final UI)

Open:

```
http://<EXTERNAL-IP>:3000
```

---

# 🧨 Step 4 — Cleanup (Destroy Everything)

Run Terraform Job → Choose **destroy**.

Delete:

* EC2 instance
* IAM role
* Load balancer

---

# 🎉 Final Notes

This project demonstrates a complete **DevSecOps pipeline** integrating:

✔ Infrastructure Automation (Terraform)
✔ CI/CD (Jenkins)
✔ Static Code Analysis (SonarQube)
✔ Dependency Vulnerability Scan (OWASP)
✔ Container Security (Docker Scout)
✔ Secure Deployments (Docker + Kubernetes + EKS)

Security is applied at every stage from development to deployment.

---

# 🔓 Ports Used

| Service      | Port            |
| ------------ | --------------- |
| Jenkins      | 8080            |
| SonarQube    | 9000            |
| Hotstar App  | 3000            |
| Docker       | Default         |
| EKS Services | 3000, NodePorts |

---

If you want, I can also:
✅ Add a **project diagram**
✅ Add badges (build passing, SonarQube quality, Docker pulls)
✅ Generate this README as a downloadable file

Just tell me!
