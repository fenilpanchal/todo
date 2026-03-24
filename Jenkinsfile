
pipeline {
    agent { label 'docker' }   // LOCAL AGENT

    parameters {
        string(name: 'BRANCH', defaultValue: 'main', description: 'Git Branch')
        string(name: 'DOCKER_IMAGE', defaultValue: 'yourdockerhub/app', description: 'Docker Image Name')
        string(name: 'TAG', defaultValue: 'latest', description: 'Image Tag')

        string(name: 'REMOTE_HOST', defaultValue: '192.168.1.10', description: 'Remote Server IP')
        string(name: 'REMOTE_USER', defaultValue: 'test2', description: 'Remote Username')
        string(name: 'REMOTE_DIR', defaultValue: '/home/test2/app', description: 'Deployment Directory')
    }

    stages {

        // 🔹 1. Show Parameters
        stage('Fetch Parameters') {
            steps {
                echo "Branch: ${params.BRANCH}"
                echo "Docker Image: ${params.DOCKER_IMAGE}:${params.TAG}"
                echo "Deploying to: ${params.REMOTE_USER}@${params.REMOTE_HOST}"
            }
        }

        // 🔹 2. Clone Repository
        stage('Clone Repository') {
            steps {
                git branch: "${params.BRANCH}", url: "https://github.com/your-username/your-repo.git"
            }
        }

        // 🔹 3. Build Docker Image
        stage('Build Docker Image') {
            steps {
                sh """
                docker build -t ${params.DOCKER_IMAGE}:${params.TAG} .
                """
            }
        }

        // 🔹 4. Push to DockerHub
        stage('Push to DockerHub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh """
                    echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                    docker push ${params.DOCKER_IMAGE}:${params.TAG}
                    """
                }
            }
        }

        // 🔹 5. Prepare Remote Directory
        stage('Prepare Remote Server') {
            steps {
                sh """
                ssh ${params.REMOTE_USER}@${params.REMOTE_HOST} "mkdir -p ${params.REMOTE_DIR}"
                """
            }
        }

        // 🔹 6. Copy Required Files
        stage('Transfer Files') {
            steps {
                sh """
                scp docker-compose.yml ${params.REMOTE_USER}@${params.REMOTE_HOST}:${params.REMOTE_DIR}/
                """
            }
        }

        // 🔹 7. Deploy on Remote Server
        stage('Deploy Application') {
            steps {
                sh """
                ssh ${params.REMOTE_USER}@${params.REMOTE_HOST} '
                    cd ${params.REMOTE_DIR}
                    docker pull ${params.DOCKER_IMAGE}:${params.TAG}
                    docker-compose down || true
                    docker-compose up -d
                '
                """
            }
        }
    }

    post {
        success {
            echo "✅ Deployment Successful!"
        }
        failure {
            echo "❌ Deployment Failed!"
        }
    }
}


